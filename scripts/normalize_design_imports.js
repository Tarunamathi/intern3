const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'app', 'designs');
const outFile = path.join(__dirname, 'design-packages.txt');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs|json|css|html)$/.test(e.name)) normalizeFile(full);
  }
}

const pkgSet = new Set();

function normalizeFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const original = src;

  // Replace module specifiers that include a version suffix, e.g. "lucide-react@0.487.0" -> "lucide-react"
  // Handles scoped packages like @radix-ui/react-dialog@1.1.6 as well.
  src = src.replace(/(["'`])([^"'`\n]+?@[0-9][^"'`\n]*?)\1/g, (m, quote, spec) => {
    const atIndex = spec.lastIndexOf('@');
    if (atIndex <= 0) return m; // shouldn't happen
    const base = spec.slice(0, atIndex);
    pkgSet.add(base);
    return quote + base + quote;
  });

  if (src !== original) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log('Patched', filePath);
  }
}

if (!fs.existsSync(root)) {
  console.error('Designs folder not found at', root);
  process.exit(1);
}

walk(root);
const pkgs = Array.from(pkgSet).sort();
fs.writeFileSync(outFile, pkgs.join(' '), 'utf8');
console.log('\nPackages to install:', pkgs.join(' '));
console.log('\nWrote package list to', outFile);
