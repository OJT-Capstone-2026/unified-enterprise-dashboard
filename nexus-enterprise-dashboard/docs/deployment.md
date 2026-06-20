# Deployment Guide

## Static Hosting

Deploy the `nexus-enterprise-dashboard/` folder to any static host:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop or connect repo
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload with static website hosting

## Pre-Deployment Checklist

- [ ] Minify CSS and JavaScript (optional, for production)
- [ ] Enable Gzip/Brotli compression on server
- [ ] Configure HTTPS / SSL certificate
- [ ] Set custom domain
- [ ] Verify service worker registers over HTTPS
- [ ] Test PWA install prompt
- [ ] Run Lighthouse audit (target > 95 all categories)

## Server Configuration

### SPA Fallback

Configure your server to serve `index.html` for all routes:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## Environment

No environment variables required. The app runs entirely client-side.

## Monitoring

- Add Google Analytics by including gtag script in `index.html`
- Performance metrics available via `PerformanceManager.getMetrics()`
