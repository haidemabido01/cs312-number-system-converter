const SWITCHY_VISIBLE_MS = 8000;
const SWITCHY_REST_MS = 5000;
const SWITCHY_INTERVAL_MS = SWITCHY_VISIBLE_MS + SWITCHY_REST_MS;
const SWITCHY_GREETING_DELAY_MS = 900;
const SWITCHY_RECENT_LIMIT = 3;

const SWITCHY_HEADINGS = {
    'TRIVIA': 'Switchy Trivia:',
    'STUDY TIP': 'Switchy Tips:',
    'CHEER': 'Switchy Cheer:'
};
const SWITCHY_DEFAULT_HEADING = 'Switchy Trivia:';

const switchyItems = Array.isArray(window.switchyData) ? window.switchyData : [];

let switchyRefs = null;
let switchyInterval = null;
let switchyHideTimeout = null;
let switchyGreetingTimeout = null;
let switchyRecentIndices = [];

function buildSwitchyWidget() {
    const container = document.createElement('div');
    container.id = 'switchy-container';
    container.className = 'switchy-container';

    container.innerHTML = `
        <div id="switchy-bubble" class="switchy-bubble" role="status" aria-live="polite" aria-hidden="true">
            <p id="switchy-bubble-heading" class="switchy-bubble-heading"></p>
            <p id="switchy-bubble-text" class="switchy-bubble-text"></p>
        </div>
    `;

    document.body.appendChild(container);
    return container;
}

function displaySwitchyMessage(text, category) {
    if (!switchyRefs || !text) return false;

    const { bubble, bubbleHeading, bubbleText } = switchyRefs;

    bubbleHeading.textContent = SWITCHY_HEADINGS[category] || SWITCHY_DEFAULT_HEADING;
    bubbleText.textContent = text;
    bubble.classList.add('switchy-bubble-visible');
    bubble.setAttribute('aria-hidden', 'false');

    clearTimeout(switchyHideTimeout);
    switchyHideTimeout = setTimeout(hideSwitchyBubble, SWITCHY_VISIBLE_MS);

    return true;
}

function hideSwitchyBubble() {
    clearTimeout(switchyHideTimeout);
    switchyHideTimeout = null;

    if (!switchyRefs) return;
    switchyRefs.bubble.classList.remove('switchy-bubble-visible');
    switchyRefs.bubble.setAttribute('aria-hidden', 'true');
}

function pickRandomSwitchyEntry() {
    if (!switchyItems.length) return null;
    if (switchyItems.length === 1) return switchyItems[0];

    const pool = [];
    for (let i = 0; i < switchyItems.length; i++) {
        if (switchyRecentIndices.indexOf(i) === -1) pool.push(i);
    }

    if (!pool.length) {
        switchyRecentIndices = [];
        for (let i = 0; i < switchyItems.length; i++) pool.push(i);
    }

    const index = pool[Math.floor(Math.random() * pool.length)];

    switchyRecentIndices.push(index);
    const historyLimit = Math.max(1, Math.min(SWITCHY_RECENT_LIMIT, switchyItems.length - 1));
    while (switchyRecentIndices.length > historyLimit) {
        switchyRecentIndices.shift();
    }

    return switchyItems[index];
}

function showRandomTrivia() {
    if (!switchyRefs) initSwitchy();

    const entry = pickRandomSwitchyEntry();
    if (!entry) return false;

    return displaySwitchyMessage(entry.text, entry.category);
}

function startSwitchyTimer() {
    clearInterval(switchyInterval);
    switchyInterval = setInterval(() => {
        if (document.hidden) return;
        showRandomTrivia();
    }, SWITCHY_INTERVAL_MS);
}

function initSwitchy() {
    if (switchyRefs) return;

    const container = document.getElementById('switchy-container') || buildSwitchyWidget();

    switchyRefs = {
        container,
        bubble: container.querySelector('#switchy-bubble'),
        bubbleHeading: container.querySelector('#switchy-bubble-heading'),
        bubbleText: container.querySelector('#switchy-bubble-text')
    };

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(switchyInterval);
            switchyInterval = null;
        } else if (switchyRefs) {
            startSwitchyTimer();
        }
    });

    switchyGreetingTimeout = setTimeout(() => {
        switchyGreetingTimeout = null;
        showRandomTrivia();
        startSwitchyTimer();
    }, SWITCHY_GREETING_DELAY_MS);
}

function showSwitchyTrivia(fact) {
    if (!fact) return false;
    if (!switchyRefs) initSwitchy();
    return displaySwitchyMessage(fact, 'TRIVIA');
}

function showSwitchyCheer(text) {
    if (!switchyRefs) initSwitchy();
    return displaySwitchyMessage(text, 'CHEER');
}

document.addEventListener('DOMContentLoaded', initSwitchy);
