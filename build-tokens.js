const fs = require('fs');
const path = require('path');

// =============================================================================
// Hex ↔ OKLCH color conversion
// =============================================================================
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  let a = 1;
  if (hex.length === 8) {
    a = parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  }
  const n = parseInt(hex, 16);
  return isNaN(n) ? null : { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a };
}

function rgbToLinear(v) { return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }

function rgbToOklab(r, g, b) {
  const lr = rgbToLinear(r), lg = rgbToLinear(g), lb = rgbToLinear(b);
  const l = Math.cbrt(0.4122214708*lr + 0.5363325363*lg + 0.0514459929*lb);
  const m = Math.cbrt(0.2119034982*lr + 0.6806995451*lg + 0.1073969566*lb);
  const s = Math.cbrt(0.0883024619*lr + 0.2817188376*lg + 0.6299787005*lb);
  return {
    L: 0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
    a: 1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
    b: 0.0259040371*l + 0.7827717662*m - 0.8086757660*s,
  };
}

function hexToOklch(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const lab = rgbToOklab(rgb.r, rgb.g, rgb.b);
  const C = Math.sqrt(lab.a*lab.a + lab.b*lab.b);
  let H = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
  if (H < 0) H += 360;
  return { l: +(lab.L.toFixed(4)), c: +(C.toFixed(4)), h: +(H.toFixed(2)) };
}

function formatOklch(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const o = hexToOklch(hex);
  if (!o) return hex;
  if (rgb.a < 1) return `oklch(${o.l} ${o.c} ${o.h} / ${+(rgb.a.toFixed(4))})`;
  return `oklch(${o.l} ${o.c} ${o.h})`;
}

