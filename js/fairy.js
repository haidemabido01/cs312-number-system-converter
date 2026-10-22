/**
 * Bitzy Easter Fairy Chick Companion
 * ---------------------------------------------
 * She is the ONE voice of the app: every trivia fact, study tip and
 * blessing is delivered inside her speech bubble. Nothing else on a page
 * renders trivia, so the chick is always where the knowledge lives.
 */

const FAIRY_BLESSINGS = [
    "Poof! The Easter Fairy Chick blessed your CS exam with +100 Brainpower!",
    "Peep peep! Every complex algorithm starts with a single tiny chick step!",
    "Fairy study tip: Drink some water and take a stretch! Your brain needs hydration.",
    "Poof! May all your compiler bugs turn into butterflies!",
    "Easter egg found! You are officially a Number System Wizard in the making!",
    "Chirp chirp! Hexadecimal is just 4-bit nibbles holding hands!",
    "Believe in yourself! Even supercomputers started with just 0 and 1!",
    "Flutter flutter! You are working hard today and Bitzy is so proud of you!"
];

const FAIRY_SPARKLE_ICONS = ['sparkle', 'star', 'flower', 'heart'];

const FAIRY_BUBBLE_DURATIONS = {
    greeting: 5000,
    blessing: 6000,
    trivia: 12000
};

// Once you hover the Fairy she stays revealed for up to one minute.
const FAIRY_LINGER_DURATION = 60000;

// While she is revealed, the trivia fact rotates every 10 seconds.
const FAIRY_TRIVIA_ROTATE_INTERVAL = 10000;

let fairyRefs = null;
let fairyWired = false;
let fairyBlessingIdx = 0;
let fairyTriviaTimer = null;
let fairyLingerTimer = null;

function initFairyChick() {
    if (!document.getElementById('fairy-chick-widget')) {
        buildFairyWidget();
    }

    const widget = document.getElementById('fairy-chick-widget');
    const avatarWrap = document.getElementById('fairy-avatar-wrap');
    const bubble = document.getElementById('fairy-bubble');
    const bubbleText = document.getElementById('fairy-bubble-text');
    const bubbleIcon = document.getElementById('fairy-bubble-icon');
    const bubbleClose = document.getElementById('fairy-bubble-close');
    const toggleBtn = document.getElementById('fairy-toggle-btn');

    fairyRefs = { widget, avatarWrap, bubble, bubbleText, bubbleIcon, bubbleClose, toggleBtn };

    if (fairyWired) return;
    fairyWired = true;

    // "Hover to show Fairy": hovering reveals the chick and she then stays for
    // up to one minute. The countdown starts on the first hover, so leaving
    // the chick early does not hide her immediately.
    if (widget) {
        widget.addEventListener('mouseenter', () => {
            if (widget.classList.contains('minimized')) return;
            widget.classList.add('fairy-active');
            startFairyLinger();
        });
        widget.addEventListener('mouseleave', () => {
            if (!fairyLingerTimer) widget.classList.remove('fairy-active');
        });
        widget.addEventListener('focusin', () => {
            if (widget.classList.contains('minimized')) return;
            widget.classList.add('fairy-active');
            startFairyLinger();
        });
        widget.addEventListener('focusout', () => {
            if (!fairyLingerTimer) widget.classList.remove('fairy-active');
        });
    }

    // The chick is a hover reveal only - she is not clickable, so clicking her
    // simply keeps her visible instead of triggering a message.

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
            localStorage.setItem('bitzy-fairy-minimized', nowMinimized);
            toggleBtn.title = nowMinimized ? 'Show Fairy' : 'Hide Fairy';
            if (nowMinimized) {
                bubble.classList.add('hidden');
            } else {
                triggerBlessing();
            }
        });
    }

    // Greet the student on page load with a warm easter chirp
    setTimeout(() => {
        if (!widget.classList.contains('minimized') && bubble.classList.contains('hidden')) {
            widget.classList.add('fairy-active');
            sayFairyMessage(
                "Peep! I am your Easter Fairy Chick! Hover over me to say hello - I share trivia while you convert!",
                'greeting'
            );
            startFairyLinger();
        }
    }, 1200);

    startFairyTriviaLoop();
}

/**
 * Keeps the Fairy revealed for one minute after she is shown. Each fresh hover
 * restarts the minute; when the minute ends and the cursor is gone, she tucks
 * herself away again.
 */
function startFairyLinger() {
    if (!fairyRefs || !fairyRefs.widget) return;
    clearTimeout(fairyLingerTimer);
    fairyLingerTimer = setTimeout(() => {
        fairyLingerTimer = null;
        const widget = fairyRefs.widget;
        if (widget.classList.contains('minimized')) return;
        if (widget.matches(':hover') || widget.contains(document.activeElement)) {
            startFairyLinger();
            return;
        }
        widget.classList.remove('fairy-active');
        if (fairyRefs.bubble) fairyRefs.bubble.classList.add('hidden');
    }, FAIRY_LINGER_DURATION);
}

/**
 * Every 30 seconds the fairy drops a trivia fact in her bubble, but only while
 * the cursor is hovering her (the fairy is "shown"). Skips the tick while she
 * is minimized or the tab is hidden, and never interrupts a message already
 * on screen.
 */
/**
 * While the Fairy is revealed she rotates a fresh trivia fact every 10 seconds.
 * The current fact is replaced in place. Skips the tick while she is minimized,
 * not shown, or the tab is hidden. Blessings (e.g. on restore) are never
 * interrupted - only a trivia bubble is rotated.
 */
