(function () {
  "use strict";

  // <<< СЮДА ВСТАВЬ URL СВОЕГО WORKER (без / в конце) >>>
  const API_BASE = "https://checkers-gate.daniilvolosin636.workers.dev";

  const SPECIAL = {
    "1515075892": "king",
    "1388899632": "queen"
  };

  const LABELS = {
    king:  { en: "King",   ru: "Король",   icon: "♔", color: "#ffd700", glow: "rgba(255,215,0,0.55)" },
    queen: { en: "Queen",  ru: "Королева", icon: "♕", color: "#e0b0ff", glow: "rgba(200,140,255,0.55)" },
    pawn:  { en: "Pawn",   ru: "Пешка",    icon: "♙", color: "#c0c8d8", glow: "rgba(180,190,210,0.4)" }
  };

  function getProfileUserId() {
    const m = location.pathname.match(/\/users\/(\d+)/);
    return m ? m[1] : null;
  }

  function detectLang() {
    const lang = (document.documentElement.lang || "").toLowerCase().slice(0, 2);
    if (lang === "ru" || /Играть|Друзья|Настройки/.test(document.body?.innerText?.slice(0, 1500) || "")) return "ru";
    return "en";
  }

  function getLoggedInUserId() {
    try {
      if (window.Roblox?.CurrentUser?.userId) return String(window.Roblox.CurrentUser.userId);
    } catch {}
    try {
      const meta = document.querySelector('meta[name="user-data"]');
      if (meta) {
        const raw = meta.getAttribute("data-userid") || meta.getAttribute("data-user-id") || "";
        if (/^\d+$/.test(raw)) return raw;
      }
    } catch {}
    const el = document.querySelector("[data-userid], [data-user-id]");
    if (el) {
      const id = el.getAttribute("data-userid") || el.getAttribute("data-user-id");
      if (id && /^\d+$/.test(id)) return id;
    }
    const m = document.documentElement.innerHTML.match(/"userId"\s*:\s*(\d+)/);
    if (m) return m[1];
    return null;
  }

  function apiConfigured() {
    return API_BASE && !API_BASE.includes("YOUR-WORKER");
  }

  async function fetchRank(userId) {
    if (SPECIAL[userId]) return SPECIAL[userId];
    if (!apiConfigured()) return null;
    try {
      const r = await fetch(API_BASE + "/rank/" + userId, { method: "GET", cache: "no-store" });
      if (!r.ok) return null;
      const data = await r.json();
      if (data.rank === "king" || data.rank === "queen" || data.rank === "pawn") return data.rank;
      return null;
    } catch {
      return null;
    }
  }

  async function registerMe(userId) {
    if (!apiConfigured() || !userId) return;
    try {
      await fetch(API_BASE + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
    } catch {}
  }

  function makeBadge(rankKey) {
    const lang = detectLang();
    const info = LABELS[rankKey];
    if (!info) return null;
    const label = lang === "ru" ? info.ru : info.en;

    const wrap = document.createElement("span");
    wrap.id = "checkers-gate-badge";
    wrap.title = "Checkers Gate — " + label;
    wrap.setAttribute("data-cg-rank", rankKey);
    wrap.style.cssText = `
      display: inline-flex; align-items: center; gap: 6px;
      margin-left: 10px; padding: 3px 10px 3px 8px;
      border-radius: 999px; vertical-align: middle;
      font-size: 13px; font-weight: 700;
      font-family: system-ui, -apple-system, sans-serif;
      color: ${info.color}; background: rgba(0,0,0,0.45);
      border: 1px solid ${info.color}55;
      box-shadow: 0 0 12px ${info.glow};
      cursor: default; user-select: none; line-height: 1.2;
      position: relative; top: -2px;
    `;

    const icon = document.createElement("span");
    icon.textContent = info.icon;
    icon.style.cssText = `font-size: 16px; line-height: 1; filter: drop-shadow(0 0 4px ${info.glow});`;

    const text = document.createElement("span");
    text.textContent = label;

    wrap.appendChild(icon);
    wrap.appendChild(text);
    return wrap;
  }

  function findNameContainer() {
    // Roblox меняет разметку профилей, поэтому проверяем несколько вариантов.
    const selectors = [
      ".profile-header .header-names",
      ".profile-header-names",
      ".profile-name",
      "h1.profile-name",
      ".profile-header-content h1",
      ".profile-header h1",
      "[class*='ProfileHeader'] h1",
      "[class*='profile-header'] h1",
      "[class*='ProfileHeader'] [class*='name']",
      "[class*='profile-header'] [class*='name']",
      "[class*='profile-name']",
      "[data-testid*='profile'] h1",
      ".header-title",
      "div.profile-header-caption",
      "main h1",
      "header h1",
      "h1"
    ];
    for (const s of selectors) {
      try {
        const el = document.querySelector(s);
        if (el && el.isConnected) return el;
      } catch (e) {
        console.debug("[Checkers Gate] Selector failed:", s, e);
      }
    }
    return null;
  }

  let injectionRunning = false;
  let registeredUserId = null;
  let registrationPromise = null;

  async function inject() {
    const profileId = getProfileUserId();
    if (!profileId) return;

    // Keep a single in-flight run. Several observer callbacks can fire while
    // fetchRank() is waiting, which previously allowed multiple Pawn badges.
    if (injectionRunning) return;

    // Remove any duplicates left by earlier runs or an older extension build.
    const existing = Array.from(document.querySelectorAll("#checkers-gate-badge"));
    if (existing.length > 1) existing.slice(1).forEach((el) => el.remove());
    if (existing.length === 1 && existing[0].isConnected) return;

    injectionRunning = true;
    try {
      const me = getLoggedInUserId();
      if (me && me !== registeredUserId && !registrationPromise) {
        registeredUserId = me;
        registrationPromise = registerMe(me).finally(() => {
          registrationPromise = null;
        });
      }

      let rank = SPECIAL[profileId] || null;
      if (!rank) rank = await fetchRank(profileId);
      if (!rank && me && me === profileId) rank = "pawn";
      if (!rank || getProfileUserId() !== profileId) return;

      const host = findNameContainer();
      if (!host) {
        console.warn("[Checkers Gate] Could not find profile name container:", location.pathname);
        return;
      }

      // Re-check after the asynchronous server request, immediately before append.
      const current = Array.from(document.querySelectorAll("#checkers-gate-badge"));
      if (current.length) {
        current.slice(1).forEach((el) => el.remove());
        return;
      }

      const badge = makeBadge(rank);
      if (badge) {
        host.appendChild(badge);
        console.info("[Checkers Gate] Badge displayed:", rank);
      }
    } catch (err) {
      console.warn("[Checkers Gate] Badge injection failed:", err);
    } finally {
      injectionRunning = false;
    }
  }

  const obs = new MutationObserver(() => {
    if (!document.getElementById("checkers-gate-badge")) inject();
  });
  obs.observe(document.body, { childList: true, subtree: true });
  [600, 1500, 3000, 5000, 9000].forEach((t) => setTimeout(inject, t));
  inject();
})();
