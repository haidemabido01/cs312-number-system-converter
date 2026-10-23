/**
 * Switchy — bottom-right trivia notifications
 * ---------------------------------------------
 * Switchy is the ONE voice of the app, but is not a mascot: each trivia fact,
 * study tip or cheer arrives as a small dark notification card in the
 * bottom-right corner of the page.
 *
 * The card appears on its own every 13 seconds, stays open for 8 seconds,
 * then rests for 5 seconds before the next one appears.
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

const SWITCHY_VISIBLE_MS = 8000;       // how long the notification stays open
const SWITCHY_REST_MS = 5000;          // quiet gap with no notification on screen
const SWITCHY_INTERVAL_MS = SWITCHY_VISIBLE_MS + SWITCHY_REST_MS; // full cycle
const SWITCHY_GREETING_DELAY_MS = 900; // first notification once the page settles
const SWITCHY_RECENT_LIMIT = 3;        // avoid repeating the last few lines

// Header shown above each line, based on the entry's category.
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
            <p id="switchy-bubble-heading" class="switchy-bubble-heading"></p>
            <p id="switchy-bubble-text" class="switchy-bubble-text"></p>
        </div>
    `;

    document.body.appendChild(container);
    return container;
}

/**
 * Shows a message in the notification and schedules it to hide after 8s.
 * @param {string} text
 * @param {string} [category] one of "TRIVIA", "STUDY TIP" or "CHEER"
 * @returns {boolean} true when the message was displayed
 */
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

    return displaySwitchyMessage(entry.text, entry.category);
}

/**
 * Restarts the countdown so the next notification arrives one full cycle
 * (8s visible + 5s rest) from now.
 */
function startSwitchyTimer() {
    clearInterval(switchyInterval);
    switchyInterval = setInterval(() => {
        if (document.hidden) return;
        showRandomTrivia();
    }, SWITCHY_INTERVAL_MS);
}

/**
 * Wires up the notification: visibility handling and the automatic timer.
 * The first card appears shortly after load, then the 8s card / 5s rest rhythm begins.
 */
function initSwitchy() {
    if (switchyRefs) return;

    const container = document.getElementById('switchy-container') || buildSwitchyWidget();

    switchyRefs = {
        container,
        bubble: container.querySelector('#switchy-bubble'),
        bubbleHeading: container.querySelector('#switchy-bubble-heading'),
        bubbleText: container.querySelector('#switchy-bubble-text')
    };

    // Pause the cadence in a hidden tab, then pick it back up on return.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(switchyInterval);
            switchyInterval = null;
        } else if (switchyRefs) {
            startSwitchyTimer();
        }
    });

    // Show one card once the page settles, then begin the 8s card / 5s rest rhythm.
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
    return displaySwitchyMessage(fact, 'TRIVIA');
}

/**
 * Delivers a specific cheer through the notification.
 * @param {string} text
 * @returns {boolean} true when Switchy delivered it
 */
function showSwitchyCheer(text) {
    if (!switchyRefs) initSwitchy();
    return displaySwitchyMessage(text, 'CHEER');
}

document.addEventListener('DOMContentLoaded', initSwitchy);
