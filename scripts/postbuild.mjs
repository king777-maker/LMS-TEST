import fs from 'fs';

if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
  console.log('Copied dist/index.html -> dist/404.html (SPA fallback for GitHub Pages).');
}

if (fs.existsSync('CNAME')) {
  fs.copyFileSync('CNAME', 'dist/CNAME');
  console.log('Copied CNAME -> dist/CNAME.');
}
