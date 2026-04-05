# Operations

## Developer Workflow: Claude Code Cloud Sessions

### What we have now

The `/admin` route is the single home for internal tooling. It provides a three-panel workspace:

1. **Cloud Sessions panel** (left) — Lists active Claude Code cloud sessions. Click to switch between them. Sessions are cloud-only so they persist across devices and keep the local machine free.

2. **Terminal Session Switcher** (center) — Each terminal tab maps to a Claude Code cloud session. Switching tabs is equivalent to running `claude session resume <id>`. The terminal shows session output and accepts commands.

3. **Vercel Preview + GitHub PR** (right) — Auto-derives the Vercel preview URL and GitHub PR link from the current session's branch. Opens in Safari specifically so previews stay visually separate from your editor.

### How the session-to-terminal mapping works

- Each Claude Code cloud session corresponds to a feature branch
- When you select a session, the terminal panel connects to it
- The branch name is used to derive:
  - Vercel preview: `https://{repo}-git-{branch}-{owner}.vercel.app`
  - GitHub PR: search by `head:{branch}`
- "Open Both in Safari" launches both URLs with a slight delay to avoid browser blocking

### What's not ready yet

- **Real session integration**: Currently uses mock data. Needs the Claude Code cloud session API to list/resume sessions programmatically.
- **Actual terminal**: The terminal panel is a simulated display. Real implementation would use xterm.js or similar, connected via WebSocket to a session process.
- **Branch auto-detection**: Currently derived from session metadata. Could also read from local git context via an API route.

## Future: Dedicated Operations App

### The idea

A standalone desktop application dedicated to company operations. Not a second codebase — a thin native shell (Electron or Tauri) that loads the Vercel preview URL for the `/admin` route as its content.

### Why separate from the web app

- Native code only for things that actually need it: spawning Terminal.app windows, opening Safari specifically (not just "a browser"), system notifications, dock badge for session status
- The web layer updates via Vercel preview deploys — no separate build/release cycle for content changes
- Desktop shell is static and rarely changes; content is live

### Architecture

```
[Native Shell]
  └── loads: https://{repo}-git-{branch}-{owner}.vercel.app/admin
  └── native bridge (IPC):
      ├── open-terminal: spawns Terminal.app with `claude session resume`
      ├── open-safari: opens URL in Safari specifically
      ├── notifications: system-level alerts for CI failures, review requests
      └── session-context: reads local git state, running processes
```

### When to build it

- Once Claude Code cloud sessions stabilize and have a proper API
- When there's a real need for native features beyond what `/admin` can do in a browser
- When maintaining a native shell is worth the cost (packaging, signing, updates)

### What exists as reference

The previous session prototyped this as an Electron app in `command-center/` with:
- IPC handlers for `focus-open-url`, `focus-list-sessions`, `focus-open-terminal`, `focus-get-context`
- Preload bridge exposing those APIs to the renderer
- Three-panel grid layout (sessions, terminal, quick-open)

That prototype lived in a different repo iteration. The patterns are documented here for when the time comes.

## Development Workflow

### Standard flow for working on this project

1. Claude Code cloud session starts on a feature branch
2. `/admin` dashboard shows the session and derives context
3. Vercel deploys a preview for the branch automatically
4. Click "Open Both in Safari" to see the preview + PR side by side
5. Work happens in the terminal panel (or your local editor)
6. Push, Vercel rebuilds preview, refresh Safari

### Why Safari specifically

- Clean visual split: editor (VS Code / cursor) on one screen, Safari on another
- Safari is the "read-only review" app, your editor is the "write" app
- Avoids tab soup in the same browser where you have docs, GitHub, Slack, etc.
