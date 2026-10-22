/**
 * Bitzy Trivia & Switchy Companion Engine
 * ---------------------------------------------
 * Switchy is the ONE voice of the app: every trivia fact, study tip and
 * blessing is delivered inside his speech bubble. Nothing else on a page
 * renders trivia, so Switchy is always where the knowledge lives.
 *
 * Both halves of that system live in this one file:
 *   Part 1 - the trivia engine that picks the right fact for a conversion
 *   Part 2 - the companion widget that says it out loud
 */

/* ==========================================================
   PART 1 - TRIVIA ENGINE
   ========================================================== */

const CONTEXT_TRIVIA = [
    { match: (v, f, o, t) => v === "255" || o === "255", text: "Did you know? 255 is the max value of one byte - that is why color channels go 0 to 255!" },
    { match: (v, f, o, t) => f === 16 || t === 16, text: "Did you know? Hexadecimal is used in web colors - #FF5733 is just 3 bytes packed into 6 characters!" },
    { match: (v, f, o, t) => f === 2 || t === 2, text: "Did you know? Every computer chip speaks binary - 1s and 0s controlling billions of transistors!" },
    { match: (v, f, o, t) => f === 8 || t === 8, text: "Did you know? Octal was popular in early computing because it groups 3 bits neatly." },
    { match: (v, f, o, t) => f === 20 || t === 20, text: "Did you know? The Maya civilization used base-20 - counting on fingers AND toes!" },
    { match: (v, f, o, t) => (v && v.includes('.')) || (o && o.includes('.')), text: "Did you know? Fractions in binary can be infinite - 0.1 in decimal is 0.000110011... in binary!" }
];

const FALLBACK_TRIVIA = [
    "Did you know? 'Nibble' is the cute name for 4 bits - half a byte!",
    "Did you know? The number zero was invented independently by the Maya, the Babylonians, and the Indians.",
    "Did you know? Base-60 is still used today for telling time and measuring angles (thanks, Sumerians!).",
    "Did you know? 1024 bytes make a kilobyte because 1024 is 2 to the power of 10.",
    "Did you know? Some ancient systems used base-12 because you can count it on the finger joints of one hand!"
];

let lastFact = "";

function getTriviaForConversion(inputValue, fromBase, outputValue, toBase) {
    let possibleFacts = [];
    for (let rule of CONTEXT_TRIVIA) {
        if (rule.match(inputValue, fromBase, outputValue, toBase)) {
            possibleFacts.push(rule.text);
        }
    }

    let pool = possibleFacts.length > 0 ? possibleFacts : FALLBACK_TRIVIA;

    if (pool.length > 1) {
        pool = pool.filter(f => f !== lastFact);
    }

    let chosenFact = pool[Math.floor(Math.random() * pool.length)];
    lastFact = chosenFact;
    return chosenFact;
}

/**
 * Hands a trivia fact to Switchy, who says it in his bubble.
 * If Switchy is minimized or unavailable, the fact falls back to a toast
 * so no trivia is ever silently dropped.
 * @param {string} factText
 */
function showTrivia(factText) {
    if (!factText) return;

    if (typeof showSwitchyTrivia === 'function' && showSwitchyTrivia(factText)) {
        return;
    }

    if (typeof setFeedback === 'function') {
        setFeedback(factText, 'hint', 'trivia');
    }
}

/* ==========================================================
   PART 2 - SWITCHY COMPANION
   ========================================================== */

const SWITCHY_BLESSINGS = [
    "Ta-da! Switchy blessed your CS exam with +100 Brainpower!",
    "Every complex algorithm starts with a single tiny bit!",
    "Study tip: drink some water and take a stretch - your brain needs hydration.",
    "May all your compiler bugs turn into butterflies!",
    "Easter egg found! You are officially a Number System Wizard in the making!",
    "Hexadecimal is just 4-bit nibbles holding hands!",
    "Believe in yourself! Even supercomputers started with just 0 and 1!",
    "You are working hard today and Switchy is so proud of you!"
];

const SWITCHY_SPARKLE_ICONS = ['sparkle', 'star', 'flower', 'heart'];

const SWITCHY_BUBBLE_DURATIONS = {
    greeting: 5000,
    blessing: 6000,
    trivia: 12000
};

// Once you hover Switchy they stay revealed for up to one minute.
const SWITCHY_LINGER_DURATION = 60000;

// While Switchy is revealed, the trivia fact rotates every 10 seconds.
const SWITCHY_TRIVIA_ROTATE_INTERVAL = 10000;

const SWITCHY_GREETING = "Hi! I'm Switchy - your number system bestie. Hover over me to say hello, and I'll share trivia while you convert!";

let switchyRefs = null;
let switchyWired = false;
let switchyBlessingIdx = 0;
let switchyTriviaTimer = null;
let switchyLingerTimer = null;

