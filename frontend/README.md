# Frontend (React + Tailwind)

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

- Configure `VITE_API_URL` to your FastAPI URL.
- Deploy to Netlify/Vercel by connecting the repo and setting:
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Env: `VITE_API_URL=https://your-api.onrender.com/api`
