/**
 * Bitzy Toast Notification Engine
 * ---------------------------------------------
 * Every notification in Bitzy is a floating toast. There is no inline status
 * line anywhere in the app.
 *   1. showToast(message, kind, key)  - creates a toast, or updates the toast
 *      that already owns the same `key` so live typing never stacks duplicates.
 *   2. setFeedback(message, kind, key) - the friendly alias used across the app.
 */

const FEEDBACK_KINDS = {
    info: 'info',
    success: 'check',
    error: 'cross',
    warn: 'alert',
    hint: 'bulb',
    celebrate: 'sparkle'
};

const TOAST_DURATION = 2600;
const TOAST_FADE = 250;
const MAX_TOASTS = 3;

function getToastHost() {
    let host = document.getElementById('bz-toast-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'bz-toast-host';
        host.className = 'toast-host';
        host.setAttribute('role', 'status');
        host.setAttribute('aria-live', 'polite');
        document.body.appendChild(host);
    }
    return host;
}

function dismissToast(toast) {
    if (!toast) return;
    if (toast._timer) {
        clearTimeout(toast._timer);
        toast._timer = null;
    }
    if (toast._removeTimer) clearTimeout(toast._removeTimer);
    toast.classList.remove('toast-visible');
    toast._removeTimer = setTimeout(() => toast.remove(), TOAST_FADE);
}

/**
 * Shows a notification toast.
 * @param {string} message - The text to display.
 * @param {string} [kind] - info | success | error | warn | hint | celebrate
 * @param {string} [key] - Optional key. A toast with the same key is updated
 *                         in place instead of a new one being stacked.
 * @returns {HTMLElement} The toast element.
 */
function showToast(message, kind = 'info', key = null) {
    if (!message) return null;

    const host = getToastHost();
    const iconName = FEEDBACK_KINDS[kind] || FEEDBACK_KINDS.info;

    // Same key -> update the live toast instead of stacking a duplicate
    if (key) {
        const existing = host.querySelector(`.toast[data-key="${key}"]`);
        if (existing) {
            existing.className = `toast toast-${kind}`;
            const iconEl = existing.querySelector('.toast-icon');
            if (iconEl) iconEl.innerHTML = icon(iconName, 'toast-icon');
            const textEl = existing.querySelector('.toast-text');
            if (textEl) textEl.textContent = message;
            if (existing._removeTimer) {
                clearTimeout(existing._removeTimer);
                existing._removeTimer = null;
            }
            existing.classList.add('toast-visible');
            if (existing._timer) clearTimeout(existing._timer);
            existing._timer = setTimeout(() => dismissToast(existing), TOAST_DURATION);
            return existing;
        }
    }

    // Keep the stack short
    const stacked = host.querySelectorAll('.toast');
    if (stacked.length >= MAX_TOASTS) {
        dismissToast(stacked[0]);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${kind}`;
    if (key) toast.dataset.key = key;
    toast.innerHTML = `${icon(iconName, 'toast-icon')}<span class="toast-text"></span>`;
    toast.querySelector('.toast-text').textContent = message;
    host.appendChild(toast);

    // Force a reflow while the toast is still hidden so the slide-in animates.
    // (requestAnimationFrame is unreliable in background tabs.)
    void toast.offsetWidth;
    toast.classList.add('toast-visible');

    toast._timer = setTimeout(() => dismissToast(toast), TOAST_DURATION);
    return toast;
}

/**
 * Sends a notification. Every message in the app comes through here.
 * @param {string} message
 * @param {string} [kind] - info | success | error | warn | hint | celebrate
 * @param {string} [key] - Optional key so repeated feedback updates one toast.
 */
function setFeedback(message, kind = 'info', key = null) {
    showToast(message, kind, key);
}
