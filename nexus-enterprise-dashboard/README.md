# Nexus Enterprise Dashboard

> Where Enterprise Meets Art, Where Functionality Meets Elegance

A world-class enterprise Single Page Application built entirely with vanilla HTML, CSS, and JavaScript. No frameworks, no build step required — just premium engineering.

## Features

- **7 Integrated Apps**: Dashboard, Portfolio, Quiz, Expense Tracker, News Center, GitHub Explorer, Kanban Board
- **SPA Architecture**: Client-side routing with middleware chain
- **State Management**: Proxy-based reactive state with undo/redo and localStorage persistence
- **Premium UI**: Glassmorphism, holographic effects, 3D transforms, particle backgrounds
- **Theme System**: Light/dark modes with system preference detection
- **PWA Ready**: Service worker, manifest, offline support
- **i18n**: English, Spanish, and French localization
- **Accessibility**: Skip links, ARIA live regions, keyboard navigation, focus traps
- **Responsive**: Optimized from 320px mobile to 4K displays

## Quick Start

```bash
cd nexus-enterprise-dashboard
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Alternatively, serve with any static file server:

```bash
python3 -m http.server 3000
npx serve .
```

## Project Structure

```
nexus-enterprise-dashboard/
├── index.html          # Entry point
├── css/                # Stylesheets (variables, themes, animations)
├── js/
│   ├── app.js          # Main application bootstrap
│   ├── modules/        # Core systems (router, state, theme, etc.)
│   ├── apps/           # Feature modules (dashboard, kanban, etc.)
│   └── utils/          # Helpers, validators, formatters
├── locales/            # i18n translation files
├── assets/             # Images, fonts, SVG
└── sw.js               # Service worker
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Focus global search |
| `Escape` | Close modals |

## Tech Stack

- Pure HTML5, CSS3, ES Modules
- Canvas API for charts and particles
- History API for routing
- Proxy API for state management
- Service Worker for offline caching
- LocalStorage for persistence

## License

MIT — see [LICENSE](LICENSE)
