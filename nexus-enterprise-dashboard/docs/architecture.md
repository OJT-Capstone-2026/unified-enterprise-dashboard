# Architecture

## Overview

Nexus Enterprise Dashboard follows a modular SPA architecture with zero external JavaScript dependencies.

```
┌─────────────────────────────────────────────┐
│                  index.html                  │
│              (Shell + Sidebar)               │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│                 app.js                       │
│         (Bootstrap + Event Wiring)          │
└──────┬───────────┬───────────┬──────────────┘
       │           │           │
┌──────▼──┐  ┌─────▼─────┐  ┌─▼──────────┐
│ Router  │  │   State   │  │   Theme    │
│         │  │  Manager  │  │  Manager   │
└──────┬──┘  └───────────┘  └────────────┘
       │
┌──────▼──────────────────────────────────────┐
│              App Modules                     │
│  Dashboard │ Portfolio │ Quiz │ Expense   │
│  News │ GitHub │ Kanban │ Settings         │
└─────────────────────────────────────────────┘
```

## Routing Flow

1. User clicks `[data-router]` link or `router.navigate()` is called
2. Middleware chain executes (auth → analytics → performance)
3. Route component `render()` returns HTML string
4. HTML injected into `#page-content`
5. `onRoute()` binds event listeners for interactivity

## State Flow

- Proxy-based reactivity on top-level state object
- Nested paths supported via dot notation (`user.name`)
- Changes tracked in history stack for undo/redo
- Persisted to localStorage on demand

## CSS Architecture

- `variables.css` — Design tokens
- `light-theme.css` / `dark-theme.css` — Theme overrides
- `animations.css` — Keyframes and effect classes
- `main.css` — Component styles
- `responsive.css` — Breakpoint adaptations

## Performance

- ES Module lazy evaluation per route
- Canvas charts rendered on demand
- Particle system disabled with `prefers-reduced-motion`
- Service worker caches static assets
