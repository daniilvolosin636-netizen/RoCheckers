# ♟️ RoCheckers

**Русский** | [English](#english)

RoCheckers — браузерное расширение для Chrome, Edge и других браузеров на Chromium. Перед входом в игровой режим Roblox оно предлагает сыграть в шашки с ботом. Победил — проходишь дальше. Проиграл — пробуй снова.

> Проект не связан с Roblox Corporation.

## 🎮 Как это выглядит

1. Открой игровой режим Roblox.
2. Нажми **«Играть»** (или «Присоединиться» у сервера либо у друга на главной, в профиле и в списке друзей).
3. Откроется доска. Ты играешь белыми.
4. Выиграй у бота, и вход в режим откроется сам.

Если ты нажал кнопку до игры, после победы расширение нажмёт её за тебя. Если автоматически не получилось, появится подсказка «Нажми Play».

## ♟️ Правила

Правила классические, с несколькими особенностями:

- **Обязательное взятие.** Если можно побить шашку, нужно это сделать. В этот момент простые ходы недоступны.
- **Дамки.** Шашка, дошедшая до противоположного края, становится дамкой. Дамка ходит и бьёт на любое расстояние.
- **Бить назад можно.** Обычные шашки тоже могут бить назад.
- **Превращение посреди взятия.** Если шашка дошла до последней линии во время серии взятий, она становится дамкой, и серия заканчивается.
- **Ничья.** Если 40 полуходов подряд нет взятий и не ходят простые шашки, партия заканчивается вничью.
- **Выбор пути.** Если к одной клетке ведут несколько путей взятия, выбирается путь с наибольшим числом взятий.

Ходить можно мышью или с клавиатуры: Tab переводит фокус на клетку, Enter или пробел выбирает её.

## 🎯 Уровни сложности

Сложность определяется по странице Roblox автоматически:

| Аккаунт | Сложность |
|---|---|
| Roblox Kids (детский) | Лёгкая |
| Аккаунт до 13 лет или под родительским контролем | Средняя |
| Обычный Roblox | Сложная |

Ещё работает **адаптивная сложность**. Расширение помнит последние 10 партий. Если ты часто выигрываешь, бот играет точнее. Если часто проигрываешь, он ошибается чаще. Статистика хранится только в твоём браузере.

## 🎨 Темы и праздники

Оформление меняется по дате автоматически. Праздники важнее сезонов.

| Период | Тема |
|---|---|
| 31 августа – 3 сентября | День рождения Roblox |
| 20 октября – 2 ноября | Хэллоуин |
| 12 – 16 февраля | 14 февраля |
| 20 – 26 декабря | Рождество |
| 27 декабря – 7 января | Новый год |
| Декабрь, январь, февраль | Зима |
| Март – май | Весна |
| Июнь – август | Лето |
| Сентябрь – ноябрь | Осень |

### 🪵 Тема сайта «Шашки · Дерево»

Бесплатная тема оформления Roblox, Roblox Plus не нужен. Включается в **Настройки → Browser preferences**, рядом с остальными темами. Когда она включена, доска в игре тоже становится деревянной.

## ♙ Значки

Если установлено расширение и сервер настроен, в твоём профиле Roblox появится значок ♙ (пешка). Особые значки ♔ и ♕ выдаются создателям проекта.

## 📥 Установка

1. Открой [репозиторий на GitHub](https://github.com/daniilvolosin636-netizen/RoCheckers).
2. Нажми **Code → Download ZIP** и распакуй архив.
3. Открой `chrome://extensions/` (в Edge: `edge://extensions/`).
4. Включи **режим разработчика**.
5. Нажми **«Загрузить распакованное»** и выбери папку с `manifest.json`.

## 🛠️ Для разработчиков

### Структура проекта

| Файл | Что делает |
|---|---|
| `manifest.json` | Описание расширения, страницы Roblox и нужные права |
| `content.js` | Перехватывает кнопки «Играть» и «Присоединиться», открывает доску |
| `checkers.html`, `checkers.js`, `style.css` | Игра, логика бота, оформление тем |
| `badge.js` | Показывает значок ♙ в профилях |
| `server/worker.js` | Серверная часть на Cloudflare Workers |
| `icons/` | Иконки расширения |

### Сервер для значков

Сервер нужен только для значков. Пошаговая инструкция в [server/README.txt](server/README.txt). Коротко: создай Worker, подключи хранилище KV с именем `USERS`, а адрес сервера вставь в переменную `API_BASE` в `content.js` и `badge.js`.

### Игра без Roblox

Открой `checkers.html` в браузере и добавь параметры в адрес, например `?lang=ru&difficulty=hard&theme=classic`. Так можно проверить игру, не заходя в Roblox.

## 🔒 Приватность

- Если сервер настроен, расширение раз в 7 дней отправляет на него только ID твоего аккаунта Roblox.
- Прохождение гейта и статистика сложности хранятся локально в браузере.
- Пароль, cookies и другие данные аккаунта расширение не читает и не отправляет.

## ⚠️ Ограничения

- Это мини-игра, а не система защиты. Удалить расширение и зайти в режим можно без игры.
- Победы пока проверяются только в браузере, сервер их не видит.
- Расширение работает только на страницах Roblox, перечисленных в `manifest.json`.

## 🤝 Вклад в проект

Предложения и баг-репорты пишите в Issues. Если меняете логику игры, опишите, что изменилось и почему.

## 👥 Создатели

- [Создатель 1 — профиль Roblox](https://www.roblox.com/users/1388899632/profile)
- [Создатель 2 — профиль Roblox](https://www.roblox.com/users/1515075892/profile)

## 🧰 Технологии

JavaScript · Chrome Extensions API (Manifest V3) · Cloudflare Workers · Cloudflare KV

---

<a id="english"></a>

# ♟️ RoCheckers (English)

[Русский](#русский) | **English**

RoCheckers is a Chromium browser extension (Chrome, Edge, and others). Before you enter a Roblox game mode, it asks you to beat a checkers bot. Win and you're in. Lose and you can try again.

> This project is not affiliated with Roblox Corporation.

## 🎮 How it works

1. Open a supported Roblox game mode.
2. Click **Play** (or **Join** on a server, or on a friend from Home, a profile, or the friends list).
3. A board appears. You play white.
4. Beat the bot and the game mode opens automatically.

If you clicked the button before playing, the extension clicks it for you after your win. If that doesn't work, a hint appears asking you to press Play.

## ♟️ Rules

The rules are classic, with a few details:

- **Mandatory captures.** If you can capture, you must. Simple moves are unavailable at that point.
- **Kings.** A piece that reaches the far edge becomes a king. Kings move and capture at any distance.
- **Backward captures** are allowed for regular pieces.
- **Promotion mid-capture.** If a piece reaches the last row during a capture sequence, it becomes a king and the sequence ends.
- **Draw.** If 40 half-moves pass with no captures and no regular-piece moves, the game is a draw.
- **Capture paths.** If several capture paths lead to the same square, the one with the most captures is used.

You can play with the mouse or the keyboard: Tab moves focus between squares, Enter or Space selects one.

## 🎯 Difficulty

Difficulty is detected automatically from the Roblox page:

| Account | Difficulty |
|---|---|
| Roblox Kids | Easy |
| Accounts under 13 or with parental controls | Medium |
| Regular Roblox | Hard |

**Adaptive difficulty** also applies. The extension remembers your last 10 games. If you win often, the bot plays more accurately. If you lose often, it makes more mistakes. Stats stay in your browser.

## 🎨 Themes and holidays

The theme changes automatically with the date. Holidays take priority over seasons.

| Period | Theme |
|---|---|
| Aug 31 – Sep 3 | Roblox Birthday |
| Oct 20 – Nov 2 | Halloween |
| Feb 12 – 16 | Valentine's Day |
| Dec 20 – 26 | Christmas |
| Dec 27 – Jan 7 | New Year |
| December, January, February | Winter |
| March – May | Spring |
| June – August | Summer |
| September – November | Autumn |

### 🪵 Site theme "Checkers · Wood"

A free Roblox site theme, no Roblox Plus needed. Turn it on in **Settings → Browser preferences**, next to the other themes. While it's on, the in-game board is wooden too.

## ♙ Badges

If the extension is installed and the server is configured, a ♙ (pawn) badge appears on your Roblox profile. The special ♔ and ♕ badges belong to the project's creators.

## 📥 Installation

1. Open the [GitHub repository](https://github.com/daniilvolosin636-netizen/RoCheckers).
2. Click **Code → Download ZIP** and extract it.
3. Open `chrome://extensions/` (Edge: `edge://extensions/`).
4. Turn on **Developer mode**.
5. Click **Load unpacked** and select the folder that contains `manifest.json`.

## 🛠️ For developers

### Project structure

| File | Purpose |
|---|---|
| `manifest.json` | Extension description, Roblox pages, and permissions |
| `content.js` | Intercepts Play and Join buttons and opens the board |
| `checkers.html`, `checkers.js`, `style.css` | The game, bot logic, and theme styles |
| `badge.js` | Shows the ♙ badge on profiles |
| `server/worker.js` | Server side on Cloudflare Workers |
| `icons/` | Extension icons |

### Badge server

The server is only needed for badges. See [server/README.txt](server/README.txt). In short: create a Worker, bind a KV namespace named `USERS`, and set `API_BASE` in `content.js` and `badge.js` to your Worker URL.

### Play without Roblox

Open `checkers.html` in a browser and add parameters, for example `?lang=en&difficulty=hard&theme=classic`.

## 🔒 Privacy

- If the server is configured, the extension sends only your Roblox user ID to it, at most once every 7 days.
- Gate progress and difficulty stats are stored locally in your browser.
- The extension does not read or send your password, cookies, or other account data.

## ⚠️ Limitations

- This is a mini-game, not a security system. Removing the extension lets you into the game mode without playing.
- Wins are checked only in the browser. The server does not verify them.
- The extension works only on the Roblox pages listed in `manifest.json`.

## 🤝 Contributing

Send suggestions and bug reports through Issues. If you change game logic, describe what changed and why.

## 🧰 Tech

JavaScript · Chrome Extensions API (Manifest V3) · Cloudflare Workers · Cloudflare KV

---

<a id="русский"></a>
**RoCheckers — заслужи свой вход! ♟️**
