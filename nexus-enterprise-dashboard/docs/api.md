# API Reference

## Core Modules

### Router (`js/modules/router.js`)

| Method | Description |
|--------|-------------|
| `addRoute(path, component, options)` | Register a route |
| `addMiddleware(fn)` | Add navigation middleware |
| `navigate(path, data, replace)` | Navigate to a route |
| `getCurrentRoute()` | Get active route path |

### StateManager (`js/modules/stateManager.js`)

| Method | Description |
|--------|-------------|
| `getState(path)` | Get state value by dot-notation path |
| `setState(path, value)` | Set state value |
| `subscribe(path, callback)` | Listen for state changes |
| `undo()` / `redo()` | History navigation |
| `persist()` / `restore()` | localStorage sync |

### NotificationManager (`js/modules/notificationManager.js`)

| Method | Description |
|--------|-------------|
| `show(message, type, options)` | Display toast notification |
| `success/error/warning/info()` | Typed shortcuts |
| `clear()` | Remove all notifications |

## App Module Contract

Each app in `js/apps/` exports:

```javascript
export default {
  render(data) { return '<html string>'; },
  onRoute() { /* bind event listeners */ }
};
```
