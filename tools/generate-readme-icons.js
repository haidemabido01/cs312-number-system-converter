/**
 * Bitzy README Icon Generator
 * ----------------------------
 * Renders standalone SVG files for the README from the *same* source of truth
 * as the app: the inline SVG sprite in `js/icons.js`.
 *
 * Why standalone files instead of inline <svg> in the Markdown?
 *   - GitHub's Markdown sanitizer strips per-element `fill`/`stroke`
 *     attributes, which breaks mixed fill+stroke icons.
 *   - An <img> pointing at a real .svg file is rendered verbatim, so the
 *     artwork can never be mangled.
 *
 * Each generated file carries its own theme awareness:
 *   - presentation attributes  -> light mode colour (Twilight Beach palette)
 *   - embedded <style> block  -> dark mode override via prefers-color-scheme
 *   If a browser ignores the <style> block, the light colour is still used.
 *
 * Usage:  node tools/generate-readme-icons.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'assets', 'icons');

/* ------------------------------------------------------------------ *
 * Palette (must match the :root custom properties in css/style.css)
 * ------------------------------------------------------------------ */
const LIGHT = {
    stroke: '#573F5A', // Dusk Plum / Violet  -> secondary headers & decimal base
    solid: '#573F5A'
};
const DARK = {
    stroke: '#F4C7CB', // Soft Dawn Blush Pink -> light mode tint, mascot blush
    solid: '#F4C7CB'
};

/* Icons referenced by README.md */
const ICON_NAMES = [
    'alert', 'arrowRight', 'bolt', 'book', 'bulb', 'cap', 'chat', 'check',
    'chip', 'clipboard', 'converter', 'flower', 'grid', 'heart',
    'key', 'moon', 'refresh', 'rocket', 'search', 'sparkle', 'star', 'steps',
    'tag', 'target', 'toggle', 'type'
];

/* Colour swatches for the palette table */
const SWATCHES = [
    { slug: 'night-charcoal', hex: '#18181B' },
    { slug: 'deep-oceanic-teal', hex: '#0E5B6A' },
    { slug: 'dusk-plum-violet', hex: '#573F5A' },
    { slug: 'muted-mauve-slate', hex: '#81697E' },
    { slug: 'twilight-sunset-rose', hex: '#B7687C' },
    { slug: 'soft-dawn-blush-pink', hex: '#F4C7CB' }
];

/* ------------------------------------------------------------------ *
 * Parse BITZY_ICON_DEFS out of js/icons.js without evaluating it
 * ------------------------------------------------------------------ */
function readIconDefs() {
    const source = fs.readFileSync(path.join(ROOT, 'js', 'icons.js'), 'utf8');
    const defs = {};
    const re = /^\s{4}([A-Za-z][A-Za-z0-9]*):\s*`([\s\S]*?)`\s*,?\s*$/gm;
    let match;
    while ((match = re.exec(source)) !== null) {
        defs[match[1]] = match[2].replace(/\s+/g, ' ').trim();
    }
    return defs;
}

/* ------------------------------------------------------------------ *
 * Build a standalone SVG file
 * ------------------------------------------------------------------ */
function buildIconSvg(def) {
    const elements = def.match(/<(path|circle|rect|line|polyline|polygon)\b[^>]*\/>/g) || [];

    const solid = [];
    const stroked = [];

    for (const el of elements) {
        if (/fill="currentColor"/.test(el)) {
            solid.push(el.replace(/fill="currentColor"/, `fill="${LIGHT.solid}"`));
        } else {
            stroked.push(el);
        }
    }

    const style = [
        '<style>',
        `@media (prefers-color-scheme: dark){`,
        `.bz-stroke{stroke:${DARK.stroke}}`,
        `.bz-solid{fill:${DARK.solid}}`,
        `}`,
        '</style>'
    ].join('');

    const groups = [];
    if (stroked.length) {
        groups.push(`<g class="bz-stroke" fill="none" stroke="${LIGHT.stroke}">${stroked.join('')}</g>`);
    }
    if (solid.length) {
        groups.push(`<g class="bz-solid" fill="${LIGHT.solid}" stroke="none">${solid.join('')}</g>`);
    }

    return [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"',
        ' fill="none" stroke="' + LIGHT.stroke + '" stroke-width="1.9"',
        ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
        style,
        groups.join(''),
        '</svg>',
        ''
    ].join('');
}

function buildSwatchSvg(hex) {
    return [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">',
        `<rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4" fill="${hex}" stroke="#00000033" stroke-width="1.5"/>`,
        '</svg>',
        ''
    ].join('');
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */
function main() {
    const defs = readIconDefs();
    fs.mkdirSync(ICONS_DIR, { recursive: true });

    let written = 0;
    for (const name of ICON_NAMES) {
        if (!defs[name]) {
            console.error(`  ! missing icon definition: ${name}`);
            continue;
        }
        fs.writeFileSync(path.join(ICONS_DIR, `${name}.svg`), buildIconSvg(defs[name]), 'utf8');
        written++;
    }

    for (const swatch of SWATCHES) {
        fs.writeFileSync(path.join(ICONS_DIR, `swatch-${swatch.slug}.svg`), buildSwatchSvg(swatch.hex), 'utf8');
        written++;
    }

    console.log(`Generated ${written} SVG icons in assets/icons/`);
}

main();
