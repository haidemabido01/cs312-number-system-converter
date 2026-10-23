const BITSEEN_ICON_DEFS = {

    converter: `<path d="M4 8.5h13M14 5l3 3.5-3 3.5M20 15.5H7M10 12l-3 3.5 3 3.5"/>`,
    chip: `<rect x="6" y="6" width="12" height="12" rx="2.5"/>
            <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>`,
    clipboard: `<path d="M15.5 4.5H17a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h1.5"/>
                <rect x="8.5" y="2.5" width="7" height="4" rx="1.5"/>
                <path d="M9 11h6M9 15.5h4"/>`,
    type: `<path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M8 12h8M8 16h5M17 13.5V20M15 16.75 17 19l2-2.25"/>`,

    moon: `<path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a6.8 6.8 0 0 0 10.8 10.8Z"/>`,
    sun: `<circle cx="12" cy="12" r="4.2"/>
           <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>`,

    bulb: `<path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.4 1 1.1 1 1.9v.3h5.6v-.3c0-.8.4-1.5 1-1.9A6.5 6.5 0 0 0 12 2.5Z"/>
            <path d="M9.6 19h4.8M10.4 21.2h3.2"/>`,
    steps: `<path d="M3 20.5h4.5v-4.5H12v-4.5h4.5V7H21"/>`,
    grid: `<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/>
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>`,
    cap: `<path d="M2.8 8.8 12 4.2l9.2 4.6L12 13.4 2.8 8.8Z"/>
           <path d="M6.5 10.8v5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-5M21.2 8.8v5.4"/>`,
    bolt: `<path d="M13.2 2.5 4.8 13.2h6L10.4 21.5 19 10.8h-6.2l.4-8.3Z"/>`,
    key: `<circle cx="8" cy="12" r="4.5"/><path d="M12.5 12H21M18 12v3.5M15 12v2.5"/>`,
    minus: `<path d="M5 12h14"/>`,
    tag: `<path d="M12.6 3.5H19a1.5 1.5 0 0 1 1.5 1.5v6.4a2 2 0 0 1-.6 1.4l-6.6 6.6a2 2 0 0 1-2.8 0l-5-5a2 2 0 0 1 0-2.8l6.6-6.6a2 2 0 0 1 1.5-.6Z"/>
            <circle cx="16.2" cy="7.8" r="1.4"/>`,
    target: `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>
              <circle fill="currentColor" stroke="none" cx="12" cy="12" r="1"/>`,
    book: `<path d="M4 4.5A2 2 0 0 1 6 2.5h13v16H6a2 2 0 0 0-2 2v-16ZM4 18.5a2 2 0 0 1 2-2h13v5H6a2 2 0 0 1-2-2Z"/>`,
    rocket: `<path d="M12 2.5c3 2.4 4.8 5.9 4.8 9.6l-2.3 3.2H9.5l-2.3-3.2c0-3.7 1.8-7.2 4.8-9.6Z"/>
              <circle cx="12" cy="10" r="1.8"/>
              <path d="M9.5 15.3 7 18.8l2.6.7M14.5 15.3l2.5 3.5-2.6.7"/>`,

    arrowRight: `<path d="M4.5 12h15M13.5 6l6 6-6 6"/>`,
    arrowLeft: `<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>`,
    arrowUp: `<path d="M12 19.5v-15M6 10.5l6-6 6 6"/>`,
    arrowDown: `<path d="M12 4.5v15M6 13.5l6 6 6-6"/>`,
    chevronLeft: `<path d="M14.5 5.5 8 12l6.5 6.5"/>`,
    chevronRight: `<path d="M9.5 5.5 16 12l-6.5 6.5"/>`,
    dice: `<rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
            <circle fill="currentColor" stroke="none" cx="8.5" cy="8.5" r="1.1"/>
            <circle fill="currentColor" stroke="none" cx="15.5" cy="8.5" r="1.1"/>
            <circle fill="currentColor" stroke="none" cx="12" cy="12" r="1.1"/>
            <circle fill="currentColor" stroke="none" cx="8.5" cy="15.5" r="1.1"/>
            <circle fill="currentColor" stroke="none" cx="15.5" cy="15.5" r="1.1"/>`,
    search: `<circle cx="11" cy="11" r="6.5"/><path d="M15.8 15.8 20.5 20.5"/>`,
    refresh: `<path d="M20 12a8 8 0 1 1-2.4-5.7M20.5 3.5V9H15"/>`,
    toggle: `<path d="M4 8h10M18 8h2M4 16h4M12 16h8"/>
              <circle cx="16" cy="8" r="2"/><circle cx="10" cy="16" r="2"/>`,
    eraser: `<path d="M3.5 20.5h17"/>
              <path d="M8.6 17.4 4.2 13a2 2 0 0 1 0-2.8l6.6-6.6a2 2 0 0 1 2.8 0l5.4 5.4a2 2 0 0 1 0 2.8l-6.4 6.4a2 2 0 0 1-1.4.6H8.6Z"/>
              <path d="M9 9.5l6.5 6.5"/>`,
    plug: `<path d="M9 3v6M15 3v6M6.5 9h11v3.5a5.5 5.5 0 0 1-11 0V9ZM12 18v3"/>`,
    play: `<path d="M8 4.8 19 12 8 19.2Z"/>`,
    pause: `<path d="M9 4.5v15M15 4.5v15"/>`,

    check: `<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>`,
    cross: `<path d="M6 6l12 12M18 6 6 18"/>`,
    alert: `<path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0Z"/>
             <path d="M12 9v4.5M12 16.6h.01"/>`,
    info: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>`,
    chat: `<path d="M20.5 11.7c0 4-3.8 7.2-8.5 7.2-1 0-2-.2-2.9-.4L4 20.5l1.4-3.6A6.9 6.9 0 0 1 3.5 11.7c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z"/>`,

    heart: `<path fill="currentColor" stroke="none" d="M12 20.5s-7.6-4.6-7.6-9.4A4.4 4.4 0 0 1 12 8.2a4.4 4.4 0 0 1 7.6 2.9c0 4.8-7.6 9.4-7.6 9.4Z"/>`,
    glint: `<path fill="currentColor" stroke="none" d="M12 2.5c.5 3.6 1.4 4.5 5 5-3.6.5-4.5 1.4-5 5-.5-3.6-1.4-4.5-5-5 3.6-.5 4.5-1.4 5-5Z"/>`,
    star: `<path fill="currentColor" stroke="none" d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.4 9.4l6-.8L12 3Z"/>`,
    close: `<path d="M6 6l12 12M18 6 6 18"/>`
};

