# ♟️ RoCheckers — Roblox Checkers Gate

**English** | [Русский](#русский)

A browser extension that adds checkers-inspired rank badges to Roblox profiles.

## ✨ Features

- ♙ **Pawn** — default rank for regular users.
- ♕ **Queen** — special rank.
- ♔ **King** — special rank.
- 🎨 Custom extension icon.
- ⚡ Lightweight browser extension.
- ☁️ Cloudflare Worker backend with KV storage.

## 📥 Download & Install

### Download the extension

1. Open the [RoCheckers GitHub repository](https://github.com/daniilvolosin636-netizen/RoCheckers).
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded ZIP archive on your computer.

### Install in Google Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the extracted extension folder containing `manifest.json`.

The extension should now appear in your Chrome extensions list.

> **Note:** GitHub downloads the project source code, not a Chrome Web Store package. The extension folder must contain `manifest.json`.

## ⚙️ Backend Configuration

RoCheckers uses a Cloudflare Worker backend and a KV namespace.

To deploy your own instance:

1. Deploy the Worker code from the `server` directory.
2. Create a Cloudflare KV namespace.
3. Configure the `USERS` KV binding in Worker settings.
4. Set the correct Worker URL in the extension configuration.

## 🛠️ Built With

- JavaScript
- Chrome Extensions API
- Cloudflare Workers
- Cloudflare KV

## 🔒 Security

Never commit API tokens, private keys, or other secrets to this repository.

## 📄 License

No license has been specified yet. All rights reserved unless a license is added to this repository.

---

<a id="русский"></a>

# 🇷🇺 Русская версия

RoCheckers — это браузерное расширение, которое добавляет значки рангов в стиле шашек в профили Roblox.

## ✨ Возможности

- ♙ **Pawn (Пешка)** — стандартный ранг обычного пользователя.
- ♕ **Queen (Королева)** — особый ранг.
- ♔ **King (Король)** — особый ранг.
- 🎨 Собственная иконка расширения.
- ⚡ Лёгкое браузерное расширение.
- ☁️ Серверная часть на Cloudflare Workers с хранилищем KV.

## 📥 Скачать и установить

### Скачать расширение

1. Открой [репозиторий RoCheckers на GitHub](https://github.com/daniilvolosin636-netizen/RoCheckers).
2. Нажми зелёную кнопку **Code**.
3. Выбери **Download ZIP**.
4. Распакуй скач