function initSwitchy() {
    if (!document.getElementById('switchy-widget')) {
        buildSwitchyWidget();
    }

    const widget = document.getElementById('switchy-widget');
    const avatarWrap = document.getElementById('switchy-avatar-wrap');
    const bubble = document.getElementById('switchy-bubble');
    const bubbleText = document.getElementById('switchy-bubble-text');
    const bubbleIcon = document.getElementById('switchy-bubble-icon');
    const bubbleClose = document.getElementById('switchy-bubble-close');
    const toggleBtn = document.getElementById('switchy-toggle-btn');

    switchyRefs = { widget, avatarWrap, bubble, bubbleText, bubbleIcon, bubbleClose, toggleBtn };

    if (switchyWired) return;
    switchyWired = true;

    // "Hover to show Switchy": hovering reveals them and they then stay for
    // up to one minute. The countdown starts on the first hover, so leaving
    // early does not hide them immediately.
    if (widget) {
        widget.addEventListener('mouseenter', () => {
            if (widget.classList.contains('minimized')) return;
            widget.classList.add('switchy-active');
            startSwitchyLinger();
        });
        widget.addEventListener('mouseleave', () => {
            if (!switchyLingerTimer) widget.classList.remove('switchy-active');
        });
        widget.addEventListener('focusin', () => {
            if (widget.classList.contains('minimized')) return;
            widget.classList.add('switchy-active');
            startSwitchyLinger();
        });
        widget.addEventListener('focusout', () => {
            if (!switchyLingerTimer) widget.classList.remove('switchy-active');
        });
    }

    // Switchy is a hover reveal only - they are not clickable, so clicking
    // simply keeps them visible instead of triggering a message.

    if (bubbleClose) {
        bubbleClose.addEventListener('click', (e) => {
            e.stopPropagation();
            bubble.classList.add('hidden');
        });
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            widget.classList.toggle('minimized');
            const nowMinimized = widget.classList.contains('minimized');
            localStorage.setItem('bitzy-switchy-minimized', nowMinimized);
            toggleBtn.title = nowMinimized ? 'Show Switchy' : 'Hide Switchy';
            if (nowMinimized) {
                bubble.classList.add('hidden');
            } else {
                triggerBlessing();
            }
        });
    }

    // Greet the student on page load with a warm hello
    setTimeout(() => {
        if (!widget.classList.contains('minimized') && bubble.classList.contains('hidden')) {
            widget.classList.add('switchy-active');
            saySwitchyMessage(SWITCHY_GREETING, 'greeting');
            startSwitchyLinger();
        }
    }, 1200);

    startSwitchyTriviaLoop();
}

/**
 * Keeps Switchy revealed for one minute after they are shown. Each fresh
 * hover restarts the minute; when the minute ends and the cursor is gone,
 * they tuck themselves away again.
 */
function startSwitchyLinger() {
    if (!switchyRefs || !switchyRefs.widget) return;
    clearTimeout(switchyLingerTimer);
    switchyLingerTimer = setTimeout(() => {
        switchyLingerTimer = null;
        const widget = switchyRefs.widget;
        if (widget.classList.contains('minimized')) return;
        if (widget.matches(':hover') || widget.contains(document.activeElement)) {
            startSwitchyLinger();
            return;
        }
        widget.classList.remove('switchy-active');
        if (switchyRefs.bubble) switchyRefs.bubble.classList.add('hidden');
    }, SWITCHY_LINGER_DURATION);
}

/**
 * While Switchy is revealed they rotate a fresh trivia fact every 10 seconds.
 * The current fact is replaced in place. Skips the tick while they are
 * minimized, not shown, or the tab is hidden. Blessings (e.g. on restore) are
 * never interrupted - only a trivia bubble is rotated.
 */
function startSwitchyTriviaLoop() {
    if (switchyTriviaTimer) return;
    switchyTriviaTimer = setInterval(() => {
        if (!switchyRefs || !switchyRefs.widget || !switchyRefs.bubble) return;
        if (switchyRefs.widget.classList.contains('minimized')) return;
        if (!switchyRefs.widget.classList.contains('switchy-active')) return;
        if (document.hidden) return;

        const bubble = switchyRefs.bubble;
        const alreadyTrivia = !bubble.classList.contains('hidden') && bubble.dataset.variant === 'trivia';
        if (!bubble.classList.contains('hidden') && !alreadyTrivia) return;

        const fact = (typeof getTriviaForConversion === 'function')
            ? getTriviaForConversion('', 10, '', 10)
            : null;
        if (fact) saySwitchyMessage(fact, 'trivia');
    }, SWITCHY_TRIVIA_ROTATE_INTERVAL);
}

