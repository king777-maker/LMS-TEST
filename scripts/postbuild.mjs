import fs from 'fs';

// 1. SPA fallback for static hosts (GitHub Pages, Netlify, Apache)
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
  console.log('[postbuild] Copied dist/index.html -> dist/404.html (SPA deep route fallback).');
}

// 2. Custom Domain (CNAME) for testing domain if configured
const customDomain = process.env.VITE_CUSTOM_DOMAIN || process.env.CUSTOM_DOMAIN;
if (customDomain) {
  fs.writeFileSync('dist/CNAME', customDomain.trim());
  console.log(`[postbuild] Wrote custom testing domain to dist/CNAME: ${customDomain}`);
} else if (fs.existsSync('CNAME')) {
  const content = fs.readFileSync('CNAME', 'utf8').trim();
  if (content && !content.includes('broadbeachonline.com')) {
    fs.copyFileSync('CNAME', 'dist/CNAME');
    console.log(`[postbuild] Copied CNAME -> dist/CNAME: ${content}`);
  }
}
