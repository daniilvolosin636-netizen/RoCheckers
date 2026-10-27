(() => {
  "use strict";

  // ===== params from URL =====
  const params = new URLSearchParams(location.search);
  const LANG = (params.get("lang") || "en").slice(0, 2);
  const DIFF = params.get("difficulty") || "hard"; // easy | medium | hard
  const THEME = params.get("theme") || "classic";

  // ===== i18n =====
  const I18N = {
    en: {
      title: "Checkers vs Bot",
      subtitle: "Beat the bot to enter the experience. You play white.",
      status: "Status",
      yourTurn: "Your turn",
      botThinking: "Bot is thinking...",
      youWin: "You won!",
      botWin: "Bot won",
      whiteYou: "White (you)",
      blackBot: "Black (bot)",
      difficulty: "Difficulty",
      theme: "Theme",
      newGame: "New game",
      close: "Close",
      donate: "Donate",
      rules: "Captures are optional. Kings fly. You may capture backwards.",
      winTitle: "Victory!",
      winText: "You beat the bot. You can now enter the experience.",
      enter: "Enter experience",
      opening: "Opening...",
      diffEasy: "Easy (Kids)",
      diffMedium: "Medium (Select)",
      diffHard: "Hard",
      themeClassic: "Classic",
      themeHalloween: "Halloween",
      themeWinter: "Winter",
      themeSpring: "Spring",
      themeSummer: "Summer",
      themeAutumn: "Autumn",
      themeRoblox: "Roblox Birthday",
      themeValentine: "Valentine's Day",
      themeChristmas: "Christmas",
      themeNewyear: "New Year"
    },
    ru: {
      title: "Шашки против бота",
      subtitle: "Обыграй бота, чтобы зайти в плейс. Ты играешь белыми.",
      status: "Статус",
      yourTurn: "Твой ход",
      botThinking: "Бот думает...",
      youWin: "Ты победил!",
      botWin: "Бот победил",
      whiteYou: "Белые (ты)",
      blackBot: "Чёрные (бот)",
      difficulty: "Сложность",
      theme: "Тема",
      newGame: "Новая партия",
      close: "Закрыть",
      donate: "Донат",
      rules: "Взятия не обязательны. Дамки ходят далеко. Можно бить назад.",
      winTitle: "Победа!",
      winText: "Ты обыграл бота. Теперь можешь заходить в плейс.",
      enter: "Войти в плейс",
      opening: "Открываем...",
      diffEasy: "Лёгкий (Kids)",
      diffMedium: "Средний (Select)",
      diffHard: "Сложный",
      themeClassic: "Классика",
      themeHalloween: "Хэллоуин",
      themeWinter: "Зима",
      themeSpring: "Весна",
      themeSummer: "Лето",
      themeAutumn: "Осень",
      themeRoblox: "День рождения Roblox",
      themeValentine: "14 февраля",
      themeChristmas: "Рождество",
      themeNewyear: "Новый год"
    },
    es: {
      title: "Damas contra bot",
      subtitle: "Gana al bot para entrar. Juegas con blancas.",
      status: "Estado",
      yourTurn: "Tu turno",
      botThinking: "El bot piensa...",
      youWin: "¡Ganaste!",
      botWin: "El bot ganó",
      whiteYou: "Blancas (tú)",
      blackBot: "Negras (bot)",
      difficulty: "Dificultad",
      theme: "Tema",
      newGame: "Nueva partida",
      close: "Cerrar",
      donate: "Donar",
      rules: "Las capturas son opcionales. Las damas vuelan. Se puede capturar atrás.",
      winTitle: "¡Victoria!",
      winText: "Ganaste al bot. Ya puedes entrar a la experiencia.",
      enter: "Entrar",
      opening: "Abriendo...",
      diffEasy: "Fácil (Kids)",
      diffMedium: "Medio (Select)",
      diffHard: "Difícil",
      themeClassic: "Clásico",
      themeHalloween: "Halloween",
      themeWinter: "Invierno",
      themeSpring: "Primavera",
      themeSummer: "Verano",
      themeAutumn: "Otoño",
      themeRoblox: "Cumpleaños de Roblox",
      themeValentine: "San Valentín",
      themeChristmas: "Navidad",
      themeNewyear: "Año Nuevo"
    },
    pt: {
      title: "Damas contra bot",
      subtitle: "Vença o bot para entrar. Você joga de brancas.",
      status: "Status",
      yourTurn: "Sua vez",
      botThinking: "Bot pensando...",
      youWin: "Você venceu!",
      botWin: "Bot venceu",
      whiteYou: "Brancas (você)",
      blackBot: "Pretas (bot)",
      difficulty: "Dificuldade",
      theme: "Tema",
      newGame: "Novo jogo",
      close: "Fechar",
      donate: "Doar",
      rules: "As capturas são opcionais. Damas voam. Pode capturar para trás.",
      winTitle: "Vitória!",
      winText: "Você venceu o bot. Agora pode entrar na experiência.",
      enter: "Entrar",
      opening: "Abrindo...",
      diffEasy: "Fácil (Kids)",
      diffMedium: "Médio (Select)",
      diffHard: "Difícil",
      themeClassic: "Clássico",
      themeHalloween: "Halloween",
      themeWinter: "Inverno",
      themeSpring: "Primavera",
      themeSummer: "Verão",
      themeAutumn: "Outono",
      themeRoblox: "Aniversário do Roblox",
      themeValentine: "Dia dos Namorados",
      themeChristmas: "Natal",
      themeNewyear: "Ano Novo"
    },
    de: {
      title: "Dame gegen Bot",
      subtitle: "Besiege den Bot, um beizutreten. Du spielst Weiß.",
      status: "Status",
      yourTurn: "Dein Zug",
      botThinking: "Bot denkt...",
      youWin: "Du hast gewonnen!",
      botWin: "Bot hat gewonnen",
      whiteYou: "Weiß (du)",
      blackBot: "Schwarz (Bot)",
      difficulty: "Schwierigkeit",
      theme: "Thema",
      newGame: "Neues Spiel",
      close: "Schließen",
      donate: "Spenden",
      rules: "Schlagen ist optional. Damen fliegen. Rückwärts schlagen erlaubt.",
      winTitle: "Sieg!",
      winText: "Du hast den Bot besiegt. Du kannst jetzt beitreten.",
      enter: "Beitreten",
      opening: "Öffne...",
      diffEasy: "Leicht (Kids)",
      diffMedium: "Mittel (Select)",
      diffHard: "Schwer",
      themeClassic: "Klassisch",
      themeHalloween: "Halloween",
      themeWinter: "Winter",
      themeSpring: "Frühling",
      themeSummer: "Sommer",
      themeAutumn: "Herbst",
      themeRoblox: "Roblox-Geburtstag",
      themeValentine: "Valentinstag",
      themeChristmas: "Weihnachten",
      themeNewyear: "Neujahr"
    },
    fr: {
      title: "Dames contre bot",
      subtitle: "Bats le bot pour entrer. Tu joues les blancs.",
      status: "Statut",
      yourTurn: "Ton tour",
      botThinking: "Le bot réfléchit...",
      youWin: "Tu as gagné !",
      botWin: "Le bot a gagné",
      whiteYou: "Blancs (toi)",
      blackBot: "Noirs (bot)",
      difficulty: "Difficulté",
      theme: "Thème",
      newGame: "Nouvelle partie",
      close: "Fermer",
      donate: "Faire un don",
      rules: "Les prises sont facultatives. Dames longues. Prise en arrière possible.",
      winTitle: "Victoire !",
      winText: "Tu as battu le bot. Tu peux entrer dans l'expérience.",
      enter: "Entrer",
      opening: "Ouverture...",
      diffEasy: "Facile (Kids)",
      diffMedium: "Moyen (Select)",
      diffHard: "Difficile",
      themeClassic: "Classique",
      themeHalloween: "Halloween",
      themeWinter: "Hiver",
      themeSpring: "Printemps",
      themeSummer: "Été",
      themeAutumn: "Automne",
      themeRoblox: "Anniversaire Roblox",
      themeValentine: "Saint-Valentin",
      themeChristmas: "Noël",
      themeNewyear: "Nouvel An"
    },
    pl: {
      title: "Warcaby kontra bot",
      subtitle: "Pokonaj bota, aby dołączyć. Grasz białymi.",
      status: "Status",
      yourTurn: "Twój ruch",
      botThinking: "Bot myśli...",
      youWin: "Wygrałeś!",
      botWin: "Bot wygrał",
      whiteYou: "Białe (ty)",
      blackBot: "Czarne (bot)",
      difficulty: "Trudność",
      theme: "Motyw",
      newGame: "Nowa partia",
      close: "Zamknij",
      donate: "Wesprzyj",
      rules: "Bicia są opcjonalne. Damki daleko. Można bić do tyłu.",
      winTitle: "Wygrana!",
      winText: "Pokonałeś bota. Możesz dołączyć do doświadczenia.",
      enter: "Dołącz",
      opening: "Otwieranie...",
      diffEasy: "Łatwy (Kids)",
      diffMedium: "Średni (Select)",
      diffHard: "Trudny",
      themeClassic: "Klasyczny",
      themeHalloween: "Halloween",
      themeWinter: "Zima",
      themeSpring: "Wiosna",
      themeSummer: "Lato",
      themeAutumn: "Jesień",
      themeRoblox: "Urodziny Roblox",
      themeValentine: "Walentynki",
      themeChristmas: "Boże Narodzenie",
      themeNewyear: "Nowy Rok"
    },
    tr: {
      title: "Bot'a karşı dama",
      subtitle: "Deneyime girmek için botu yen. Beyazlarla oynuyorsun.",
      status: "Durum",
      yourTurn: "Sıra sende",
      botThinking: "Bot düşünüyor...",
      youWin: "Kazandın!",
      botWin: "Bot kazandı",
      whiteYou: "Beyaz (sen)",
      blackBot: "Siyah (bot)",
      difficulty: "Zorluk",
      theme: "Tema",
      newGame: "Yeni oyun",
      close: "Kapat",
      donate: "Bağış",
      rules: "Alma zorunlu değil. Vezirler uçar. Geri alma mümkün.",
      winTitle: "Zafer!",
      winText: "Botu yendin. Artık deneyime girebilirsin.",
      enter: "Gir",
      opening: "Açılıyor...",
      diffEasy: "Kolay (Kids)",
      diffMedium: "Orta (Select)",
      diffHard: "Zor",
      themeClassic: "Klasik",
      themeHalloween: "Cadılar Bayramı",
      themeWinter: "Kış",
      themeSpring: "İlkbahar",
      themeSummer: "Yaz",
      themeAutumn: "Sonbahar",
      themeRoblox: "Roblox Doğum Günü",
      themeValentine: "Sevgililer Günü",
      themeChristmas: "Noel",
      themeNewyear: "Yılbaşı"
    },
    uk: {
      title: "Шашки проти бота",
      subtitle: "Обграй бота, щоб зайти в плейс. Ти граєш білими.",
      status: "Статус",
      yourTurn: "Твій хід",
      botThinking: "Бот думає...",
      youWin: "Ти переміг!",
      botWin: "Бот переміг",
      whiteYou: "Білі (ти)",
      blackBot: "Чорні (бот)",
      difficulty: "Складність",
      theme: "Тема",
      newGame: "Нова партія",
      close: "Закрити",
      donate: "Донат",
      rules: "Взяття не обов'язкові. Дамки ходять далеко. Можна бити назад.",
      winTitle: "Перемога!",
      winText: "Ти обіграв бота. Тепер можеш заходити в плейс.",
      enter: "Увійти в плейс",
      opening: "Відкриваємо...",
      diffEasy: "Легкий (Kids)",
      diffMedium: "Середній (Select)",
      diffHard: "Складний",
      themeClassic: "Класика",
      themeHalloween: "Геловін",
      themeWinter: "Зима",
      themeSpring: "Весна",
      themeSummer: "Літо",
      themeAutumn: "Осінь",
      themeRoblox: "День народження Roblox",
      themeValentine: "14 лютого",
      themeChristmas: "Різдво",
      themeNewyear: "Новий рік"
    },
    ja: {
      title: "ボットとチェッカー",
      subtitle: "ボットに勝って参加。あなたは白。",
      status: "状態",
      yourTurn: "あなたの番",
      botThinking: "ボット思考中...",
      youWin: "勝利！",
      botWin: "ボットの勝ち",
      whiteYou: "白（あなた）",
      blackBot: "黒（ボット）",
      difficulty: "難易度",
      theme: "テーマ",
      newGame: "新しいゲーム",
      close: "閉じる",
      donate: "寄付",
      rules: "取りは任意。キングは長く動く。後ろも取れる。",
      winTitle: "勝利！",
      winText: "ボットに勝ちました。体験に入れます。",
      enter: "参加する",
      opening: "開いています...",
      diffEasy: "簡単 (Kids)",
      diffMedium: "普通 (Select)",
      diffHard: "難しい",
      themeClassic: "クラシック",
      themeHalloween: "ハロウィン",
      themeWinter: "冬",
      themeSpring: "春",
      themeSummer: "夏",
      themeAutumn: "秋",
      themeRoblox: "Robloxの誕生日",
      themeValentine: "バレンタイン",
      themeChristmas: "クリスマス",
      themeNewyear: "新年"
    },
    ko: {
      title: "봇과 체커",
      subtitle: "봇을 이기고 참가하세요. 당신은 백.",
      status: "상태",
      yourTurn: "당신 차례",
      botThinking: "봇이 생각 중...",
      youWin: "이겼습니다!",
      botWin: "봇 승리",
      whiteYou: "백 (당신)",
      blackBot: "흑 (봇)",
      difficulty: "난이도",
      theme: "테마",
      newGame: "새 게임",
      close: "닫기",
      donate: "후원",
      rules: "잡기는 선택. 킹은 멀리 이동. 뒤로도 잡을 수 있음.",
      winTitle: "승리!",
      winText: "봇을 이겼습니다. 이제 참가할 수 있습니다.",
      enter: "참가하기",
      opening: "여는 중...",
      diffEasy: "쉬움 (Kids)",
      diffMedium: "보통 (Select)",
      diffHard: "어려움",
      themeClassic: "클래식",
      themeHalloween: "할로윈",
      themeWinter: "겨울",
      themeSpring: "봄",
      themeSummer: "여름",
      themeAutumn: "가을",
      themeRoblox: "Roblox 생일",
      themeValentine: "발렌타인",
      themeChristmas: "크리스마스",
      themeNewyear: "새해"
    },
    zh: {
      title: "对战机器人跳棋",
      subtitle: "打败机器人即可进入。你执白。",
      status: "状态",
      yourTurn: "你的回合",
      botThinking: "机器人思考中...",
      youWin: "你赢了！",
      botWin: "机器人赢了",
      whiteYou: "白方（你）",
      blackBot: "黑方（机器人）",
      difficulty: "难度",
      theme: "主题",
      newGame: "新对局",
      close: "关闭",
      donate: "捐赠",
      rules: "吃子可选。王可远行。可向后吃。",
      winTitle: "胜利！",
      winText: "你打败了机器人，可以进入体验了。",
      enter: "进入体验",
      opening: "打开中...",
      diffEasy: "简单 (Kids)",
      diffMedium: "中等 (Select)",
      diffHard: "困难",
      themeClassic: "经典",
      themeHalloween: "万圣节",
      themeWinter: "冬天",
      themeSpring: "春天",
      themeSummer: "夏天",
      themeAutumn: "秋天",
      themeRoblox: "Roblox生日",
      themeValentine: "情人节",
      themeChristmas: "圣诞节",
      themeNewyear: "新年"
    }
  };

  const t = I18N[LANG] || I18N.en;

  // apply theme + i18n to DOM
  document.body.className = "theme-" + (["classic","halloween","winter","spring","summer","autumn","roblox","valentine","christmas","newyear","wood"].includes(THEME) ? THEME : "classic");
  document.documentElement.lang = LANG;

  document.getElementById("title").textContent = t.title;
  document.getElementById("subtitle").textContent = t.subtitle;
  document.getElementById("label-status").textContent = t.status;
  document.getElementById("label-diff").textContent = t.difficulty;
  document.getElementById("label-theme").textContent = t.theme;
  document.getElementById("btn-new").textContent = t.newGame;
  document.getElementById("btn-close").textContent = t.close;
  document.getElementById("btn-donate").textContent = t.donate || "Donate";
  document.getElementById("rules").textContent = t.rules;
  document.getElementById("win-title").textContent = t.winTitle;
  document.getElementById("win-text").textContent = t.winText;
  document.getElementById("btn-enter").textContent = t.enter;

  const diffLabels = { easy: t.diffEasy, medium: t.diffMedium, hard: t.diffHard };
  document.getElementById("diff-text").innerHTML = "<strong>" + (diffLabels[DIFF] || t.diffHard) + "</strong>";

  const themeLabels = {
    classic: t.themeClassic, halloween: t.themeHalloween, winter: t.themeWinter,
    spring: t.themeSpring, summer: t.themeSummer, autumn: t.themeAutumn,
    roblox: t.themeRoblox, valentine: t.themeValentine,
    christmas: t.themeChristmas, newyear: t.themeNewyear,
    wood: (LANG === "ru" || LANG === "uk") ? "Дерево" : "Wood"
  };
  document.getElementById("theme-text").textContent = themeLabels[THEME] || t.themeClassic;

  // seasonal particles
  (function spawnFx() {
    const fx = document.getElementById("theme-fx");
    if (!fx) return;
    const symbols = {
      halloween: ["🎃", "👻", "🦇", "🍂"],
      winter: ["❄", "❅", "❆", "•"],
      spring: ["🌸", "🌼", "🍃"],
      summer: ["☀", "✨"],
      autumn: ["🍂", "🍁", "🍃"],
      roblox: ["🎮", "⭐", "🔵", "✨"],
      valentine: ["❤", "💕", "💗", "💖"],
      christmas: ["🎄", "⭐", "❄", "🎁"],
      newyear: ["🎆", "✨", "🥂", "⭐"]
    };
    const list = symbols[THEME];
    if (!list) return;
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("span");
      el.className = "flake";
      el.textContent = list[i % list.length];
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = 8 + Math.random() * 12 + "s";
      el.style.animationDelay = Math.random() * 8 + "s";
      el.style.fontSize = 10 + Math.random() * 14 + "px";
      el.style.opacity = 0.35 + Math.random() * 0.4;
      fx.appendChild(el);
    }
  })();

  // ===== game =====
  const EMPTY = 0, WHITE = 1, BLACK = 2, WHITE_KING = 3, BLACK_KING = 4;
  const SIZE = 8;

  // depth by difficulty — сильно ослаблено, чтобы бота можно было обыграть
  const DEPTH_CFG = {
    easy:   { max: 0, mid: 0, high: 0 },
    medium: { max: 1, mid: 1, high: 1 },
    hard:   { max: 2, mid: 1, high: 1 }
  };
  const CFG = DEPTH_CFG[DIFF] || DEPTH_CFG.hard;

  let board = [];
  let currentPlayer = WHITE;
  let selected = null;
  let possibleMoves = [];
  let lastMove = null;
  let gameOver = false;
  let thinking = false;

  // ничья: 40 полуходов подряд без взятий и без хода простой шашкой
  const DRAW_LIMIT = 40;
  const DRAW_TEXTS = {
    ru: "Ничья", en: "Draw", es: "Empate", pt: "Empate", de: "Remis", fr: "Nulle",
    pl: "Remis", tr: "Berabere", uk: "Нічия", ja: "引き分け", ko: "무승부", zh: "平局"
  };
  const DRAW_TEXT = DRAW_TEXTS[LANG] || DRAW_TEXTS.en;
  let noProgress = 0;
  function trackProgress(move) {
    const p = board[move.from.r][move.from.c];
    noProgress = (move.captures.length || !isKing(p)) ? 0 : noProgress + 1;
  }

  function initBoard() {
    board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < SIZE; c++)
        if ((r + c) % 2 === 1) board[r][c] = BLACK;
    for (let r = 5; r < 8; r++)
      for (let c = 0; c < SIZE; c++)
        if ((r + c) % 2 === 1) board[r][c] = WHITE;
  }

  const isKing = p => p === WHITE_KING || p === BLACK_KING;
  const isWhite = p => p === WHITE || p === WHITE_KING;
  const isBlack = p => p === BLACK || p === BLACK_KING;
  const sameSide = (a, b) => a !== EMPTY && b !== EMPTY && isWhite(a) === isWhite(b);
  const cloneBoard = () => board.map(r => r.slice());

  function getAllMoves(forPlayer) {
    const all = getAllMovesRaw(forPlayer);
    // обязательное взятие: если взятие есть, простые ходы недоступны
    return all.some(m => m.captures.length) ? all.filter(m => m.captures.length) : all;
  }

  function getAllMovesRaw(forPlayer) {
    const moves = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = board[r][c];
        if (p === EMPTY) continue;
        if (forPlayer === WHITE && !isWhite(p)) continue;
        if (forPlayer === BLACK && !isBlack(p)) continue;
        for (const m of getMovesForPiece(r, c)) {
          moves.push(m);
        }
      }
    }
    return moves;
  }

  function getMovesForPiece(r, c) {
    const p = board[r][c];
    if (p === EMPTY) return [];
    const isK = isKing(p);
    const dirs = isK ? [[-1,-1],[-1,1],[1,-1],[1,1]] : isWhite(p) ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
    const res = findCaptures(r, c, p, []);
    for (const [dr, dc] of dirs) {
      if (isK) {
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
          if (board[nr][nc] !== EMPTY) break;
          res.push({ from:{r,c}, to:{r:nr,c:nc}, captures:[] });
          nr += dr; nc += dc;
        }
      } else {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === EMPTY)
          res.push({ from:{r,c}, to:{r:nr,c:nc}, captures:[] });
      }
    }
    return res;
  }

  function findCaptures(r, c, piece, already) {
    const results = [];
    const isK = isKing(piece);
    const dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for (const [dr, dc] of dirs) {
      if (isK) {
        let nr = r + dr, nc = c + dc, er = -1, ec = -1;
        while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
          const cell = board[nr][nc];
          if (cell === EMPTY) { nr += dr; nc += dc; continue; }
          if (sameSide(piece, cell)) break;
          if (already.some(x => x.r === nr && x.c === nc)) break;
          er = nr; ec = nc; break;
        }
        if (er < 0) continue;
        let lr = er + dr, lc = ec + dc;
        while (lr >= 0 && lr < SIZE && lc >= 0 && lc < SIZE && board[lr][lc] === EMPTY) {
          const se = board[er][ec], sf = board[r][c];
          board[r][c] = EMPTY; board[er][ec] = EMPTY; board[lr][lc] = piece;
          const further = findCaptures(lr, lc, piece, [...already, {r:er,c:ec}]);
          board[lr][lc] = EMPTY; board[er][ec] = se; board[r][c] = sf;
          if (!further.length)
            results.push({ from:{r,c}, to:{r:lr,c:lc}, captures:[...already,{r:er,c:ec}] });
          else
            for (const f of further) results.push({ from:{r,c}, to:f.to, captures:f.captures });
          lr += dr; lc += dc;
        }
      } else {
        const er = r + dr, ec = c + dc, lr = r + 2*dr, lc = c + 2*dc;
        if (lr < 0 || lr >= SIZE || lc < 0 || lc >= SIZE) continue;
        if (board[er][ec] === EMPTY || sameSide(piece, board[er][ec])) continue;
        if (already.some(x => x.r === er && x.c === ec)) continue;
        if (board[lr][lc] !== EMPTY) continue;
        const se = board[er][ec], sf = board[r][c];
        board[r][c] = EMPTY; board[er][ec] = EMPTY; board[lr][lc] = piece;
        // шашка, дошедшая до последней линии посреди взятия, становится дамкой и взятие заканчивается
        const promotes = (piece === WHITE && lr === 0) || (piece === BLACK && lr === 7);
        const further = promotes ? [] : findCaptures(lr, lc, piece, [...already, {r:er,c:ec}]);
        board[lr][lc] = EMPTY; board[er][ec] = se; board[r][c] = sf;
        if (!further.length)
          results.push({ from:{r,c}, to:{r:lr,c:lc}, captures:[...already,{r:er,c:ec}] });
        else
          for (const f of further) results.push({ from:{r,c}, to:f.to, captures:f.captures });
      }
    }
    return results;
  }

  function applyMove(move) {
    let piece = board[move.from.r][move.from.c];
    board[move.from.r][move.from.c] = EMPTY;
    for (const cap of move.captures) board[cap.r][cap.c] = EMPTY;
    if (piece === WHITE && move.to.r === 0) piece = WHITE_KING;
    if (piece === BLACK && move.to.r === 7) piece = BLACK_KING;
    board[move.to.r][move.to.c] = piece;
    lastMove = { from: move.from, to: move.to };
  }

  const MAN_PST = [
    [0,0,0,0,0,0,0,0],[20,0,20,0,20,0,20,0],[0,12,0,15,0,15,0,12],
    [15,0,18,0,18,0,15,0],[0,18,0,20,0,20,0,18],[12,0,15,0,15,0,12,0],
    [0,10,0,12,0,12,0,10],[0,0,0,0,0,0,0,0]
  ];
  const KING_PST = [
    [0,15,0,18,0,18,0,15],[15,0,20,0,20,0,20,0],[0,20,0,22,0,22,0,20],
    [18,0,22,0,25,0,22,0],[0,20,0,25,0,22,0,20],[18,0,22,0,22,0,20,0],
    [0,20,0,20,0,20,0,18],[15,0,18,0,18,0,15,0]
  ];

  function evaluate() {
    let score = 0, wMen = 0, bMen = 0, wK = 0, bK = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = board[r][c];
        if (p === EMPTY) continue;
        if (p === WHITE) { wMen++; score += 100 + MAN_PST[r][c] + (7-r)*9; if (c===0||c===7) score += 5; }
        else if (p === BLACK) { bMen++; score -= 100 + MAN_PST[7-r][c] + r*9; if (c===0||c===7) score -= 5; }
        else if (p === WHITE_KING) { wK++; score += 360 + KING_PST[r][c]; }
        else if (p === BLACK_KING) { bK++; score -= 360 + KING_PST[r][c]; }
      }
    }
    const wMoves = getAllMoves(WHITE).length;
    const bMoves = getAllMoves(BLACK).length;
    score += (wMoves - bMoves) * 7;
    if (wMen + bMen + wK + bK <= 10) score += (wK - bK) * 55;
    if (wMoves === 0) return -99999;
    if (bMoves === 0) return 99999;
    return score;
  }

  function minimax(depth, alpha, beta, maximising, ply) {
    if (depth <= 0 || ply > 6) return evaluate();
    const player = maximising ? WHITE : BLACK;
    let moves = getAllMoves(player);
    if (!moves.length) return maximising ? -99999 - ply : 99999 + ply;
    // Prefer captures, then central moves; сильно ограничиваем ветвление
    moves.sort((a, b) => {
      const d = b.captures.length - a.captures.length;
      if (d) return d;
      return (Math.abs(a.to.r-3.5)+Math.abs(a.to.c-3.5)) - (Math.abs(b.to.r-3.5)+Math.abs(b.to.c-3.5));
    });
    // Анализируем только часть ходов (не все)
    if (moves.length > 6) moves = moves.slice(0, 6);
    if (maximising) {
      let best = -Infinity;
      for (const m of moves) {
        const saved = cloneBoard(); applyMove(m);
        const v = minimax(depth-1, alpha, beta, false, ply+1);
        board = saved;
        if (v > best) best = v;
        if (v > alpha) alpha = v;
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const m of moves) {
        const saved = cloneBoard(); applyMove(m);
        const v = minimax(depth-1, alpha, beta, true, ply+1);
        board = saved;
        if (v < best) best = v;
        if (v < beta) beta = v;
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  // ===== адаптивная сложность =====
  // Последние 10 партий: "w" — игрок выиграл, "l" — проиграл, "d" — ничья
  const STATS_KEY = "cg_stats_v1";
  function loadResults() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY) || "[]").slice(-10); } catch (e) { return []; }
  }
  function recordResult(res) {
    const list = loadResults();
    list.push(res);
    try { localStorage.setItem(STATS_KEY, JSON.stringify(list.slice(-10))); } catch (e) {}
  }
  // от -1 (игрок часто проигрывает) до +1 (часто выигрывает); первые 3 партии не учитываем
  function skillBoost() {
    const list = loadResults();
    if (list.length < 3) return 0;
    const wins = list.filter(x => x === "w").length;
    const losses = list.filter(x => x === "l").length;
    return Math.max(-1, Math.min(1, (wins - losses) / list.length));
  }

  function findBestMove() {
    const moves = getAllMoves(BLACK);
    if (!moves.length) return null;

    moves.sort((a, b) => {
      const d = b.captures.length - a.captures.length;
      if (d) return d;
      return (Math.abs(a.to.r-3.5)+Math.abs(a.to.c-3.5)) - (Math.abs(b.to.r-3.5)+Math.abs(b.to.c-3.5));
    });

    // easy: почти случайный ход
    if (DIFF === "easy") {
      if (Math.random() < 0.7 && moves.length > 1) {
        return moves[Math.floor(Math.random() * Math.min(6, moves.length))];
      }
      const pool = moves.slice(0, Math.min(4, moves.length));
      return pool[Math.floor(Math.random() * pool.length)] || moves[0];
    }

    // medium / hard: иногда специально ходим не лучшим ходом
    // и анализируем только часть кандидатов
    let depth = CFG.max;
    if (moves.length > 8) depth = CFG.mid;
    if (moves.length > 12) depth = CFG.high;

    // не смотрим все ходы — максимум 5–7 кандидатов
    const maxCand = DIFF === "hard" ? 7 : 5;
    const candidates = moves.slice(0, Math.min(maxCand, moves.length));

    // с некоторой вероятностью берём просто случайный из кандидатов (ошибка)
    // если игрок часто выигрывает, бот ошибается реже; если часто проигрывает — чаще
    const baseBlunder = DIFF === "hard" ? 0.28 : 0.45;
    const blunderChance = Math.max(0.05, Math.min(0.6, baseBlunder - 0.15 * skillBoost()));
    if (Math.random() < blunderChance && candidates.length > 1) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    let bestScore = Infinity, bestList = [];
    for (const m of candidates) {
      const saved = cloneBoard(); applyMove(m);
      const score = minimax(Math.max(0, depth - 1), -Infinity, Infinity, true, 1);
      board = saved;
      if (score < bestScore) { bestScore = score; bestList = [m]; }
      else if (score === bestScore) bestList.push(m);
    }

    // даже среди "лучших" часто выбираем не первый
    if (bestList.length > 1 && Math.random() < 0.4) {
      return bestList[Math.floor(Math.random() * bestList.length)];
    }
    bestList.sort((a, b) => b.captures.length - a.captures.length);
    if (bestList.length > 1 && Math.random() < 0.25) {
      return bestList[Math.floor(Math.random() * Math.min(3, bestList.length))];
    }
    return bestList[0] || moves[0];
  }

  // UI
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const turnDot = document.getElementById("turn-dot");
  const turnText = document.getElementById("turn-text");
  const winOverlay = document.getElementById("win-overlay");

  function render() {
    boardEl.innerHTML = "";
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = document.createElement("div");
        cell.className = "cell " + ((r + c) % 2 === 1 ? "dark" : "light");
        if (lastMove && ((lastMove.from.r===r&&lastMove.from.c===c)||(lastMove.to.r===r&&lastMove.to.c===c)))
          cell.classList.add("last-move");
        if (selected && possibleMoves.some(m => m.to.r===r && m.to.c===c)) cell.classList.add("highlight");
        if (selected && selected.r===r && selected.c===c) cell.classList.add("selected");
        const p = board[r][c];
        if (p !== EMPTY) {
          const piece = document.createElement("div");
          piece.className = "piece " + (isWhite(p) ? "white" : "black");
          if (isKing(p)) piece.classList.add("king");
          cell.appendChild(piece);
        }
        // доступность: клетка получает фокус с клавиатуры и название вида "b3, white king"
        const names = { [WHITE]: "white man", [BLACK]: "black man", [WHITE_KING]: "white king", [BLACK_KING]: "black king" };
        cell.tabIndex = 0;
        cell.setAttribute("role", "button");
        cell.setAttribute("aria-label", "abcdefgh"[c] + (SIZE - r) + (p !== EMPTY ? ", " + names[p] : ", empty"));
        cell.addEventListener("click", () => onCellClick(r, c));
        cell.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCellClick(r, c); }
        });
        boardEl.appendChild(cell);
      }
    }
  }

  function updateStatus(text) {
    statusEl.textContent = text;
    if (currentPlayer === WHITE) {
      turnDot.className = "dot white";
      turnText.textContent = t.whiteYou;
    } else {
      turnDot.className = "dot black";
      turnText.textContent = t.blackBot;
    }
  }

  function onCellClick(r, c) {
    if (gameOver || thinking || currentPlayer !== WHITE) return;
    const p = board[r][c];
    if (isWhite(p)) {
      selected = { r, c };
      possibleMoves = getAllMoves(WHITE).filter(m => m.from.r===r && m.from.c===c);
      render();
      return;
    }
    if (selected) {
      // если к одной клетке ведёт несколько путей взятия, берём путь с наибольшим числом взятий
      const move = possibleMoves
        .filter(m => m.to.r===r && m.to.c===c)
        .sort((a, b) => b.captures.length - a.captures.length)[0];
      if (move) {
        trackProgress(move);
        applyMove(move);
        selected = null; possibleMoves = [];
        currentPlayer = BLACK;
        render();
        updateStatus(t.botThinking);
        thinking = true;
        setTimeout(() => {
          try {
            if (!getAllMoves(BLACK).length) {
              gameOver = true; thinking = false; recordResult("w");
              updateStatus(t.youWin);
              winOverlay.style.display = "flex";
              // карточка победы остаётся на 10 секунд, потом вход выполняется сам
              startWinCountdown();
              return;
            }
            const best = findBestMove();
            if (best) { trackProgress(best); applyMove(best); }
            currentPlayer = WHITE; thinking = false;
            if (noProgress >= DRAW_LIMIT) {
              gameOver = true; recordResult("d"); updateStatus(DRAW_TEXT); render(); return;
            }
            if (!getAllMoves(WHITE).length) {
              gameOver = true; recordResult("l"); updateStatus(t.botWin); render(); return;
            }
            updateStatus(t.yourTurn); render();
          } catch (e) {
            console.error(e);
            thinking = false;
            currentPlayer = WHITE;
            updateStatus(t.yourTurn);
            render();
          }
        }, DIFF === "hard" ? 80 : 150);
        return;
      }
    }
    selected = null; possibleMoves = []; render();
  }

  let winTimer = null;
  function startWinCountdown() {
    const enterBtn = document.getElementById("btn-enter");
    // запоминаем исходную подпись кнопки, чтобы отсчёт не накапливался между партиями
    if (!enterBtn.dataset.label) enterBtn.dataset.label = enterBtn.textContent;
    const baseLabel = enterBtn.dataset.label;
    let secs = 10;
    enterBtn.textContent = baseLabel + " (" + secs + ")";
    if (winTimer) clearInterval(winTimer);
    winTimer = setInterval(() => {
      secs--;
      if (secs > 0) { enterBtn.textContent = baseLabel + " (" + secs + ")"; return; }
      clearInterval(winTimer); winTimer = null;
      sendWin();
    }, 1000);
  }

  function sendWin() {
    const msg = { type: "CHECKERS_WIN" };
    try { window.parent.postMessage(msg, "*"); } catch(e) {}
    try { window.top.postMessage(msg, "*"); } catch(e) {}
    // один повтор на случай, если родитель ещё не успел подписаться
    setTimeout(() => {
      try { window.parent.postMessage(msg, "*"); } catch(e) {}
    }, 100);
  }

  document.getElementById("btn-new").addEventListener("click", () => {
    initBoard(); currentPlayer = WHITE; selected = null; possibleMoves = [];
    lastMove = null; gameOver = false; thinking = false; noProgress = 0;
    winOverlay.style.display = "none";
    updateStatus(t.yourTurn); render();
  });
  document.getElementById("btn-close").addEventListener("click", () => {
    try { window.parent.postMessage({ type: "CHECKERS_CLOSE" }, "*"); } catch(e) {}
  });
  document.getElementById("btn-enter").addEventListener("click", () => {
    const btn = document.getElementById("btn-enter");
    if (winTimer) { clearInterval(winTimer); winTimer = null; }
    btn.textContent = t.opening; btn.disabled = true; sendWin();
  });

  initBoard();
  updateStatus(t.yourTurn);
  render();
})();