function buildSwitchyWidget() {
    // Check if the student minimized Switchy previously
    const isMinimized = localStorage.getItem('bitzy-switchy-minimized') === 'true';

    const widget = document.createElement('div');
    widget.id = 'switchy-widget';
    widget.className = `switchy-container ${isMinimized ? 'minimized' : ''}`;
    widget.setAttribute('aria-label', 'Switchy Companion');

    widget.innerHTML = `
        <div id="switchy-bubble" class="switchy-bubble hidden" data-variant="greeting" role="status" aria-live="polite">
            <span id="switchy-bubble-icon" class="switchy-bubble-icon" aria-hidden="true"></span>
            <span id="switchy-bubble-text">${SWITCHY_GREETING}</span>
            <button type="button" id="switchy-bubble-close" class="switchy-bubble-close" aria-label="Close dialog">${icon('close')}</button>
        </div>

        <div id="switchy-avatar-wrap" class="switchy-avatar-wrap" title="Hover to show Switchy">
            <div class="switchy-aura"></div>
            <img src="assets/favicon.png" alt="Binary Conversion Exchange icon" class="switchy-avatar-img">
            <span class="switchy-wand-star">${icon('star')}</span>
            <div class="switchy-sparkles" aria-hidden="true"></div>
        </div>
        <button type="button" id="switchy-toggle-btn" class="switchy-toggle-btn" title="Show Switchy">
            ${isMinimized ? icon('converter') : icon('sparkle')}<span class="switchy-toggle-hint">Hover to show Switchy</span>
        </button>
    `;

    document.body.appendChild(widget);
}

/**
 * Makes Switchy say something. Every message they speak goes through here.
 * @param {string} message - The text they say.
 * @param {string} [variant] - greeting | blessing | trivia
 * @param {number} [duration] - Optional override for how long the bubble stays open.
 * @returns {boolean} true when the message was delivered.
 */
function saySwitchyMessage(message, variant = 'blessing', duration) {
    if (!switchyRefs || !switchyRefs.bubble || !message) return false;
    const { bubble, bubbleText, bubbleIcon, avatarWrap } = switchyRefs;

    bubbleText.textContent = message;
    bubble.dataset.variant = variant;
    bubble.classList.remove('hidden');

    if (bubbleIcon) {
        bubbleIcon.innerHTML = variant === 'trivia' ? icon('bulb') : icon('sparkle');
    }

    // Trigger magical sparkle shower
    createSparkles(avatarWrap);

    // Gentle cute wobble
    if (avatarWrap) {
        avatarWrap.classList.remove('switchy-wobble');
        void avatarWrap.offsetWidth;
        avatarWrap.classList.add('switchy-wobble');
    }

    const ms = duration || SWITCHY_BUBBLE_DURATIONS[variant] || SWITCHY_BUBBLE_DURATIONS.blessing;
    clearTimeout(window.switchyBubbleTimer);
    // A trivia bubble stays on screen while Switchy is revealed; the 10s
    // rotation loop replaces it in place. Other messages auto-hide normally.
    if (variant === 'trivia' && switchyRefs.widget && switchyRefs.widget.classList.contains('switchy-active')) {
        return true;
    }
    window.switchyBubbleTimer = setTimeout(() => {
        bubble.classList.add('hidden');
    }, ms);

    return true;
}

/**
 * Delivers a trivia fact through Switchy.
 * @param {string} fact
 * @returns {boolean} true when Switchy delivered it, false when unavailable.
 */
function showSwitchyTrivia(fact) {
    if (!fact) return false;
    if (!switchyRefs) initSwitchy();
    if (!switchyRefs || !switchyRefs.widget) return false;
    if (switchyRefs.widget.classList.contains('minimized')) return false;
    return saySwitchyMessage(fact, 'trivia');
}

/**
 * Delivers a study blessing through Switchy.
 */
function showSwitchyBlessing(blessing) {
    if (!switchyRefs) initSwitchy();
    return saySwitchyMessage(blessing || SWITCHY_BLESSINGS[0], 'blessing');
}

function triggerBlessing() {
    switchyBlessingIdx = (switchyBlessingIdx + 1) % SWITCHY_BLESSINGS.length;
    saySwitchyMessage(SWITCHY_BLESSINGS[switchyBlessingIdx], 'blessing');
}

function createSparkles(targetEl) {
    if (!targetEl) return;
    for (let i = 0; i < 7; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'switchy-floating-sparkle';
        const name = SWITCHY_SPARKLE_ICONS[Math.floor(Math.random() * SWITCHY_SPARKLE_ICONS.length)];
        sparkle.innerHTML = icon(name);
        sparkle.style.left = (Math.random() * 60 - 15) + 'px';
        sparkle.style.bottom = (Math.random() * 40 + 20) + 'px';
        sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
        targetEl.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSwitchy();
});
