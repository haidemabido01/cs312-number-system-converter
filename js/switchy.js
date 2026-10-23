/**
 * Switchy — the floating study companion
 * ---------------------------------------------
 * A small mascot anchored to the bottom-right corner of every page. Every
 * 10 seconds Switchy pops up a speech bubble with a random trivia fact,
 * study tip or cheer, then tucks the bubble away after 8 seconds.
 *
 * Clicking the logo asks for another line immediately and restarts the
 * 10 second countdown. The X on the bubble closes the current message.
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

const SWITCHY_INTERVAL_MS = 10000;     // how often Switchy speaks up
const SWITCHY_VISIBLE_MS = 8000;       // how long the bubble stays open
const SWITCHY_GREETING_DELAY_MS = 900; // first hello once the page settles
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
 * Builds the fixed container, the speech bubble and the circular logo
 * button, then attaches it to the page. Safe to call more than once.
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

        <!-- Replace the src below with your own Switchy artwork when ready. -->
        <div class="switchy-avatar-wrap">
            <span class="switchy-avatar-halo" aria-hidden="true"></span>
            <button type="button" id="switchy-avatar" class="switchy-avatar" aria-label="Ask Switchy for another fact">
                <img id="switchy-avatar-img" class="switchy-avatar-img" src="assets/binary-conversion-exchange.png" alt="Switchy, the BitSeen mascot">
            </button>
        </div>
    `;

    document.body.appendChild(container);
    return container;
}

/**
 * Shows a message in the bubble and schedules it to hide again after 8s.
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

    // A quick "talking" wobble on the avatar while the bubble is up.
    if (switchyRefs.avatar) {
        switchyRefs.avatar.classList.remove('switchy-avatar-talking');
        void switchyRefs.avatar.offsetWidth; // restart the animation
        switchyRefs.avatar.classList.add('switchy-avatar-talking');
    }

    clearTimeout(switchyHideTimeout);
    switchyHideTimeout = setTimeout(hideSwitchyBubble, SWITCHY_VISIBLE_MS);

    return true;
}

/**
 * Hides the current speech bubble and stops the talking wobble.
 */
function hideSwitchyBubble() {
    clearTimeout(switchyHideTimeout);
    switchyHideTimeout = null;

    if (!switchyRefs) return;
    switchyRefs.bubble.classList.remove('switchy-bubble-visible');
    switchyRefs.bubble.setAttribute('aria-hidden', 'true');
    if (switchyRefs.avatar) switchyRefs.avatar.classList.remove('switchy-avatar-talking');
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
 * Pops up a random line from js/trivia.js. Used by the timer, the on-load
 * greeting and by clicking Switchy.
 * @returns {boolean} true when something was shown
 */
function showRandomTrivia() {
    if (!switchyRefs) initSwitchy();

    const entry = pickRandomSwitchyEntry();
    if (!entry) return false;

    return displaySwitchyMessage(entry.category, entry.text);
}

/**
 * Restarts the countdown. Called after the greeting and every time the logo
 * is clicked, so a manual click always buys a fresh 10 seconds.
 */
function startSwitchyTimer() {
    clearInterval(switchyInterval);
    switchyInterval = setInterval(() => {
        if (document.hidden) return;
        showRandomTrivia();
    }, SWITCHY_INTERVAL_MS);
}

/**
 * Wires up the widget: logo click, close button, visibility handling and the
 * automatic timer. The first line appears shortly after load, then the
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
        bubbleClose: container.querySelector('#switchy-bubble-close'),
        avatar: container.querySelector('#switchy-avatar')
    };

    // Clicking Switchy speaks immediately and resets the 10 second timer.
    switchyRefs.avatar.addEventListener('click', () => {
        clearTimeout(switchyGreetingTimeout);
        switchyGreetingTimeout = null;
        showRandomTrivia();
        startSwitchyTimer();
    });

    // Let keyboard users close the bubble with Escape as well as the X.
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

    // Say hello once the page settles, then begin the 10 second rhythm.
    switchyGreetingTimeout = setTimeout(() => {
        switchyGreetingTimeout = null;
        showRandomTrivia();
        startSwitchyTimer();
    }, SWITCHY_GREETING_DELAY_MS);
}

/**
 * Delivers a specific trivia fact through Switchy's bubble. Kept for the
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
 * Delivers a specific cheer through Switchy's bubble.
 * @param {string} text
 * @returns {boolean} true when Switchy delivered it
 */
function showSwitchyCheer(text) {
    if (!switchyRefs) initSwitchy();
    return displaySwitchyMessage('CHEER', text);
}

document.addEventListener('DOMContentLoaded', initSwitchy);
