/**
 * Checkers Gate API — Cloudflare Worker
 *
 * Endpoints:
 *   POST /register   { "userId": "123" }  → сохранить, что у пользователя есть расширение
 *   GET  /rank/:id                        → { rank: "king"|"queen"|"pawn"|"none" }
 *   GET  /health                          → { ok: true }
 *
 * Setup:
 * 1. Cloudflare Dashboard → Workers & Pages → Create Worker
 * 2. Вставь этот код
 * 3. Settings → Variables → KV Namespace Bindings → Add: name = USERS
 * 4. Создай KV namespace (например checkers-gate-users) и привяжи
 * 5. Deploy → скопируй URL вида https://checkers-gate.xxx.workers.dev
 */

const SPECIAL = {
  "1515075892": "king",
  "1388899632": "queen"
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // GET /health
    if (request.method === "GET" && path === "/health") {
      return json({ ok: true, service: "checkers-gate" });
    }

    // GET /rank/:userId
    if (request.method === "GET" && path.startsWith("/rank/")) {
      const userId = path.slice("/rank/".length).replace(/[^0-9]/g, "");
      if (!userId) return json({ error: "invalid userId" }, 400);

      // спец-ранги всегда
      if (SPECIAL[userId]) {
        return json({ userId, rank: SPECIAL[userId], hasExtension: true });
      }

      // есть ли в KV
      let has = false;
      try {
        if (env.USERS) {
          const v = await env.USERS.get("u:" + userId);
          has = !!v;
        }
      } catch (e) {
        return json({ error: "kv_error", message: String(e) }, 500);
      }

      return json({
        userId,
        rank: has ? "pawn" : "none",
        hasExtension: has
      });
    }

    // POST /register  body: { userId: "123" }
    if (request.method === "POST" && path === "/register") {
      // регистрации короткие: всё, что больше 512 байт, отбрасываем
      if (Number(request.headers.get("content-length") || 0) > 512) {
        return json({ error: "payload too large" }, 413);
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "invalid json" }, 400);
      }

      const userId = String(body.userId || "").replace(/[^0-9]/g, "");
      if (!userId || userId.length < 3 || userId.length > 20) {
        return json({ error: "invalid userId" }, 400);
      }

      try {
        if (!env.USERS) {
          return json({ error: "KV binding USERS not configured" }, 500);
        }
        // не пишем в KV, если запись уже есть и свежая: лимит записей KV легко исчерпать
        const key = "u:" + userId;
        const WEEK = 7 * 24 * 60 * 60 * 1000;
        const prev = await env.USERS.get(key);
        let prevAt = 0;
        try { prevAt = JSON.parse(prev || "{}").at || 0; } catch {}
        if (!prev || Date.now() - prevAt > WEEK) {
          await env.USERS.put(key, JSON.stringify({ at: Date.now(), rank: SPECIAL[userId] || "pawn" }));
        }
      } catch (e) {
        return json({ error: "kv_error", message: String(e) }, 500);
      }

      const rank = SPECIAL[userId] || "pawn";
      return json({ ok: true, userId, rank });
    }

    return json({ error: "not found", paths: ["GET /rank/:id", "POST /register", "GET /health"] }, 404);
  }
};