const BITSEEN_ICON_STROKE = 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';

function buildIconSprite() {
    const symbols = Object.keys(BITSEEN_ICON_DEFS).map(name => {
        return `<symbol id="bs-${name}" viewBox="0 0 24 24" ${BITSEEN_ICON_STROKE}>${BITSEEN_ICON_DEFS[name]}</symbol>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" class="bs-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${symbols}</svg>`;
}

function icon(name, extraClass = '') {
    const key = String(name).replace(/[-_\s]/g, '').toLowerCase();
    const resolved = Object.keys(BITSEEN_ICON_DEFS).find(k => k.toLowerCase() === key);
    if (!resolved) return '';
    const cls = extraClass ? `icon ${extraClass}` : 'icon';
    return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#bs-${resolved}"></use></svg>`;
}

function setIcon(element, name) {
    if (!element) return;
    element.innerHTML = icon(name);
}

function mountIconSprite() {
    if (!document.body || document.getElementById('bs-icon-sprite')) return;
    const host = document.createElement('div');
    host.id = 'bs-icon-sprite';
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    host.innerHTML = buildIconSprite();
    document.body.insertBefore(host, document.body.firstChild);
}

document.addEventListener('DOMContentLoaded', mountIconSprite);
if (document.readyState !== 'loading') mountIconSprite();
