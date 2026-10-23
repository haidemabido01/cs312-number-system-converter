/**
 * Switchy — bottom-right trivia notifications
 * ---------------------------------------------
 * Switchy is the ONE voice of the app, but is not a mascot: each trivia fact,
 * study tip or cheer arrives as a small dark notification card in the
 * bottom-right corner of the page.
 *
 * The card appears on its own every 10 seconds, stays open for 8 seconds,
 * then tucks itself away. The X (or Escape) closes the current message.
 *
 * The words live in js/trivia.js, which publishes this array:
 *
 *     window.switchyData = [
 *         { category: 'TRIVIA', text: '...' },
 *         { category: 'STUDY TIP', text: '...' },
 *         { category: 'CHEER', text: '...' }
 *     ];
 *
 * This project loads classic <script> tags (so the pages keep working when
 * opened straight from disk, no module server needed). If you move the
 * project to ES modules, replace the line below with:
 *
 *     import { switchyData } from './trivia.js';
 */

const SWITCHY_INTERVAL_MS = 10000;     // how often a notification appears
const SWITCHY_VISIBLE_MS = 8000;       // how long the notification stays open
const SWITCHY_GREETING_DELAY_MS = 900; // first notification once the page settles
const SWITCHY_RECENT_LIMIT = 3;        // avoid repeating the last few lines

const SWITCHY_CATEGORY_LABELS = {
    'TRIVIA': 'Trivia',
    'STUDY TIP': 'Study tip',
    'CHEER': 'Cheer'
};

const switchyItems = Array.isArray(window.switchyData) ? window.switchyData : [];

let switchyRefs = null;
let switchyInterval = null;
let switchyHideTimeout = null;
let switchyGreetingTimeout = null;
let switchyRecentIndices = [];

/**
 * Builds the fixed notification container and attaches it to the page.
 * Safe to call more than once.
 */
function buildSwitchyWidget() {
    const container = document.createElement('div');
    container.id = 'switchy-container';
    container.className = 'switchy-container';

    container.innerHTML = `
        <div id="switchy-bubble" class="switchy-bubble" role="status" aria-live="polite" aria-hidden="true">
            <span id="switchy-bubble-category" class="switchy-bubble-category">Trivia</span>
            <button type="button" id="switchy-bubble-close" class="switchy-bubble-close" aria-label="Close Switchy's message">&times;</button>
            <p id="switchy-bubble-text" class="switchy-bubble-text"></p>
        </div>
    `;

    document.body.appendChild(container);
    return container;
}

/**
 * Shows a message in the notification and schedules it to hide after 8s.
 * @param {string} category - "TRIVIA" | "STUDY TIP" | "CHEER"
 * @param {string} text
 * @returns {boolean} true when the message was displayed
 */
function displaySwitchyMessage(category, text) {
    if (!switchyRefs || !text) return false;

    const { bubble, bubbleCategory, bubbleText } = switchyRefs;

    bubbleCategory.textContent = SWITCHY_CATEGORY_LABELS[category] || 'Switchy';
    bubbleText.textContent = text;
    bubble.setAttribute('data-category', category || 'TRIVIA');
    bubble.classList.add('switchy-bubble-visible');
    bubble.setAttribute('aria-hidden', 'false');

    clearTimeout(switchyHideTimeout);
    switchyHideTimeout = setTimeout(hideSwitchyBubble, SWITCHY_VISIBLE_MS);

    return true;
}

/**
 * Hides the current notification.
 */
function hideSwitchyBubble() {
    clearTimeout(switchyHideTimeout);
    switchyHideTimeout = null;

    if (!switchyRefs) return;
    switchyRefs.bubble.classList.remove('switchy-bubble-visible');
    switchyRefs.bubble.setAttribute('aria-hidden', 'true');
}

/**
 * Picks a random line while steering clear of the last few, so Switchy feels
 * fresh instead of looping the same fact twice in a row.
 * @returns {{ category: string, text: string } | null}
 */
function pickRandomSwitchyEntry() {
    if (!switchyItems.length) return null;
    if (switchyItems.length === 1) return switchyItems[0];

    // Build the pool of indices we have not shown recently.
    const pool = [];
    for (let i = 0; i < switchyItems.length; i++) {
        if (switchyRecentIndices.indexOf(i) === -1) pool.push(i);
    }

    // Safety net: if history covers the whole list, start fresh.
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

/**
 * Surfaces a random line from js/trivia.js. Used by the timer, the on-load
 * greeting and by the converter.
 * @returns {boolean} true when something was shown
 */
function showRandomTrivia() {
    if (!switchyRefs) initSwitchy();

    const entry = pickRandomSwitchyEntry();
    if (!entry) return false;

    return displaySwitchyMessage(entry.category, entry.text);
}

/**
 * Restarts the countdown so the next notification arrives 10 seconds from now.
 */
function startSwitchyTimer() {
    clearInterval(switchyInterval);
    switchyInterval = setInterval(() => {
        if (document.hidden) return;
        showRandomTrivia();
    }, SWITCHY_INTERVAL_MS);
}

/**
 * Wires up the notification: close button, visibility handling and the
 * automatic timer. The first card appears shortly after load, then the
 * 10 second rhythm begins.
 */
function initSwitchy() {
    if (switchyRefs) return;

    const container = document.getElementById('switchy-container') || buildSwitchyWidget();

    switchyRefs = {
        container,
        bubble: container.querySelector('#switchy-bubble'),
        bubbleCategory: container.querySelector('#switchy-bubble-category'),
        bubbleText: container.querySelector('#switchy-bubble-text'),
        bubbleClose: container.querySelector('#switchy-bubble-close')
    };

    // The X and Escape close the current notification.
    switchyRefs.bubbleClose.addEventListener('click', hideSwitchyBubble);
    container.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hideSwitchyBubble();
    });

    // Pause the cadence in a hidden tab, then pick it back up on return.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(switchyInterval);
            switchyInterval = null;
        } else if (switchyRefs) {
            startSwitchyTimer();
        }
    });

    // Show one card once the page settles, then begin the 10 second rhythm.
    switchyGreetingTimeout = setTimeout(() => {
        switchyGreetingTimeout = null;
        showRandomTrivia();
        startSwitchyTimer();
    }, SWITCHY_GREETING_DELAY_MS);
}

/**
 * Delivers a specific trivia fact through the notification. Kept for the
 * converter, which pairs a conversion with a matching fact.
 * @param {string} fact
 * @returns {boolean} true when Switchy delivered it
 */
function showSwitchyTrivia(fact) {
    if (!fact) return false;
    if (!switchyRefs) initSwitchy();
    return displaySwitchyMessage('TRIVIA', fact);
}

/**
 * Delivers a specific cheer through the notification.
 * @param {string} text
 * @returns {boolean} true when Switchy delivered it
 */
function showSwitchyCheer(text) {
    if (!switchyRefs) initSwitchy();
    return displaySwitchyMessage('CHEER', text);
}

document.addEventListener('DOMContentLoaded', initSwitchy);
