/**
 * Bitzy Trivia & Switchy Companion Engine
 * ---------------------------------------------
 * Switchy is the ONE voice of the app: every trivia fact, study tip and
 * cheer is delivered inside their speech bubble. Nothing else on a page
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
    { match: (v, f, o, t) => v === "255" || o === "255", text: "Did you know that a 'byte' is 8 bits — and it can represent 256 different values (0 to 255)? That's why old video games had '255' as the max score!" },
    { match: (v, f, o, t) => f === 16 || t === 16, text: "Did you know that the hexadecimal system is popular because one hex digit = exactly 4 bits (one nibble)? That's why programmers love it — it's binary in a compact costume!" },
    { match: (v, f, o, t) => f === 2 || t === 2, text: "Did you know that binary counting on your fingers lets you count all the way to 1023 using just 10 fingers? Each finger is a bit — up = 1, down = 0. Just like Switchy's switch!" },
    { match: (v, f, o, t) => f === 8 || t === 8, text: "Did you know that octal was once widely used in computing because early machines had 12-bit, 24-bit, and 36-bit word sizes — all perfectly divisible by 3! Switchy loves a clean division." },
    { match: (v, f, o, t) => f === 20 || t === 20, text: "Did you know that the Mayans used a base-20 (vigesimal) system — possibly inspired by counting on fingers and toes?" },
    { match: (v, f, o, t) => (v && v.includes('.')) || (o && o.includes('.')), text: "Did you know that in base 2, the number 0.1 means one-half — not one-tenth? Switchy warns: the decimal point plays by different rules in every base!" },
    { match: (v, f, o, t) => f !== t, text: "Did you know that every number you'll ever meet can be written in ANY base — and it's still the same number, just wearing a different outfit? Flip the switch and see!" }
];

const FALLBACK_TRIVIA = [
    "Did you know that the word 'bit' comes from 'binary digit' — and it was coined by statistician John Tukey in 1947? Switchy's whole language is built on it!",
    "Did you know that binary is older than computers? The mathematician Gottfried Wilhelm Leibniz described the binary system back in 1689 — over 250 years before electronic computers existed!",
    "Did you know that your computer's memory addresses are often shown in hexadecimal — like 0x7FFF — because it's shorter and easier to read than long strings of 1s and 0s?",
    "Did you know that base 60 (sexagesimal) is still with us today? That's why an hour has 60 minutes and a circle has 360 degrees — a gift from the ancient Babylonians!",
    "Did you know that 'decimal' comes from the Latin word 'decem,' meaning ten — because it's based on the ten fingers on our hands?",
    "Did you know that 'hex' in hexadecimal means six, and 'decimal' means ten — so hexadecimal literally means 'sixteen'? (hexa + decem = 6 + 10!)",
    "Did you know that ASCII codes are often written in hex? For example, the letter 'A' is 65 in decimal or 41 in hex — that's how computers store text!",
    "Did you know that '0x' at the start of a number (like 0xFF) is a common programmer shorthand meaning 'this is hexadecimal'? Switchy flips that switch instantly!",
    "Did you know that binary fractions can't always represent decimals exactly? For example, 0.1 in decimal becomes a repeating fraction in binary (0.0001100110011...) — which is why some calculations have tiny rounding errors!",
    "Did you know that the abacus — one of the earliest calculating tools — used a kind of place-value system, a cousin of our modern number systems?",
    "Did you know that 'nibble' (4 bits) is a playful pun on 'byte' — and it takes exactly two nibbles to make one byte? Switchy giggles every time.",
    "Did you know that base 12 (duodecimal) has passionate fans today who argue it's better than base 10 — because 12 divides evenly by 2, 3, 4, and 6! That's why we still say 'dozen' and clocks have 12 hours.",
    "Did you know that the largest digit in any base is always one less than the base? So base 2's biggest digit is 1, base 8's is 7, and base 16's is F (15)!",
    "Did you know that every number you'll ever meet can be written in ANY base — and it's still the same number, just wearing a different outfit? Flip the switch and see!"
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
 * Hands a trivia fact to Switchy, who says it in their bubble.
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
    "Don't be binary-ous — you've got this!",
    "One bit at a time — that's how Switchy does it, and so can you!",
    "You're not 0 — you're a total 1!",
    "Base by base, you're building greatness!",
    "Convert with confidence — Switchy believes in you!",
    "When in doubt, break it down — powers of 2 to the rescue!",
    "You've got 16/16 hex-cellence!",
    "Keep your head switched ON — you're doing amazing!",
    "Errors are just practice in disguise — flip, fix, and fly!",
    "Go, go, go — you're octal-ing past the competition!",
    "Switchy says: YOU are the brightest bit in the system!"
];

const SWITCHY_STUDY_TIPS = [
    "'Flip It' Practice — Switchy says: practice converting BOTH ways (decimal → binary AND binary → decimal). Master the flip in both directions!",
    "Make a Place-Value Chart — Write powers of 2 across the top: 128, 64, 32, 16, 8, 4, 2, 1. Then just place 1s and 0s under them. Switchy's favorite cheat sheet!",
    "Learn the 'Nibble Trick' — Memorize the 4-bit → hex table (0000=0 ... 1111=F). It makes binary↔hex conversions lightning fast.",
    "Show Your Work in Columns — For decimal→binary, use repeated division by 2 and read remainders bottom to top. Switchy reminds you: don't forget to flip the order!",
    "Use the 'Subtraction Method' — To convert decimal to binary, subtract the largest power of 2 that fits, mark a 1, repeat. Great for big numbers.",
    "Say It Out Loud — Read binary numbers digit by digit ('one-zero-one-one') to avoid mixing them up with decimal numbers.",
    "10-Minute Daily Drills — Five conversions a day beats one long cram session. Switchy powers up a little every day!",
    "Color-Code Your Digits — Highlight each group of 4 bits when converting to hex. Grouping prevents careless errors.",
    "Check Your Answer Backwards — Convert your result back to the original base. If it matches, you're golden!",
    "Quiz a Friend with Switchy's Game — One person says a decimal number, the other races to write it in binary. Winner gets bragging rights! Flip that switch — you're on the right circuit!"
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
    greeting: 'glint',
    trivia: 'bulb',
    tip: 'book',
    cheer: 'heart'
};

const SWITCHY_PARTICLE_ICONS = ['glint', 'star', 'bolt', 'chip'];

const SWITCHY_BUBBLE_DURATIONS = {
    greeting: 5000,
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

    // Hovering Switchy reveals them and restarts their one-minute linger, so
    // they stay on screen while the student reads the current message.
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

    // Switchy is not clickable - clicking them simply keeps them visible
    // instead of triggering a message.

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
                triggerCheer();
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
 * greeting or welcome cheer already on screen is never interrupted.
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
        // Never interrupt a short-lived greeting.
        if (onScreen && current === 'greeting') return;

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
            <div class="switchy-particles" aria-hidden="true"></div>
        </div>
        <button type="button" id="switchy-toggle-btn" class="switchy-toggle-btn" title="${isMinimized ? 'Show Switchy' : 'Hide Switchy'}">
            ${isMinimized ? icon('converter') : icon('glint')}<span class="switchy-toggle-hint">${isMinimized ? 'Bring Switchy back' : 'Minimize Switchy'}</span>
        </button>
    `;

    document.body.appendChild(widget);
}

/**
 * Makes Switchy say something. Every message they speak goes through here.
 * @param {string} message - The text they say.
 * @param {string} [variant] - greeting | trivia | tip | cheer
 * @param {number} [duration] - Optional override for how long the bubble stays open.
 * @returns {boolean} true when the message was delivered.
 */
