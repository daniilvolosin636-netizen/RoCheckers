(function () {
  "use strict";

  const GATE_KEY = "roblox_checkers_gate_passed_v4";

  function getPlaceId() {
    const parts = location.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("games");
    if (i !== -1 && parts[i + 1]) return String(parts[i + 1]);
    return null;
  }

  const PLACE_ID = getPlaceId();
  if (!PLACE_ID) return;

  function hasPassed() {
    try {
      const data = JSON.parse(localStorage.getItem(GATE_KEY) || "{}");
      return data[PLACE_ID] === true;
    } catch { return false; }
  }

  function markPassed() {
    try {
      const data = JSON.parse(localStorage.getItem(GATE_KEY) || "{}");
      data[PLACE_ID] = true;
      localStorage.setItem(GATE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  // ---------- Язык ----------
  function detectLang() {
    let lang = (document.documentElement.lang || "").toLowerCase().slice(0, 2);
    if (!lang || lang === "en") {
      const meta = document.querySelector('meta[property="og:locale"]');
      if (meta) lang = (meta.content || "").toLowerCase().slice(0, 2);
    }
    const m = location.href.match(/[?&]locale=([a-z]{2})/i);
    if (m) lang = m[1].toLowerCase();
    const bodyText = (document.body && document.body.innerText) ? document.body.innerText.slice(0, 2500) : "";
    if (/Играть|Плейс|Друзья|Настройки/.test(bodyText)) lang = "ru";
    else if (/Jugar|Amigos|Configuración/.test(bodyText)) lang = "es";
    else if (/Jogar|Amigos|Configurações/.test(bodyText)) lang = "pt";
    else if (/Spielen|Freunde|Einstellungen/.test(bodyText)) lang = "de";
    else if (/Jouer|Amis|Paramètres/.test(bodyText)) lang = "fr";
    else if (/플레이|친구/.test(bodyText)) lang = "ko";
    else if (/プレイ|フレンド/.test(bodyText)) lang = "ja";
    else if (/玩|好友|设置/.test(bodyText)) lang = "zh";
    else if (/Грати|Друзі|Налаштування/.test(bodyText)) lang = "uk";
    else if (/Oyna|Arkadaşlar|Ayarlar/.test(bodyText)) lang = "tr";
    else if (/Graj|Znajomi|Ustawienia/.test(bodyText)) lang = "pl";
    const supported = ["en","ru","es","pt","de","fr","ja","ko","zh","pl","tr","uk"];
    if (!supported.includes(lang)) lang = "en";
    return lang;
  }

  function detectDifficulty() {
    const href = location.href.toLowerCase();
    const html = document.documentElement.outerHTML.slice(0, 60000).toLowerCase();
    const text = (document.body && document.body.innerText || "").toLowerCase();
    if (
      href.includes("/kids") || html.includes("roblox kids") || html.includes("robloxkids") ||
      document.querySelector('[class*="kids"]') ||
      /roblox\s*kids|детск(ий|ая)|для детей/.test(text)
    ) return "easy";
    if (
      html.includes("accountselect") || html.includes("under13") || html.includes("under_13") ||
      html.includes("parental") || html.includes("supervised") ||
      /under\s*13|до\s*13|родительск|supervised|select\s*account/.test(text + html)
    ) return "medium";
    return "hard";
  }

  function detectTheme() {
    const now = new Date();
    const m = now.getMonth(); // 0-11
    const d = now.getDate();

    // --- Праздники (приоритет выше сезонов) ---
    // День рождения Roblox / 1 сентября (31 авг – 3 сен)
    if ((m === 7 && d >= 31) || (m === 8 && d <= 3)) return "roblox";

    // 14 февраля (12–16 фев)
    if (m === 1 && d >= 12 && d <= 16) return "valentine";

    // Хэллоуин (20 окт – 2 ноя)
    if ((m === 9 && d >= 20) || (m === 10 && d <= 2)) return "halloween";

    // Рождество (20–26 дек)
    if (m === 11 && d >= 20 && d <= 26) return "christmas";

    // Новый год (27 дек – 7 янв)
    if ((m === 11 && d >= 27) || (m === 0 && d <= 7)) return "newyear";

    // --- Сезоны ---
    // Зима: остаток янв–фев (после праздников)
    if (m === 0 || m === 1) return "winter";
    // Весна: март–май
    if (m >= 2 && m <= 4) return "spring";
    // Лето: июнь–авг
    if (m >= 5 && m <= 7) return "summer";
    // Осень: сен (после ДР) – ноя (после хэллоуина)
    return "autumn";
  }

  let overlayShown = false;
  const blockedButtons = new WeakSet();
  // Кнопка, которую пользователь нажал до шашек — после победы нажмём её снова
  let pendingJoinButton = null;
  let winHandled = false;
  let gateObserver = null;

  function showToast(text) {
    const old = document.getElementById("checkers-gate-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.id = "checkers-gate-toast";
    toast.textContent = text;
    toast.style.cssText = `
      position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
      background: #1a3a2a; color: #a0e0b0; padding: 14px 28px; border-radius: 12px;
      font-size: 15px; font-weight: 600; z-index: 2147483647;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5); border: 1px solid #3d8b5a;
      font-family: system-ui, sans-serif;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  // Все селекторы: Play, серверы, VIP
  const JOIN_SELECTORS = [
    // Главная кнопка Play
    'button[data-testid="play-button"]',
    'button[data-testid="game-detail-play-button"]',
    'button.btn-common-play-game-lg',
    'button.btn-primary-md.btn-full-width',
    'a[data-testid="play-button"]',
    '.game-details-play-button-container button',
    'button[aria-label*="Play"]',
    'button[aria-label*="Играть"]',
    '#game-details-play-button-container button',
    'button.btn-growth-lg',
    'button.btn-common-play-game-sm',
    // Кнопки Join на карточках серверов (список серверов внизу)
    'button[data-testid="game-server-join-button"]',
    'button.game-server-join-btn',
    '.server-list-item button',
    '.rbx-game-server-item button',
    'button[class*="server"][class*="join"]',
    'button[class*="JoinButton"]',
    'button[class*="join-button"]',
    // VIP / private servers
    'button[data-testid="vip-server-join-button"]',
    'button[data-testid="private-server-join-button"]',
    '.vip-server-item button',
    '.private-server-item button',
    'button[class*="vip"][class*="join"]',
    'button[class*="private"][class*="join"]',
    // Общие join
    'button[aria-label*="Join"]',
    'button[aria-label*="Присоединиться"]',
    'button[aria-label*="Войти"]'
  ];

  function isJoinButton(el) {
    if (!el || el.tagName !== "BUTTON" && el.tagName !== "A") return false;
    // уже внутри нашего оверлея — не трогаем
    if (el.closest("#checkers-gate-overlay")) return false;
    const text = (el.textContent || "").trim().toLowerCase();
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    const testId = (el.getAttribute("data-testid") || "").toLowerCase();
    const cls = (el.className || "").toLowerCase();

    if (/play|играть|join|присоединиться|войти|зайти/.test(text + " " + aria)) return true;
    if (/play-button|join-button|game-server-join|vip-server|private-server/.test(testId)) return true;
    if (/play-button|join-button|server-join|vip.*join|private.*join/.test(cls)) return true;
    // кнопки внутри списка серверов
    if (el.closest(".rbx-game-server-item, .server-list-item, .vip-server-item, .private-server-item, [class*='ServerItem'], [class*='server-item']")) {
      if (/join|play|войти|играть|присоед/.test(text + aria)) return true;
    }
    return false;
  }

  function unlockAllPlayButtons() {
    // Только снимаем слушатели — без cloneNode (clone + MutationObserver = зависание вкладки)
    try {
      document.querySelectorAll(JOIN_SELECTORS.join(",")).forEach((btn) => {
        try { btn.removeEventListener("click", blockHandler, true); } catch {}
        try { btn.title = ""; } catch {}
      });
    } catch (e) {}
  }

  function tryRobloxJoinApi() {
    try {
      if (typeof window.Roblox !== "undefined" && window.Roblox.GameLauncher) {
        const gl = window.Roblox.GameLauncher;
        if (typeof gl.joinMultiplayerGame === "function" && PLACE_ID) {
          gl.joinMultiplayerGame(Number(PLACE_ID));
          return true;
        }
      }
    } catch (e) {}
    try {
      if (window.Roblox?.Game?.join) {
        window.Roblox.Game.join(PLACE_ID);
        return true;
      }
    } catch (e) {}
    return false;
  }

  function tryAutoJoin() {
    // 1) кнопка, которую пользователь нажал до шашек
    if (pendingJoinButton) {
      const btn = pendingJoinButton;
      pendingJoinButton = null;
      if (document.body.contains(btn)) {
        try {
          try { btn.removeEventListener("click", blockHandler, true); } catch {}
          btn.click();
          return true;
        } catch (e) {}
      }
    }

    // 2) Roblox API
    if (tryRobloxJoinApi()) return true;

    // 3) основные кнопки Play (без слишком широких селекторов)
    const playSelectors = [
      'button[data-testid="play-button"]',
      'button[data-testid="game-detail-play-button"]',
      'button.btn-common-play-game-lg',
      '#game-details-play-button-container button',
      'button.btn-growth-lg',
      '.game-details-play-button',
      '#game-details-play-button'
    ];
    for (const sel of playSelectors) {
      const btn = document.querySelector(sel);
      if (!btn || btn.disabled) continue;
      try {
        try { btn.removeEventListener("click", blockHandler, true); } catch {}
        btn.click();
        return true;
      } catch (e) {}
    }
    return false;
  }

  function onWin() {
    // защита от повторных вызовов (sendWin шлёт несколько postMessage)
    if (winHandled) return;
    winHandled = true;

    markPassed();

    // сразу отключаем observer — иначе unlock/DOM-изменения вызывают цикл
    if (gateObserver) {
      try { gateObserver.disconnect(); } catch (e) {}
      gateObserver = null;
    }

    const overlay = document.getElementById("checkers-gate-overlay");
    if (overlay) overlay.remove();
    overlayShown = false;
    unlockAllPlayButtons();

    const lang = detectLang();
    const msgs = {
      ru: "Победа! Заходим в плейс...",
      en: "Victory! Joining the experience...",
      es: "¡Victoria! Entrando...",
      pt: "Vitória! Entrando...",
      de: "Sieg! Trete bei...",
      fr: "Victoire ! Connexion...",
      pl: "Wygrana! Dołączanie...",
      tr: "Zafer! Katılıyor...",
      uk: "Перемога! Заходимо...",
      ja: "勝利！参加中...",
      ko: "승리! 참가 중...",
      zh: "胜利！正在进入..."
    };
    showToast(msgs[lang] || msgs.en);

    // 2–3 аккуратные попытки входа, без агрессивного сканирования всего DOM
    let attempts = 0;
    const maxAttempts = 4;
    const tick = () => {
      attempts++;
      if (tryAutoJoin()) return;
      if (attempts < maxAttempts) {
        setTimeout(tick, 300 * attempts);
      } else {
        const fallback = {
          ru: "Нажми Play — уже можно.",
          en: "Press Play — you're cleared.",
          es: "Pulsa Play.",
          pt: "Pressione Play.",
          de: "Drücke Play.",
          fr: "Appuie sur Play.",
          uk: "Натисни Play."
        };
        showToast(fallback[lang] || fallback.en);
      }
    };
    setTimeout(tick, 250);
  }

  window.addEventListener("message", (e) => {
    if (!e.data || typeof e.data !== "object") return;
    if (e.data.type === "CHECKERS_WIN") onWin();
    if (e.data.type === "CHECKERS_CLOSE") {
      const overlay = document.getElementById("checkers-gate-overlay");
      if (overlay) overlay.remove();
      overlayShown = false;
      pendingJoinButton = null;
    }
  });

  function showCheckersGate() {
    if (hasPassed()) return;
    if (overlayShown || document.getElementById("checkers-gate-overlay")) return;
    overlayShown = true;

    const lang = detectLang();
    const difficulty = detectDifficulty();
    const theme = detectTheme();

    const overlay = document.createElement("div");
    overlay.id = "checkers-gate-overlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(8,8,16,0.92);
      z-index: 2147483647; display: flex; align-items: center; justify-content: center;
      font-family: system-ui, -apple-system, sans-serif; backdrop-filter: blur(6px);
    `;

    const iframe = document.createElement("iframe");
    iframe.id = "checkers-gate-iframe";
    const q = new URLSearchParams({ lang, difficulty, theme });
    iframe.src = chrome.runtime.getURL("checkers.html") + "?" + q.toString();
    iframe.allow = "autoplay";
    iframe.style.cssText = `
      width: 980px; max-width: 96vw; height: 760px; max-height: 96vh;
      border: none; border-radius: 20px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.7); background: #12121f;
    `;

    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
  }

  function blockHandler(e) {
    if (hasPassed()) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // запоминаем, какую кнопку жали (сервер / VIP / Play)
    pendingJoinButton = e.currentTarget || e.target;
    showCheckersGate();
  }

  function blockPlayButtons() {
    if (hasPassed()) return;

    // по селекторам
    document.querySelectorAll(JOIN_SELECTORS.join(",")).forEach((btn) => {
      if (blockedButtons.has(btn)) return;
      if (!isJoinButton(btn) && !JOIN_SELECTORS.some(s => { try { return btn.matches(s); } catch { return false; } })) return;
      blockedButtons.add(btn);
      btn.addEventListener("click", blockHandler, true);
      btn.title = "Checkers Gate";
    });

    // дополнительно: любые join-кнопки в списках серверов (на случай новых классов)
    document.querySelectorAll("button, a").forEach((btn) => {
      if (blockedButtons.has(btn)) return;
      if (!isJoinButton(btn)) return;
      blockedButtons.add(btn);
      btn.addEventListener("click", blockHandler, true);
      btn.title = "Checkers Gate";
    });
  }

  // Уже прошёл — не блокируем
  if (hasPassed()) return;

  gateObserver = new MutationObserver(() => {
    if (hasPassed() || winHandled) {
      if (gateObserver) {
        try { gateObserver.disconnect(); } catch (e) {}
        gateObserver = null;
      }
      return;
    }
    blockPlayButtons();
  });
  gateObserver.observe(document.body, { childList: true, subtree: true });

  [400, 1000, 2000, 3500, 6000, 10000].forEach((t) => {
    setTimeout(() => { if (!hasPassed() && !winHandled) blockPlayButtons(); }, t);
  });


  // Регистрация userId на сервере (для значка ♙ на чужих профилях)
  (function registerExtensionUser() {
    const API_BASE = "https://checkers-gate.daniilvolosin636.workers.dev"; // тот же URL, что в badge.js
    if (API_BASE.includes("YOUR-WORKER")) return;

    function getUid() {
      try {
        if (window.Roblox?.CurrentUser?.userId) return String(window.Roblox.CurrentUser.userId);
      } catch {}
      const m = document.documentElement.innerHTML.match(/"userId"\s*:\s*(\d+)/);
      return m ? m[1] : null;
    }

    const uid = getUid();
    if (!uid) return;
    try {
      fetch(API_BASE + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid })
      }).catch(function () {});
    } catch {}
  })();

})();