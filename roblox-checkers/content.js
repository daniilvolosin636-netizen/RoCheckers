(function () {
  "use strict";

  const GATE_KEY = "roblox_checkers_gate_passed_v4";

  function getPlaceId() {
    const parts = location.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("games");
    if (i !== -1 && parts[i + 1]) return String(parts[i + 1]);
    return null;
  }

  // На странице игры плейс известен из URL. На /home, в профиле и в списке друзей — нет:
  // там плейс пытаемся определить по ссылке рядом с кнопкой (см. resolvePlaceId).
  const PAGE_PLACE_ID = getPlaceId();
  let activePlaceId = PAGE_PLACE_ID;
  // Если плейс определить не удалось (вход к другу) — победа действует до перезагрузки страницы
  let sessionPassed = false;

  // Статус прохождения хранится в chrome.storage расширения:
  // скрипты страницы не могут ни прочитать его, ни подменить.
  let passedPlaces = {};
  function isPassed(pid) {
    return pid ? passedPlaces[pid] === true : sessionPassed;
  }
  function hasPassed() {
    return isPassed(activePlaceId);
  }

  function markPassed() {
    if (activePlaceId) {
      passedPlaces[activePlaceId] = true;
      try { chrome.storage.local.set({ [GATE_KEY]: passedPlaces }); } catch (e) {}
    } else {
      sessionPassed = true;
    }
  }

  // Загружаем статус, переносим старый флаг из localStorage один раз и удаляем его
  function loadPassed(done) {
    let legacy = {};
    try { legacy = JSON.parse(localStorage.getItem(GATE_KEY) || "{}") || {}; } catch (e) {}
    const finish = (stored) => {
      passedPlaces = Object.assign({}, stored || {});
      let migrated = false;
      for (const k in legacy) {
        if (legacy[k] === true && passedPlaces[k] !== true) { passedPlaces[k] = true; migrated = true; }
      }
      if (migrated) { try { chrome.storage.local.set({ [GATE_KEY]: passedPlaces }); } catch (e) {} }
      try { localStorage.removeItem(GATE_KEY); } catch (e) {}
      done();
    };
    try {
      chrome.storage.local.get(GATE_KEY, (res) => finish(res ? res[GATE_KEY] : null));
    } catch (e) {
      finish(null);
    }
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
    // Если пользователь включил тему «Шашки · Дерево» — она важнее праздников и сезонов
    if (document.documentElement.classList.contains("rc-wood")) return "wood";
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
    // Зима: декабрь (до праздников), январь–февраль
    if (m === 11 || m === 0 || m === 1) return "winter";
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
    if (!el || !(el.tagName === "BUTTON" || el.tagName === "A" || el.getAttribute("role") === "button")) return false;
    // уже внутри нашего оверлея — не трогаем
    if (el.closest("#checkers-gate-overlay")) return false;
    const text = (el.textContent || "").trim().toLowerCase();
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    const testId = (el.getAttribute("data-testid") || "").toLowerCase();
    const cls = (el.className || "").toLowerCase();

    // точное совпадение текста (раньше "Display" и "Войти" в шапке ловились как Play)
    const PLAY_WORDS = /^(play|join|играть|присоединиться|войти в игру|зайти в игру|unirse|jugar|jogar|participar|beitreten|spielen|rejoindre|jouer|приєднатися|грати|dołącz|graj|katıl|oyna|参加|参加する|加入|참가|참가하기)$/i;
    if (text.length <= 30 && PLAY_WORDS.test(text)) return true;
    if (/(^|\b)(play|join)\b|играть|присоединиться/i.test(aria)) return true;
    if (/(^|[^a-z])(play-button|join-button|game-server-join|vip-server-join|private-server-join)/.test(testId)) return true;
    if (/(^|[^a-z])(play-button|join-button|server-join|vip.*join|private.*join)/.test(cls)) return true;
    // кнопки внутри списка серверов
    if (el.closest(".rbx-game-server-item, .server-list-item, .vip-server-item, .private-server-item, [class*='ServerItem'], [class*='server-item']")) {
      if (/\b(join|play)\b|играть|присоед|войти/.test(text + aria)) return true;
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
        if (typeof gl.joinMultiplayerGame === "function" && PAGE_PLACE_ID) {
          gl.joinMultiplayerGame(Number(PAGE_PLACE_ID));
          return true;
        }
      }
    } catch (e) {}
    try {
      if (window.Roblox?.Game?.join) {
        window.Roblox.Game.join(PAGE_PLACE_ID);
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

    // Вне страницы игры (друзья) не трогаем чужие кнопки Play
    if (!PAGE_PLACE_ID) return false;

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

    // Вход к другу / с главной: кнопка могла исчезнуть вместе с попапом — тогда просим нажать ещё раз
    if (!PAGE_PLACE_ID) {
      const rejoin = {
        ru: "Победа! Нажми «Присоединиться» ещё раз.",
        en: "Victory! Click Join again.",
        es: "¡Victoria! Pulsa Unirse otra vez.",
        pt: "Vitória! Clique em Participar de novo.",
        de: "Sieg! Klicke erneut auf Beitreten.",
        fr: "Victoire ! Clique à nouveau sur Rejoindre.",
        uk: "Перемога! Натисни «Приєднатися» ще раз."
      };
      setTimeout(() => { if (!tryAutoJoin()) showToast(rejoin[lang] || rejoin.en); }, 250);
      return;
    }

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
    // принимаем сообщения только от нашего iframe, а не от любого скрипта страницы
    const frame = document.getElementById("checkers-gate-iframe");
    if (!frame || e.source !== frame.contentWindow) return;
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
    winHandled = false; // на /home можно играть несколько раз — для разных друзей

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

  // ---- Определяем плейс по ближайшей ссылке /games/<id> (для кнопок друзей) ----
  function resolvePlaceId(btn) {
    if (PAGE_PLACE_ID) return PAGE_PLACE_ID;
    const fromAttr = btn.closest("[data-placeid],[data-place-id],[data-rootplaceid]");
    if (fromAttr) {
      const v = fromAttr.getAttribute("data-placeid") || fromAttr.getAttribute("data-place-id") || fromAttr.getAttribute("data-rootplaceid");
      if (v && /^\d+$/.test(v)) return v;
    }
    let node = btn;
    for (let i = 0; i < 6 && node; i++, node = node.parentElement) {
      const ids = new Set();
      if (node.matches && node.matches('a[href*="/games/"]')) {
        const m = (node.getAttribute("href") || "").match(/\/games\/(\d+)/);
        if (m) ids.add(m[1]);
      }
      node.querySelectorAll && node.querySelectorAll('a[href*="/games/"]').forEach((a) => {
        const m = (a.getAttribute("href") || "").match(/\/games\/(\d+)/);
        if (m) ids.add(m[1]);
      });
      if (ids.size === 1) return [...ids][0];
      if (ids.size > 1) return null; // слишком широкий контейнер — не гадаем
    }
    return null;
  }

  // Делегированный перехват кликов: работает и для попапов/кнопок, которые Roblox рисует позже
  function onDocClick(e) {
    const t = e.target;
    if (!t || !t.closest) return;
    const btn = t.closest('button, a, [role="button"]');
    if (!btn || !isJoinButton(btn)) return;
    const pid = resolvePlaceId(btn);
    if (isPassed(pid)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    pendingJoinButton = btn;
    activePlaceId = pid;
    showCheckersGate();
  }

  function registerExtensionUser() {
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
    // регистрируем не на каждой загрузке, а раз в 7 дней (общий ключ с badge.js)
    try {
      const prev = JSON.parse(localStorage.getItem("checkers_gate_reg_v1") || "{}");
      if (prev.uid === uid && Date.now() - prev.at < 7 * 864e5) return;
      localStorage.setItem("checkers_gate_reg_v1", JSON.stringify({ uid, at: Date.now() }));
    } catch {}
    try {
      fetch(API_BASE + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid })
      }).catch(function () {});
    } catch {}
  }

  function init() {
  document.addEventListener("click", onDocClick, true);

  // Не на странице игры (главная, профиль, друзья) — достаточно перехвата кликов
  if (!PAGE_PLACE_ID) { registerExtensionUser(); return; }

  if (hasPassed()) return;

  // не сканируем DOM на каждую мутацию — собираем их в один проход
  let scanScheduled = false;
  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    setTimeout(() => {
      scanScheduled = false;
      if (!hasPassed() && !winHandled) blockPlayButtons();
    }, 150);
  }

  gateObserver = new MutationObserver(() => {
    if (hasPassed() || winHandled) {
      if (gateObserver) {
        try { gateObserver.disconnect(); } catch (e) {}
        gateObserver = null;
      }
      return;
    }
    scheduleScan();
  });
  gateObserver.observe(document.body, { childList: true, subtree: true });

  [400, 1000, 2000, 3500, 6000, 10000].forEach((t) => {
    setTimeout(() => { if (!hasPassed() && !winHandled) blockPlayButtons(); }, t);
  });


  registerExtensionUser();

  }

  loadPassed(init);

})();