function saySwitchyMessage(message, variant = 'cheer', duration) {
    if (!switchyRefs || !switchyRefs.bubble || !message) return false;
    const { bubble, bubbleText, bubbleIcon, avatarWrap } = switchyRefs;

    bubbleText.textContent = message;
    bubble.dataset.variant = variant;
    bubble.classList.remove('hidden');

    if (bubbleIcon) {
        bubbleIcon.innerHTML = icon(SWITCHY_BUBBLE_ICONS[variant] || 'glint');
    }

    // Trigger the bit particle shower
    createParticles(avatarWrap);

    // Gentle cute wobble
    if (avatarWrap) {
        avatarWrap.classList.remove('switchy-wobble');
        void avatarWrap.offsetWidth;
        avatarWrap.classList.add('switchy-wobble');
    }

    const ms = duration || SWITCHY_BUBBLE_DURATIONS[variant] || SWITCHY_BUBBLE_DURATIONS.cheer;
    clearTimeout(window.switchyBubbleTimer);
    // A rotating message (trivia, tip or cheer) stays on screen while Switchy
    // is revealed; the 10 second beat replaces it in place. A greeting, or a
    // cheer given an explicit duration, is short-lived and auto-hides.
    const rotating = !duration && (variant === 'trivia' || variant === 'tip' || variant === 'cheer');
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
function showSwitchyCheer(text) {
    if (!switchyRefs) initSwitchy();
    return saySwitchyMessage(text || SWITCHY_CHEERS[0], 'cheer', 6000);
}

/**
 * Greets the student with a cheer when they bring Switchy back.
 */
function triggerCheer() {
    const cheer = nextInList(SWITCHY_CHEERS, switchyCheerIdx);
    switchyCheerIdx = cheer.index;
    saySwitchyMessage(cheer.text, 'cheer', 6000);
}

function createParticles(targetEl) {
    if (!targetEl) return;
    for (let i = 0; i < 7; i++) {
        const particle = document.createElement('span');
        particle.className = 'switchy-floating-particle';
        const name = SWITCHY_PARTICLE_ICONS[Math.floor(Math.random() * SWITCHY_PARTICLE_ICONS.length)];
        particle.innerHTML = icon(name);
        particle.style.left = (Math.random() * 60 - 15) + 'px';
        particle.style.bottom = (Math.random() * 40 + 20) + 'px';
        particle.style.animationDelay = (Math.random() * 0.3) + 's';
        targetEl.appendChild(particle);

        setTimeout(() => particle.remove(), 1200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSwitchy();
});
