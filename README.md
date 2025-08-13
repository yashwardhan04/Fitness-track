MONGODB_URL=your_mongodb_connection_string
JWT=your_jwt_secret
# Optional (for emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
EMAIL_FROM=no-reply@example.com
# PORT provided by platform; fallback locally:
PORT=8080
```

Client (Production via Netlify `netlify.toml`):
- `REACT_APP_API_URL=https://fitness-tracker-pklg.onrender.com/api`
- `REACT_APP_BACKEND_URL=https://fitness-tracker-pklg.onrender.com`

## 📚 API (Auth required unless noted; header: `Authorization: Bearer <token>`)

### User (prefix `/api/user`)
- POST `/signup` — Register
- POST `/signin` — Login
- GET `/dashboard` — User dashboard summary
- GET `/workout?date=YYYY-MM-DD` — Workouts for a date
- GET `/workouts` — Paginated/filterable list
- POST `/workout` — Create workout
- PUT `/workout/:id` — Update workout
- DELETE `/workout/:id` — Delete workout

### Blogs (prefix `/api/blogs`)
- POST `/` — Create blog (auth)
- PUT `/:id` — Update blog (auth)
- GET `/` — List blogs (public)
- GET `/:id` — Blog by ID (public)

### Contact (prefix `/api/contact`)
- POST `/` — Create message
- GET `/my` — My messages
- GET `/` — All messages (admin)
- PATCH `/:id/status` — Update status (admin)

### PRs (prefix `/api/prs`)
- GET `/` — List PRs
- POST `/` — Create PR
- DELETE `/:id` — Delete PR

### Goals (prefix `/api/goals`)
- GET `/` — Get goals
- PUT `/` — Update goals

## 🌐 Deployment

Frontend (Netlify)
- Configured via `netlify.toml`:
  - Base: `client`, Command: `npm run build`, Publish: `build`
  - SPA redirects: `/* -> /index.html`
  - Env: `REACT_APP_API_URL`, `REACT_APP_BACKEND_URL`

Backend (Render)
- Uses `process.env.PORT` (fallback 8080)
- CORS allows: `https://fitness-track40.netlify.app` and `http://localhost:3000`
- Env required: `MONGODB_URL`, `JWT`, SMTP vars (optional)

## 🎨 Minimal Palette
- Primary: `#007AFF`
- Secondary: `#5B86E5`
- Text Primary: `#404040`
- Shadow: `#00000020`

## 🗂️ Structure
```
Fitness Tracker/
  client/  # React app
  server/  # Express API + cron jobs
  netlify.toml
```

## 🤝 Contributing
PRs welcome! Please open an issue or a PR for suggestions/improvements.

---
Made with ❤️ and discipline.
EOF

git add README.md
git commit -m "docs: add sexy README with features, tech stack, API and deployment"
git push origin main
```

- Want me to also add a few dashboard screenshots later? I can capture and commit them.

- Added a comprehensive README with emojis, minimal palette, live links, setup, env vars, API docs, deployment, and a screenshot reference.
