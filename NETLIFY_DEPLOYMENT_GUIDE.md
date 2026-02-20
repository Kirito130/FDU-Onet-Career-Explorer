# Netlify Deployment Guide – FDU Careers Exploration

Step-by-step guide to deploy the FDU Careers Exploration app (front-end and back-end) on Netlify.

---

## Prerequisites

- A **Netlify account** ([sign up](https://app.netlify.com/signup))
- Your project in a **Git repository** (GitHub, GitLab, or Bitbucket)
- **Supabase** project with the O*NET database and mappings (see [DOCUMENTATION.md](./DOCUMENTATION.md) for DB setup)

---

## 1. Prepare the Repository

### 1.1 Ensure required files are committed

- `public/` must be in the repo (contains `css/style.css`, `js/app.js`).  
  **Important:** `public` must **not** be in `.gitignore`, or Netlify will fail with “Deploy directory 'public' does not exist”.
- Root files: `server.js`, `config.js`, `package.json`, `netlify.toml`
- `netlify/functions/server.js`
- `src/`, `views/`, and the rest of the app

### 1.2 Check `.gitignore`

Do **not** ignore:

- `public`
- `public/**`

If you use a framework that normally ignores `public` (e.g. Gatsby), remove that ignore for this repo so Netlify can use `publish = "public"`.

**If `public` was previously in `.gitignore`:** after removing it, add and commit the folder so it exists on Netlify:

```bash
git add public
git add .gitignore
git commit -m "Include public folder for Netlify deploy"
git push
```

---

## 2. Create the Netlify Site

1. Go to [Netlify](https://app.netlify.com) and log in.
2. Click **“Add new site”** → **“Import an existing project”**.
3. Choose your Git provider (GitHub / GitLab / Bitbucket) and authorize Netlify if asked.
4. Pick the repository that contains this project.
5. You’ll see **Build settings**; the next step configures them via `netlify.toml`. You can leave defaults and click **“Deploy”** after setting env vars, or confirm the settings in the UI match the next section.

---

## 3. Build and Publish Settings

The repo’s `netlify.toml` should set:

- **Build command:** `npm run build`
- **Publish directory:** `public`
- **Functions directory:** `netlify/functions`

In Netlify:

1. **Site configuration** → **Build & deploy** → **Build settings**.
2. Confirm:
   - **Build command:** `npm run build` (or “Read from netlify.toml”).
   - **Publish directory:** `public`.
   - **Functions directory:** `netlify/functions` (or “Read from netlify.toml”).

If you use **“Read from netlify.toml”**, these come from the file. Do **not** set publish to a directory that doesn’t exist (e.g. `dist` or `build`) unless you change `netlify.toml` to match.

---

## 4. Set Environment Variables

The app needs Supabase (and optionally other) env vars.

1. In Netlify: **Site configuration** → **Environment variables** → **Add a variable** (or **Import from .env**).
2. Add at least:

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `SUPABASE_SECRET_KEY` | Yes* | Secret key from Supabase **Settings → API Keys** (preferred) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes* | Legacy service role key (use if you don’t use the new secret key) |

\* Use either `SUPABASE_SECRET_KEY` (new keys) or `SUPABASE_SERVICE_ROLE_KEY` (legacy).

3. Optional:

| Variable | Description |
|----------|-------------|
| `SUPABASE_PUBLISHABLE_KEY` | For client-side / new API keys |
| `DATABASE_URL` | Direct Postgres URL if used |

4. **Scope:** set variables for **All** or at least **Production** (and **Deploy previews** if you use branch deploys).

5. Save. Redeploy the site so the new variables are applied.

---

## 5. Deploy

1. Trigger a deploy:
   - **Option A:** Push a commit to the branch connected to Netlify (e.g. `main`).
   - **Option B:** **Deploys** → **Trigger deploy** → **Deploy site**.
2. Open **Deploys** and watch the **Deploy log**.
3. Build should:
   - Run `npm run build`
   - Publish from `public`
   - Build the function in `netlify/functions`
   - Succeed with a green “Published” status.

---

## 6. Verify the Site

1. Open the site URL (e.g. `https://your-site-name.netlify.app`).
2. Check:
   - Home page loads.
   - **By Competencies** and **By Major** work.
   - Job details and API (e.g. `/api/health`) work.
3. **API health:**  
   `https://your-site-name.netlify.app/api/health`  
   Should return JSON with `status: "ok"` and database/mappings info.

---

## 7. Troubleshooting

### “Deploy directory 'public' does not exist”

- **Cause:** The `public` folder is not in the Git repo (often because `public` is in `.gitignore`).
- **Fix:**
  1. Remove `public` from `.gitignore` (this project uses `public` as source, not build output).
  2. Commit and push `public/` (and the `.gitignore` change).
  3. Redeploy on Netlify.

### Build fails with “Build script returned non-zero exit code: 2”

- Check the **Deploy log** for the real error (e.g. `npm install` failure, missing file, or script error).
- Ensure `package.json` has a `build` script (e.g. `"build": "echo 'Build complete'"`).
- Run `npm run build` locally to confirm it exits with code 0.

### “Configuration error” or redirect/function errors

- Confirm `netlify.toml` is in the repo root and has:
  - `publish = "public"`
  - `[[redirects]]` with `from = "/*"` and `to = "/.netlify/functions/server"`
  - `[functions]` with `directory = "netlify/functions"`
- In **Site configuration** → **Build & deploy**, ensure Netlify is using the repo’s `netlify.toml` (or that the UI settings match it).

### Database / API errors in production

- Verify env vars in Netlify (Site configuration → Environment variables).
- Ensure `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) are set for the correct scope (Production / Deploy previews).
- Redeploy after changing env vars.

### 404 or “Page not found” on all routes

- Netlify rewrites to `/.netlify/functions/server[/path]`. The app strips that prefix in `server.js` (when `NETLIFY` is set) so Express sees `/`, `/competencies`, etc.
- Use `to = "/.netlify/functions/server/:splat"` in `netlify.toml` so the path is passed. Ensure build env has `NETLIFY=true`.

---

## 8. Optional: Custom Domain and HTTPS

1. **Domain management** → **Add custom domain** or **Add domain alias**.
2. Follow Netlify’s DNS instructions (or use Netlify DNS).
3. HTTPS is automatic once the domain is verified.

---

## 9. Summary Checklist

- [ ] Repo has `public/` committed (and `public` not in `.gitignore`)
- [ ] `netlify.toml` in repo root with correct `publish` and `redirects`
- [ ] Netlify site connected to the correct repo and branch
- [ ] Env vars set: `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Deploy succeeds and site + `/api/health` work

For app setup, database schema, and Supabase, see [DOCUMENTATION.md](./DOCUMENTATION.md).
