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
    { match: (v, f, o, t) => v === "255" || o === "255", text: "Bit of knowledge: 255 is the max value of one byte - that is why color channels go 0 to 255!" },
    { match: (v, f, o, t) => f === 16 || t === 16, text: "Did you know? Hexadecimal is used in web colors - #FF5733 is just 3 bytes packed into 6 characters!" },
    { match: (v, f, o, t) => f === 2 || t === 2, text: "Did you know? Every computer chip speaks binary - 1s and 0s controlling billions of transistors!" },
    { match: (v, f, o, t) => f === 8 || t === 8, text: "Did you know? Octal was popular in early computing because it groups 3 bits neatly." },
    { match: (v, f, o, t) => f === 20 || t === 20, text: "Base-20 bonus: the Maya civilization counted on fingers AND toes!" },
    { match: (v, f, o, t) => (v && v.includes('.')) || (o && o.includes('.')), text: "Did you know? Fractions in binary can be infinite - 0.1 in decimal is 0.000110011... in binary!" }
];

const FALLBACK_TRIVIA = [
    "Switch fact: 'Nibble' is the cute name for 4 bits - half a byte!",
    "Did you know? The number zero was invented independently by the Maya, the Babylonians, and the Indians.",
    "Base-60 is still used today for telling time and measuring angles (thanks, Sumerians!).",
    "Bit math: 1024 bytes make a kilobyte because 1024 is 2 to the power of 10.",
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

const SWITCHY_CHEERS = [
    "Swapped in +100 Brainpower - your CS exam is going to love this!",
    "Base-2, base-8, base-10, base-16 - I can convert between all of them in my sleep!",
    "Every complex algorithm starts with a single tiny bit!",
    "Every bug you fix is just a number you decoded the right way!",
    "Level up! You are officially a Number System Wizard in the making!",
    "Hexadecimal is just 4-bit nibbles lined up side by side!",
    "Believe in yourself! Even supercomputers started with just 0 and 1!",
    "You are working hard today and Switchy is so proud of you!"
];

const SWITCHY_STUDY_TIPS = [
    "Study tip: chunk binary into 4-bit groups and hex becomes trivial.",
    "Study tip: the last bit (2^0) tells you if a number is even or odd.",
    "Study tip: two's complement is just flipping every bit after the first 1.",
    "Study tip: memorise 1 byte = 8 bits and 1 nibble = 4 bits - exams hide them.",
    "Study tip: 0xFF is 255 in decimal - spot that pattern in hex dumps.",
    "Study tip: ASCII only covers 0-127, anything higher needs Unicode.",
    "Study tip: read the question twice - 'convert to' and 'convert from' flip the answer.",
    "Study tip: write the powers of 2 from memory, every exam hides one."
];

/**
 * The three things Switchy says on their 10 second beat. Trivia is weighted
 * highest because it is the most useful thing they can tell you.
 */
const SWITCHY_BEATS = [
    { variant: 'trivia', icon: 'bulb', weight: 3 },
    { variant: 'tip', icon: 'book', weight: 2 },
    { variant: 'cheer', icon: 'heart', weight: 2 }
];

const SWITCHY_BUBBLE_ICONS = {
    greeting: 'sparkle',
    blessing: 'star',
    trivia: 'bulb',
    tip: 'book',
    cheer: 'heart'
};

const SWITCHY_SPARKLE_ICONS = ['sparkle', 'star', 'bolt', 'chip'];

const SWITCHY_BUBBLE_DURATIONS = {
    greeting: 5000,
    blessing: 6000,
    trivia: 12000,
    tip: 12000,
    cheer: 12000
};

// Once you hover Switchy they stay revealed for up to one minute.
const SWITCHY_LINGER_DURATION = 60000;

// Every 10 seconds Switchy says something new: a trivia fact, a study tip
// or a bit of cheering.
const SWITCHY_BEAT_INTERVAL = 10000;

const SWITCHY_GREETING = "Hi! I'm Switchy - your number system bestie. Every 10 seconds I pop up a trivia fact, a study tip or a cheer while you convert!";

let switchyRefs = null;
let switchyWired = false;
let switchyBlessingIdx = 0;
let switchyTipIdx = -1;
let switchyCheerIdx = -1;
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
            const hint = toggleBtn.querySelector('.switchy-toggle-hint');
            if (hint) hint.textContent = nowMinimized ? 'Bring Switchy back' : 'Minimize Switchy';
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
 * Picks which kind of message Switchy says next. Trivia is weighted higher
 * than tips and cheers because it carries the most learning value.
 * @returns {object} one of the SWITCHY_BEATS entries
 */
function pickSwitchyBeat() {
    const total = SWITCHY_BEATS.reduce((sum, beat) => sum + beat.weight, 0);
    let roll = Math.random() * total;
    for (const beat of SWITCHY_BEATS) {
        roll -= beat.weight;
        if (roll <= 0) return beat;
    }
    return SWITCHY_BEATS[0];
}

/**
 * Walks a list one step at a time, wrapping around, so Switchy never
 * repeats the same tip or cheer twice in a row.
 * @param {string[]} list
 * @param {number} currentIndex
 * @returns {{ text: string, index: number }}
 */
function nextInList(list, currentIndex) {
    if (!list.length) return { text: '', index: currentIndex };
    const index = (currentIndex + 1) % list.length;
    return { text: list[index], index };
}

/**
 * Switchy speaks up on their own every 10 seconds: a trivia fact, a study
 * tip or a cheer pops open automatically, without the student needing to
 * hover anything.
 *
 * Each tick reveals Switchy (so the bubble is actually visible), restarts the
 * linger countdown, and replaces the message on screen in place. The tick is
 * skipped while Switchy is minimized or the tab is in the background, and a
 * greeting or blessing already on screen is never interrupted.
 */
function startSwitchyTriviaLoop() {
    if (switchyTriviaTimer) return;
    switchyTriviaTimer = setInterval(() => {
        if (!switchyRefs || !switchyRefs.widget || !switchyRefs.bubble) return;
        if (switchyRefs.widget.classList.contains('minimized')) return;
        if (document.hidden) return;

        const bubble = switchyRefs.bubble;
        const onScreen = !bubble.classList.contains('hidden');
        const current = bubble.dataset.variant;
        // Never interrupt a short-lived greeting or blessing.
        if (onScreen && (current === 'greeting' || current === 'blessing')) return;

        // Reveal Switchy so the message is actually on screen, and keep the
        // linger countdown running so they do not tuck away mid-sentence.
        switchyRefs.widget.classList.add('switchy-active');
        startSwitchyLinger();

        const beat = pickSwitchyBeat();
        let text = '';

        if (beat.variant === 'trivia') {
            text = (typeof getTriviaForConversion === 'function')
                ? getTriviaForConversion('', 10, '', 10)
                : '';
        } else if (beat.variant === 'tip') {
            const tip = nextInList(SWITCHY_STUDY_TIPS, switchyTipIdx);
            switchyTipIdx = tip.index;
            text = tip.text;
        } else {
            const cheer = nextInList(SWITCHY_CHEERS, switchyCheerIdx);
            switchyCheerIdx = cheer.index;
            text = cheer.text;
        }

        if (text) saySwitchyMessage(text, beat.variant);
    }, SWITCHY_BEAT_INTERVAL);
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

        <div id="switchy-avatar-wrap" class="switchy-avatar-wrap" title="Switchy - your study companion">
            <div class="switchy-aura"></div>
            <img src="assets/favicon.png" alt="Binary Conversion Exchange icon" class="switchy-avatar-img">
            <span class="switchy-corner-star">${icon('star')}</span>
            <div class="switchy-sparkles" aria-hidden="true"></div>
        </div>
        <button type="button" id="switchy-toggle-btn" class="switchy-toggle-btn" title="${isMinimized ? 'Show Switchy' : 'Hide Switchy'}">
            ${isMinimized ? icon('converter') : icon('sparkle')}<span class="switchy-toggle-hint">${isMinimized ? 'Bring Switchy back' : 'Minimize Switchy'}</span>
        </button>
    `;

    document.body.appendChild(widget);
}

/**
 * Makes Switchy say something. Every message they speak goes through here.
 * @param {string} message - The text they say.
 * @param {string} [variant] - greeting | blessing | trivia | tip | cheer
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
        bubbleIcon.innerHTML = icon(SWITCHY_BUBBLE_ICONS[variant] || 'sparkle');
    }

    // Trigger the sparkle particle shower
    createSparkles(avatarWrap);

    // Gentle cute wobble
    if (avatarWrap) {
        avatarWrap.classList.remove('switchy-wobble');
        void avatarWrap.offsetWidth;
        avatarWrap.classList.add('switchy-wobble');
    }

    const ms = duration || SWITCHY_BUBBLE_DURATIONS[variant] || SWITCHY_BUBBLE_DURATIONS.blessing;
    clearTimeout(window.switchyBubbleTimer);
    // A rotating message (trivia, tip or cheer) stays on screen while Switchy
    // is revealed; the 10 second beat replaces it in place. Greetings and
    // blessings are short-lived and auto-hide on their own.
    const rotating = variant === 'trivia' || variant === 'tip' || variant === 'cheer';
    if (rotating && switchyRefs.widget && switchyRefs.widget.classList.contains('switchy-active')) {
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
 * Delivers a cheer through Switchy.
 */
function showSwitchyBlessing(blessing) {
    if (!switchyRefs) initSwitchy();
    return saySwitchyMessage(blessing || SWITCHY_CHEERS[0], 'blessing');
}

function triggerBlessing() {
    switchyBlessingIdx = (switchyBlessingIdx + 1) % SWITCHY_CHEERS.length;
    saySwitchyMessage(SWITCHY_CHEERS[switchyBlessingIdx], 'blessing');
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
