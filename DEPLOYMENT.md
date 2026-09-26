# Amarnath Securities Limited — Production Deployment Guide

## Overview
This package contains the production build artifacts for the modern institutional web portal of **Amarnath Securities Limited** (BSE Listed: 538465, CIN: L67120GJ1994PLC023254).

## Package Contents (`amarnath-securities-production.zip`)
- `index.html` — Production HTML entry point with pre-rendered SEO, OpenGraph metadata, JSON-LD Schema.org structured data, and font preconnects.
- `assets/index-*.js` — Optimized and minified React + TypeScript production bundle.
- `assets/index-*.css` — Minified Tailwind CSS styles with institutional surfaces, responsive design, and `@media (prefers-reduced-motion)` compliance.

---

## Deployment Instructions

### 1. Static Web Hosting (Nginx / Apache)
1. Extract the contents of `amarnath-securities-production.zip` to your web root (e.g., `/var/www/amarnath-securities/`).
2. Ensure Nginx routes all requests to `index.html` for single-page client routing:
```nginx
server {
    listen 80;
    server_name amarnathsecurities.com www.amarnathsecurities.com;
    root /var/www/amarnath-securities;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Vercel / Netlify
- **Vercel**: Deploy the folder directly using `vercel deploy --prod` or link the repository with framework preset set to **Vite**.
- **Netlify**: Drag and drop the unzipped folder into the Netlify dashboard, or configure `/* /index.html 200` in a `_redirects` file.

### 3. AWS S3 + Amazon CloudFront
1. Create an S3 bucket configured for static website hosting.
2. Upload the uncompressed files from `amarnath-securities-production.zip` to the S3 bucket.
3. Attach an Amazon CloudFront distribution pointing to the S3 origin.
4. Configure Custom Error Response: HTTP Error Code `403` and `404` -> Response Page Path `/index.html` with HTTP Response Code `200`.

### 4. Cloudflare Pages
1. In Cloudflare Pages dashboard, select **Direct Upload**.
2. Upload `amarnath-securities-production.zip` or the extracted folder.
3. Deploy instantly across 300+ global edge locations.

---

## Compliance & Governance Verification
- **BSE Scrip Code**: 538465
- **ISIN**: INE745P01010
- **CIN**: L67120GJ1994PLC023254
- **SEBI LODR**: 100% compliant Regulation 46 disclosures and grievance handling integration.