function startFairyTriviaLoop() {
    if (fairyTriviaTimer) return;
    fairyTriviaTimer = setInterval(() => {
        if (!fairyRefs || !fairyRefs.widget || !fairyRefs.bubble) return;
        if (fairyRefs.widget.classList.contains('minimized')) return;
        if (!fairyRefs.widget.classList.contains('fairy-active')) return;
        if (document.hidden) return;

        const bubble = fairyRefs.bubble;
        const alreadyTrivia = !bubble.classList.contains('hidden') && bubble.dataset.variant === 'trivia';
        if (!bubble.classList.contains('hidden') && !alreadyTrivia) return;

        const fact = (typeof getTriviaForConversion === 'function')
            ? getTriviaForConversion('', 10, '', 10)
            : null;
        if (fact) sayFairyMessage(fact, 'trivia');
    }, FAIRY_TRIVIA_ROTATE_INTERVAL);
}

function buildFairyWidget() {
    // Check if user minimized the fairy chick previously
    const isMinimized = localStorage.getItem('bitzy-fairy-minimized') === 'true';

    const widget = document.createElement('div');
    widget.id = 'fairy-chick-widget';
    widget.className = `fairy-chick-container ${isMinimized ? 'minimized' : ''}`;
    widget.setAttribute('aria-label', 'Easter Fairy Chick Companion');

    widget.innerHTML = `
        <div id="fairy-bubble" class="fairy-bubble hidden" data-variant="greeting" role="status" aria-live="polite">
            <span id="fairy-bubble-icon" class="fairy-bubble-icon" aria-hidden="true"></span>
            <span id="fairy-bubble-text">Peep! I am your Easter Fairy Chick! Hover over me to say hello - I share trivia while you convert!</span>
            <button type="button" id="fairy-bubble-close" class="fairy-bubble-close" aria-label="Close dialog">${icon('close')}</button>
        </div>

        <div id="fairy-avatar-wrap" class="fairy-avatar-wrap" title="Hover to show Fairy">
            <div class="fairy-aura"></div>
            <img src="assets/fairy_chick.png" alt="Easter Fairy Chick with flower crown and star wand" class="fairy-chick-img">
            <span class="fairy-wand-star">${icon('star')}</span>
            <div class="fairy-sparkles" aria-hidden="true"></div>
        </div>
        <button type="button" id="fairy-toggle-btn" class="fairy-toggle-btn" title="Show Fairy">
            ${isMinimized ? icon('chick') : icon('sparkle')}<span class="fairy-toggle-hint">Hover to show Fairy</span>
        </button>
    `;

    document.body.appendChild(widget);
}

/**
 * Makes the fairy chick say something. Every message she speaks goes through here.
 * @param {string} message - The text she says.
 * @param {string} [variant] - greeting | blessing | trivia
 * @param {number} [duration] - Optional override for how long the bubble stays open.
 * @returns {boolean} true when the message was delivered.
 */
function sayFairyMessage(message, variant = 'blessing', duration) {
    if (!fairyRefs || !fairyRefs.bubble || !message) return false;
    const { bubble, bubbleText, bubbleIcon, avatarWrap } = fairyRefs;

    bubbleText.textContent = message;
    bubble.dataset.variant = variant;
    bubble.classList.remove('hidden');

    if (bubbleIcon) {
        bubbleIcon.innerHTML = variant === 'trivia' ? icon('bulb') : icon('sparkle');
    }

    // Trigger magical sparkle shower
    createFairySparkles(avatarWrap);

    // Gentle cute wobble
    if (avatarWrap) {
        avatarWrap.classList.remove('fairy-wobble');
        void avatarWrap.offsetWidth;
        avatarWrap.classList.add('fairy-wobble');
    }

    const ms = duration || FAIRY_BUBBLE_DURATIONS[variant] || FAIRY_BUBBLE_DURATIONS.blessing;
    clearTimeout(window.fairyBubbleTimer);
    // A trivia bubble stays on screen while the Fairy is revealed; the 10s
    // rotation loop replaces it in place. Other messages auto-hide normally.
    if (variant === 'trivia' && fairyRefs.widget && fairyRefs.widget.classList.contains('fairy-active')) {
        return true;
    }
    window.fairyBubbleTimer = setTimeout(() => {
        bubble.classList.add('hidden');
    }, ms);

    return true;
}

/**
 * Delivers a trivia fact through the fairy chick.
 * @param {string} fact
 * @returns {boolean} true when the fairy delivered it, false when she is unavailable.
 */
function showFairyTrivia(fact) {
    if (!fact) return false;
    if (!fairyRefs) initFairyChick();
    if (!fairyRefs || !fairyRefs.widget) return false;
    if (fairyRefs.widget.classList.contains('minimized')) return false;
    return sayFairyMessage(fact, 'trivia');
}

/**
 * Delivers a study blessing through the fairy chick.
 */
function showFairyBlessing(blessing) {
    if (!fairyRefs) initFairyChick();
    return sayFairyMessage(blessing || FAIRY_BLESSINGS[0], 'blessing');
}

function triggerBlessing() {
    fairyBlessingIdx = (fairyBlessingIdx + 1) % FAIRY_BLESSINGS.length;
    sayFairyMessage(FAIRY_BLESSINGS[fairyBlessingIdx], 'blessing');
}

function createFairySparkles(targetEl) {
    if (!targetEl) return;
    for (let i = 0; i < 7; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'fairy-floating-sparkle';
        const name = FAIRY_SPARKLE_ICONS[Math.floor(Math.random() * FAIRY_SPARKLE_ICONS.length)];
        sparkle.innerHTML = icon(name);
        sparkle.style.left = (Math.random() * 60 - 15) + 'px';
        sparkle.style.bottom = (Math.random() * 40 + 20) + 'px';
        sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
        targetEl.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initFairyChick();
});
