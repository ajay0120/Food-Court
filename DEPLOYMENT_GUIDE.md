# Deployment Guide

## Quick Fix for Vite Build Error

### Option 1: Local Testing
```bash
cd client
npm install
npx vite build
```

### Option 2: Platform-Specific Deployment

## 🌐 Netlify Deployment

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**:
   - Base directory: `client`
   - Build command: `npm ci && npx vite build`
   - Publish directory: `client/dist`
3. **Environment Variables**: Add in Netlify dashboard:
   ```
   VITE_GOOGLE_CLIENT_ID=370788151092-hcbimnj2ug6raft71e7vn8lem6sn3put.apps.googleusercontent.com
   ```

## ⚡ Vercel Deployment

1. **Import Project**: Connect GitHub repo
2. **Root Directory**: Leave as root (has vercel.json)
3. **Framework**: Vite
4. **Environment Variables**: Add in Vercel dashboard:
   ```
   VITE_GOOGLE_CLIENT_ID=370788151092-hcbimnj2ug6raft71e7vn8lem6sn3put.apps.googleusercontent.com
   ```

## 🐳 Docker Deployment

```dockerfile
# Dockerfile for client
FROM node:18-alpine

WORKDIR /app
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ .
RUN npx vite build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Manual Build Commands

```bash
# 1. Install dependencies (including dev dependencies)
npm ci

# 2. Build using npx (works even if vite is in devDependencies)
npx vite build

# 3. Serve the dist folder
npm run preview
```

## 🚨 Common Issues & Solutions

### "vite: command not found"
- **Cause**: Vite not in PATH or not installed
- **Fix**: Use `npx vite build` instead of `vite build`

### "Module not found" during build
- **Cause**: Missing dependencies
- **Fix**: Run `npm ci` before building

### Environment variables not working
- **Cause**: Missing VITE_ prefix or not in production env
- **Fix**: Ensure vars start with `VITE_` and are set in deployment platform

## 📦 Pre-deployment Checklist

- [ ] All dependencies in package.json
- [ ] Environment variables set with VITE_ prefix
- [ ] Build command uses npx vite build
- [ ] Google OAuth origins updated for production domain
- [ ] Backend deployed and accessible
- [ ] CORS configured for production domain

## 🔗 Update Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services > Credentials
3. Edit OAuth 2.0 Client ID
4. Add your production domains to:
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com`