// sRGB mix: ratio=1 → 100% mixColor, ratio=0 → 100% baseColor
function mixColors(baseHex, mixHex, ratio) {
  const a = hexToRgb(baseHex), b = hexToRgb(mixHex);
  if (!a || !b) return baseHex;
  const r = Math.round((a.r*(1-ratio) + b.r*ratio)*255);
  const g = Math.round((a.g*(1-ratio) + b.g*ratio)*255);
  const bl = Math.round((a.b*(1-ratio) + b.b*ratio)*255);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`;
}

// =============================================================================
// Token resolution
// =============================================================================
// First pass: collect every raw hex color keyed by its token path (e.g. "md.key.primary")
function collectHexColors(obj, prefix) {
  const out = {};
  for (const k in obj) {
    if (k.startsWith('$')) continue;
    const v = obj[k];
    if (!v || typeof v !== 'object') continue;
    const val = v.$value ?? v.value;
    const p = prefix ? `${prefix}.${k}` : k;
    if (val !== undefined && typeof val === 'string' && val.startsWith('#')) {
      out[p] = val;
    } else if (val === undefined) {
      Object.assign(out, collectHexColors(v, p));
    }
  }
  return out;
}

// Resolve a "{md.key.primary}" reference to a hex value using the color map
function resolveRef(ref, colors) {
  const key = ref.replace(/[{}]/g, '');
  return colors[key] || null;
}

// Convert a boxShadow token value to a CSS box-shadow string
function processBoxShadow(val, colors) {
  const x = val.x || '0';
  const y = val.y || '0';
  const blur = val.blur || '0';
  const spread = val.spread || '0';
  let color = val.color || 'rgba(0,0,0,0.2)';
  // Resolve token references in shadow color
  if (typeof color === 'string' && /^\{.*\}$/.test(color)) {
    color = `var(--${color.replace(/[{}]/g, '').replace(/\./g, '-')})`;
  } else if (typeof color === 'string' && color.startsWith('#')) {
    color = formatOklch(color);
  }
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

// Flatten a typography composite token into individual CSS properties
function processTypography(val, prefix, colors, out) {
  const props = { fontFamily: 'fontFamily', fontWeight: 'fontWeight', fontSize: 'fontSize', lineHeight: 'lineHeight', letterSpacing: 'letterSpacing' };
  for (const [jsonKey, cssKey] of Object.entries(props)) {
    const v = val[jsonKey];
    if (v === undefined) continue;
    const tokenKey = `${prefix}-${cssKey}`;
    if (typeof v === 'string' && /^\{.*\}$/.test(v)) {
      out[tokenKey] = `var(--${v.replace(/[{}]/g, '').replace(/\./g, '-')})`;
    } else if (typeof v === 'string' && /^\d+$/.test(v)) {
      out[tokenKey] = (cssKey === 'fontSize') ? `${v}px` : v;
    } else {
      out[tokenKey] = v;
    }
  }
}

// Process a single token value into a CSS string
function processValue(val, type, ext, colors) {
  // Handle boxShadow composite tokens
  if (type === 'boxShadow' && typeof val === 'object' && val !== null) {
    return processBoxShadow(val, colors);
  }
  if (typeof val === 'object' && val !== null) return null; // skip other composite tokens

  // Color with Tokens Studio modify extension
  if (type === 'color' && ext?.['studio.tokens']?.modify) {
    const mod = ext['studio.tokens'].modify;
    if (mod.type === 'mix' && typeof val === 'string' && /^\{.*\}$/.test(val)) {
      const base = resolveRef(val, colors);
      if (base) return formatOklch(mixColors(base, mod.color, parseFloat(mod.value)));
    }
    if (mod.type === 'alpha' && typeof val === 'string' && /^\{.*\}$/.test(val)) {
      const base = resolveRef(val, colors);
      if (base) {
        const a = parseFloat(mod.value);
        if (a === 0) return 'transparent';
        const o = hexToOklch(base);
        if (o) return `oklch(${o.l} ${o.c} ${o.h} / ${a})`;
      }
    }
  }

  // rgba(...) color values
  if (type === 'color' && typeof val === 'string' && val.startsWith('rgba')) {
    const m = val.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (m) {
      const rr = parseInt(m[1])/255, gg = parseInt(m[2])/255, bb = parseInt(m[3])/255, aa = parseFloat(m[4]);
      if (aa === 0) return 'transparent';
      const lab = rgbToOklab(rr, gg, bb);
      const C = Math.sqrt(lab.a*lab.a + lab.b*lab.b);
      let H = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
      if (H < 0) H += 360;
      return `oklch(${+(lab.L.toFixed(4))} ${+(C.toFixed(4))} ${+(H.toFixed(2))} / ${aa})`;
    }
  }

  if (typeof val === 'string' && val.startsWith('#')) {
    if (type === 'color') return formatOklch(val);
    return val; // hex that isn't typed as color — pass through
  }

  // Token reference → CSS var()
  if (typeof val === 'string' && /^\{.*\}$/.test(val)) {
    return `var(--${val.replace(/[{}]/g, '').replace(/\./g, '-')})`;
  }

  // Dimension-like values
  if ((type === 'spacing' || type === 'borderWidth' || type === 'borderRadius') && typeof val === 'string' && /^\d+$/.test(val)) {
    return `${val}px`;
  }
  if (type === 'fontSizes' && typeof val === 'string' && /^\d+$/.test(val)) {
    return `${val}px`;
  }

  return val;
}

// Recursively flatten a token tree into { 'md-key-primary': 'oklch(...)' }
function flatten(obj, colors, prefix, parentType) {
  const out = {};
  for (const k in obj) {
    if (k.startsWith('$')) continue;
    const v = obj[k];
    if (!v || typeof v !== 'object') continue;

    const p = prefix ? `${prefix}-${k}` : k;
    const val = v.$value ?? v.value;
    const type = v.$type || v.type || parentType;
    const ext = v.$extensions || null;

    if (val !== undefined) {
      // Handle typography composite tokens by flattening into individual props
      if (type === 'typography' && typeof val === 'object' && val !== null) {
        processTypography(val, p, colors, out);
      } else {
        const css = processValue(val, type, ext, colors);
        if (css !== null) out[p] = css;
      }
    } else {
      Object.assign(out, flatten(v, colors, p, parentType));
    }
  }
  return out;
}

// =============================================================================
// Build
// =============================================================================
function build() {
  const tokensDir = path.join(__dirname, 'tokens');

  // Read $metadata for token set order
  const meta = JSON.parse(fs.readFileSync(path.join(tokensDir, '$metadata.json'), 'utf8'));
  console.log('Token set order:', meta.tokenSetOrder);

  // Read source files per $metadata order
  const utilities = JSON.parse(fs.readFileSync(path.join(tokensDir, 'utilities.json'), 'utf8'));
  const material  = JSON.parse(fs.readFileSync(path.join(tokensDir, 'material', 'assemble.json'), 'utf8'));
  const modeLight = JSON.parse(fs.readFileSync(path.join(tokensDir, 'modes', 'assemble', 'light.json'), 'utf8'));
  const modeDark  = JSON.parse(fs.readFileSync(path.join(tokensDir, 'modes', 'assemble', 'dark.json'), 'utf8'));

  // Build master hex color map for reference resolution (utilities + material merged)
  const colors = { ...collectHexColors(utilities, ''), ...collectHexColors(material, '') };

  // Flatten each set
  const utilTokens    = flatten(utilities, colors, '', null);
  const matTokens     = flatten(material,  colors, '', null);
  const lightTokens   = flatten(modeLight, { ...colors, ...collectHexColors(modeLight, '') }, '', null);
  const darkTokens    = flatten(modeDark,  { ...colors, ...collectHexColors(modeDark, '') },  '', null);

  // Merge base tokens: utilities first, then material (material overrides)
  const baseTokens = { ...utilTokens, ...matTokens };

  // Output directory
  const outDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Build CSS
  const lines = [];
  lines.push('/**');
  lines.push(' * Assemble Design Tokens');
  lines.push(' * Auto-generated from tokens/utilities.json, tokens/material/assemble.json,');
  lines.push(' * tokens/modes/assemble/light.json, tokens/modes/assemble/dark.json');
  lines.push(' * Source: $metadata.json tokenSetOrder');
  lines.push(' * DO NOT EDIT');
  lines.push(' */');
  lines.push('');

  // --- @font-face ---
  lines.push('/* McAfee Sans font family */');
  lines.push('@font-face { font-family: "McAfee Sans"; src: url("fonts/McAfeeSans-Light.woff2") format("woff2"); font-weight: 300; font-style: normal; font-display: swap; }');
  lines.push('@font-face { font-family: "McAfee Sans"; src: url("fonts/McAfeeSans-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }');
  lines.push('@font-face { font-family: "McAfee Sans"; src: url("fonts/McAfeeSans-Bold.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }');
  lines.push('@font-face { font-family: "McAfee Sans Mono"; src: url("fonts/McAfeeSansMono-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }');
  lines.push('@font-face { font-family: "McAfee Sans Mono"; src: url("fonts/McAfeeSansMono-Bold.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }');
  lines.push('');

  // --- :root base tokens ---
  lines.push('/* Base tokens (utilities + material/assemble) */');
  lines.push(':root {');
  for (const k of Object.keys(baseTokens).sort()) {
    lines.push(`  --${k}: ${baseTokens[k]};`);
  }
  lines.push('}');
  lines.push('');

  // --- Light theme ---
  lines.push('/* Light theme (modes/assemble/light) */');
  lines.push(':root, [data-theme="light"] {');
  for (const k of Object.keys(lightTokens).sort()) {
    lines.push(`  --${k}: ${lightTokens[k]};`);
  }
  lines.push('}');
  lines.push('');

  // --- Dark theme ---
  lines.push('/* Dark theme (modes/assemble/dark) */');
  lines.push('[data-theme="dark"] {');
  for (const k of Object.keys(darkTokens).sort()) {
    lines.push(`  --${k}: ${darkTokens[k]};`);
  }
  lines.push('}');
  lines.push('');

  const css = lines.join('\n');
  const outFile = path.join(outDir, 'tokens.css');
  fs.writeFileSync(outFile, css);

  // Copy to packages and docs
  const copies = [
    path.join(__dirname, 'packages', 'src', 'styles', 'tokens.css'),
    path.join(__dirname, 'docs', 'public', 'tokens.css'),
  ];
  for (const dest of copies) {
    const destDir = path.dirname(dest);
    if (fs.existsSync(destDir)) {
      fs.writeFileSync(dest, css);
      console.log(`   Copied → ${path.relative(__dirname, dest)}`);
    }
  }

  // Stats
  const baseCount = Object.keys(baseTokens).length;
  const lightCount = Object.keys(lightTokens).length;
  const darkCount = Object.keys(darkTokens).length;
  console.log(`\n✅ tokens.css generated → ${outFile}`);
  console.log(`   Base tokens : ${baseCount}`);
  console.log(`   Light tokens: ${lightCount}`);
  console.log(`   Dark tokens : ${darkCount}`);
  console.log(`   Total       : ${baseCount + lightCount + darkCount}`);
}

try { build(); } catch (e) { console.error('❌', e); process.exit(1); }
