/**
 * BitSeen Student Tools & Features
 * - 8-Bit Interactive Register Playground
 * - Student Exam Cheat Sheet Hub (Powers of 2, Nibbles, Exam Hacks)
 * - Auto-rotating concept carousel (one card at a time)
 */

// --- 8-BIT REGISTER PLAYGROUND ---
let registerBits = [0, 0, 0, 0, 0, 0, 0, 0]; // Index 0 is Bit 7 (128), Index 7 is Bit 0 (1)

const ASCII_CONTROL_NAMES = {
    0: "NUL (Null)", 1: "SOH (Start of Heading)", 2: "STX (Start of Text)", 3: "ETX (End of Text)",
    4: "EOT (End of Trans)", 5: "ENQ (Enquiry)", 6: "ACK (Acknowledge)", 7: "BEL (Bell)",
    8: "BS (Backspace)", 9: "TAB (Horizontal Tab)", 10: "LF (Line Feed / Enter)", 11: "VT (Vertical Tab)",
    12: "FF (Form Feed)", 13: "CR (Carriage Return)", 14: "SO (Shift Out)", 15: "SI (Shift In)",
    16: "DLE (Data Link Escape)", 17: "DC1 (Device Control 1)", 18: "DC2 (Device Control 2)",
    19: "DC3 (Device Control 3)", 20: "DC4 (Device Control 4)", 21: "NAK (Negative Ack)",
    22: "SYN (Synchronous Idle)", 23: "ETB (End of Trans Block)", 24: "CAN (Cancel)",
    25: "EM (End of Medium)", 26: "SUB (Substitute)", 27: "ESC (Escape)", 28: "FS (File Separator)",
    29: "GS (Group Separator)", 30: "RS (Record Separator)", 31: "US (Unit Separator)",
    32: "Space ( ' ' )", 127: "DEL (Delete)"
};

function initRegister() {
    const bitButtons = document.querySelectorAll('.bit-btn');
    if (!bitButtons || bitButtons.length === 0) return;

    bitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'), 10);
            registerBits[index] = registerBits[index] === 0 ? 1 : 0;
            updateRegisterUI();

            const bitWeight = Math.pow(2, 7 - index);
            if (registerBits[index] === 1) {
                setFeedback(`Bit ${7 - index} is ON (+${bitWeight}).`, 'success', 'register');
            } else {
                setFeedback(`Bit ${7 - index} turned OFF (-${bitWeight}).`, 'info', 'register');
            }
        });
    });

    // Preset action buttons
    const clearBtn = document.getElementById('reg-clear-btn');
    const setAllBtn = document.getElementById('reg-set-all-btn');
    const invertBtn = document.getElementById('reg-invert-btn');
    const shiftLeftBtn = document.getElementById('reg-shift-l-btn');
    const shiftRightBtn = document.getElementById('reg-shift-r-btn');
    const randomBtn = document.getElementById('reg-random-btn');
    const sendToConvBtn = document.getElementById('reg-send-conv-btn');

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            registerBits = [0, 0, 0, 0, 0, 0, 0, 0];
            updateRegisterUI();
            setFeedback('Cleared! 00000000 = clean slate.', 'info', 'register');
        });
    }

    if (setAllBtn) {
        setAllBtn.addEventListener('click', () => {
            registerBits = [1, 1, 1, 1, 1, 1, 1, 1];
            updateRegisterUI();
            setFeedback('All bits ON! That is 255, the max 8-bit value.', 'celebrate', 'register');
        });
    }

    if (invertBtn) {
        invertBtn.addEventListener('click', () => {
            registerBits = registerBits.map(b => b === 0 ? 1 : 0);
            updateRegisterUI();
            setFeedback('Bitwise NOT applied! All 0s and 1s flipped.', 'success', 'register');
        });
    }

    if (shiftLeftBtn) {
        shiftLeftBtn.addEventListener('click', () => {
            const dropped = registerBits[0];
            registerBits = [...registerBits.slice(1), 0];
            updateRegisterUI();
            if (dropped === 1) {
                setFeedback('Left shift (<< 1)! The MSB bit 1 overflowed out.', 'warn', 'register');
            } else {
                setFeedback('Left shift (<< 1)! Value doubled.', 'success', 'register');
            }
        });
    }

    if (shiftRightBtn) {
        shiftRightBtn.addEventListener('click', () => {
            registerBits = [0, ...registerBits.slice(0, 7)];
            updateRegisterUI();
            setFeedback('Right shift (>> 1)! Divided by 2 (floored).', 'success', 'register');
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            registerBits = registerBits.map(() => Math.random() > 0.5 ? 1 : 0);
            updateRegisterUI();
            setFeedback('Random byte generated! Let us examine it.', 'celebrate', 'register');
        });
    }

    if (sendToConvBtn) {
        sendToConvBtn.addEventListener('click', () => {
            const unsignedVal = registerBits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);
            const inputValEl = document.getElementById('input-value');
            const inputBaseEl = document.getElementById('input-base');

            if (inputValEl && inputBaseEl) {
                inputBaseEl.value = "10";
                inputValEl.value = unsignedVal.toString();
                inputValEl.dispatchEvent(new Event('input'));
                const convSection = document.getElementById('converter-section');
                if (convSection) convSection.scrollIntoView({ behavior: 'smooth' });
                setFeedback(`Sent ${unsignedVal} to the converter. Open "Show me how" to see the breakdown.`, 'hint', 'register');
            } else {
                // Multi-page redirection to index.html with query parameter
                window.location.href = `index.html?val=${unsignedVal}&base=10`;
            }
        });
    }

    updateRegisterUI();
}

function updateRegisterUI() {
    const bitButtons = document.querySelectorAll('.bit-btn');
    if (!bitButtons || bitButtons.length === 0) return;

    let unsignedVal = 0;
    let sumParts = [];

    bitButtons.forEach(btn => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const bitVal = registerBits[index];
        const weight = Math.pow(2, 7 - index);

        btn.textContent = bitVal.toString();
        if (bitVal === 1) {
            btn.classList.add('bit-active');
            btn.setAttribute('aria-pressed', 'true');
            unsignedVal += weight;
            sumParts.push(weight);
        } else {
            btn.classList.remove('bit-active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });

    // Math equation readout
    const equationEl = document.getElementById('reg-equation');
    if (equationEl) {
        if (sumParts.length === 0) {
            equationEl.innerHTML = `<span>0</span> = <strong>0</strong>`;
        } else {
            equationEl.innerHTML = `${sumParts.join(' + ')} = <strong>${unsignedVal}</strong>`;
        }
    }

    // Unsigned Decimal
    const unsignedEl = document.getElementById('reg-unsigned');
    if (unsignedEl) unsignedEl.textContent = unsignedVal;

    // Signed (Two's Complement)
    // If MSB (Bit 7) is 1, value is unsignedVal - 256
    const msb = registerBits[0];
    const signedVal = msb === 1 ? unsignedVal - 256 : unsignedVal;
    const signedEl = document.getElementById('reg-signed');
    const signedBadge = document.getElementById('reg-signed-badge');
    if (signedEl) signedEl.textContent = signedVal;
    if (signedBadge) {
        if (msb === 1) {
            signedBadge.textContent = "Sign 1 (-)";
            signedBadge.className = "sign-badge badge-negative";
        } else {
            signedBadge.textContent = "Sign 0 (+)";
            signedBadge.className = "sign-badge badge-positive";
        }
    }

    // Hexadecimal (High & Low Nibbles)
    const highNibbleVal = (registerBits[0] * 8) + (registerBits[1] * 4) + (registerBits[2] * 2) + registerBits[3];
    const lowNibbleVal = (registerBits[4] * 8) + (registerBits[5] * 4) + (registerBits[6] * 2) + registerBits[7];
    const hexHigh = highNibbleVal.toString(16).toUpperCase();
    const hexLow = lowNibbleVal.toString(16).toUpperCase();

    const hexFullEl = document.getElementById('reg-hex-full');
    const hexHighEl = document.getElementById('reg-hex-high');
    const hexLowEl = document.getElementById('reg-hex-low');
    if (hexFullEl) hexFullEl.textContent = `0x${hexHigh}${hexLow}`;
    if (hexHighEl) hexHighEl.textContent = `${hexHigh} (${registerBits.slice(0, 4).join('')})`;
    if (hexLowEl) hexLowEl.textContent = `${hexLow} (${registerBits.slice(4).join('')})`;

    // Octal
    const octalEl = document.getElementById('reg-octal');
    if (octalEl) octalEl.textContent = `0o${unsignedVal.toString(8).padStart(3, '0')}`;

    // ASCII Preview
    const asciiEl = document.getElementById('reg-ascii');
    if (asciiEl) {
        if (unsignedVal in ASCII_CONTROL_NAMES) {
            asciiEl.textContent = ASCII_CONTROL_NAMES[unsignedVal].split(' ')[0];
            asciiEl.title = ASCII_CONTROL_NAMES[unsignedVal];
        } else if (unsignedVal >= 33 && unsignedVal <= 126) {
            asciiEl.textContent = `'${String.fromCharCode(unsignedVal)}'`;
            asciiEl.title = `Standard ASCII ${unsignedVal}`;
        } else {
            asciiEl.textContent = `#${unsignedVal}`;
            asciiEl.title = `Extended ASCII #${unsignedVal}`;
        }
    }
}

// --- STUDENT EXAM CHEAT SHEET ---
const POWERS_OF_TWO_DATA = [
    { power: 0, val: 1, hex: "0x1", note: "Minimum nonzero bit" },
    { power: 1, val: 2, hex: "0x2", note: "Even base" },
    { power: 2, val: 4, hex: "0x4", note: "Half a byte nibble (2 bits)" },
    { power: 3, val: 8, hex: "0x8", note: "1 Octal digit max = 7" },
    { power: 4, val: 16, hex: "0x10", note: "1 Nibble (4 bits) / 1 Hex digit" },
    { power: 5, val: 32, hex: "0x20", note: "Standard 32-bit architecture word" },
    { power: 6, val: 64, hex: "0x40", note: "Modern 64-bit CPU registers" },
    { power: 7, val: 128, hex: "0x80", note: "Sign bit in 8-bit Two's Comp (-128)" },
    { power: 8, val: 256, hex: "0x100", note: "1 Full Byte (0-255, 8 bits)" },
    { power: 9, val: 512, hex: "0x200", note: "Classic disk sector size (512B)" },
    { power: 10, val: 1024, hex: "0x400", note: "1 Kibibyte (1 KiB)" },
    { power: 11, val: 2048, hex: "0x800", note: "2 KiB buffer" },
    { power: 12, val: 4096, hex: "0x1000", note: "Standard OS Memory Page Size (4 KiB)" },
    { power: 13, val: 8192, hex: "0x2000", note: "8 KiB cache line" },
    { power: 14, val: 16384, hex: "0x4000", note: "16 KiB block" },
    { power: 15, val: 32768, hex: "0x8000", note: "Max signed 16-bit int (+32,767)" },
    { power: 16, val: 65536, hex: "0x10000", note: "1 Full 16-bit Word (64 KiB ports / addresses)" }
];

const NIBBLE_DATA = [
    { hex: "0", bin: "0000", dec: 0 },
    { hex: "1", bin: "0001", dec: 1 },
    { hex: "2", bin: "0010", dec: 2 },
    { hex: "3", bin: "0011", dec: 3 },
    { hex: "4", bin: "0100", dec: 4 },
    { hex: "5", bin: "0101", dec: 5 },
    { hex: "6", bin: "0110", dec: 6 },
    { hex: "7", bin: "0111", dec: 7 },
    { hex: "8", bin: "1000", dec: 8 },
    { hex: "9", bin: "1001", dec: 9 },
    { hex: "A", bin: "1010", dec: 10 },
    { hex: "B", bin: "1011", dec: 11 },
    { hex: "C", bin: "1100", dec: 12 },
    { hex: "D", bin: "1101", dec: 13 },
    { hex: "E", bin: "1110", dec: 14 },
    { hex: "F", bin: "1111", dec: 15 }
];

function initCheatSheet() {
    renderPowersTable(POWERS_OF_TWO_DATA);

    const searchInput = document.getElementById('powers-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderPowersTable(POWERS_OF_TWO_DATA);
            } else {
                const filtered = POWERS_OF_TWO_DATA.filter(item =>
                    item.power.toString().includes(query) ||
                    item.val.toString().includes(query) ||
                    item.hex.toLowerCase().includes(query) ||
                    item.note.toLowerCase().includes(query)
                );
                renderPowersTable(filtered);
            }
        });
    }

    const nibbleContainer = document.getElementById('nibble-grid');
    if (nibbleContainer) {
        nibbleContainer.innerHTML = NIBBLE_DATA.map(item => `
            <button type="button" class="nibble-card" title="Copy ${item.bin} (decimal ${item.dec})" data-copy="${item.bin}">
                <span class="nibble-hex">${item.hex}</span>
                <span class="nibble-bin">${item.bin}</span>
            </button>
        `).join('');

        nibbleContainer.querySelectorAll('.nibble-card').forEach(card => {
            card.addEventListener('click', () => {
                const val = card.getAttribute('data-copy');
                copyToClipboard(val, `Copied ${val} to clipboard!`);
            });
        });
    }

    const tabs = document.querySelectorAll('.cs-tab-btn');
    const tabPanes = document.querySelectorAll('.cs-tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tabPanes.forEach(p => p.classList.add('hidden'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetId = tab.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.remove('hidden');
        });
    });
}

function renderPowersTable(data) {
    const tableBody = document.getElementById('powers-table-body');
    if (!tableBody) return;

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="table-empty">${icon('search')}<span>No matching power of 2 found</span></td></tr>`;
        return;
    }

    tableBody.innerHTML = data.map(item => `
        <tr>
            <td><strong>2<sup>${item.power}</sup></strong></td>
            <td>${item.val.toLocaleString()}</td>
            <td><code>${item.hex}</code></td>
            <td><button type="button" class="copy-note" data-copy="${item.note}" title="Click to copy">${item.note}</button></td>
        </tr>
    `).join('');

    tableBody.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', (e) => {
            const val = el.getAttribute('data-copy');
            copyToClipboard(val, `Copied ${val} to clipboard!`);
        });
    });
}

function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            setFeedback(successMsg, 'success', 'cheatsheet');
        }).catch(() => fallbackCopy(text, successMsg));
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    setFeedback(successMsg, 'success', 'cheatsheet');
}

// --- ROTATING CONCEPT CAROUSEL ---
const HACK_CAROUSEL_DEFAULT_INTERVAL = 7000;

function initHackCarousel() {
    const carousel = document.getElementById('hack-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.hack-carousel-track');
    const viewport = carousel.querySelector('.hack-carousel-viewport');
    const dotsWrap = carousel.querySelector('.hack-dots');
    const prevBtn = carousel.querySelector('.hack-nav-btn[aria-label^="Previous"]');
    const nextBtn = carousel.querySelector('.hack-nav-btn[aria-label^="Next"]');
    // The play/pause toggle sits beside the section badge, outside the carousel.
    const playBtn = document.getElementById('hack-play-btn');
    const slides = Array.from(carousel.querySelectorAll('.hack-slide'));
    if (!track || !viewport || !dotsWrap || slides.length === 0) return;

    const interval = parseInt(carousel.dataset.interval, 10) || HACK_CAROUSEL_DEFAULT_INTERVAL;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = 0;
    let timer = null;
    let userPaused = false;
    let hovered = false;
    let pageHidden = document.hidden;

    const slideTitle = slide => {
        const label = slide.querySelector('.hack-title span');
        return label ? label.textContent.trim() : '';
    };

    // --- Build the dot indicators ---
    slides.forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hack-dot';
        dot.setAttribute('aria-label', 'Show concept ' + (i + 1) + ' of ' + slides.length + ': ' + slideTitle(slide));
        dot.addEventListener('click', () => goTo(i, true));
        dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    // --- Viewport height follows the tallest visible card so nothing is clipped ---
    const syncHeight = () => {
        const active = slides[index];
        if (active) viewport.style.height = active.offsetHeight + 'px';
    };

    const goTo = (target, resetTimer) => {
        index = (target + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        slides.forEach((slide, i) => slide.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
        syncHeight();
        if (resetTimer) syncTimer();
    };

    const stopTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    const syncTimer = () => {
        stopTimer();
        if (userPaused || hovered || pageHidden || reduceMotion) return;
        timer = setInterval(() => goTo(index + 1, false), interval);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1, true));

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            userPaused = !userPaused;
            playBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
            playBtn.setAttribute('aria-label', userPaused ? 'Resume auto-advance' : 'Pause auto-advance');
            setIcon(playBtn, userPaused ? 'play' : 'pause');
            syncTimer();
        });
    }

    // Pause while the student is reading or interacting with the card
    carousel.addEventListener('mouseenter', () => { hovered = true; stopTimer(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; syncTimer(); });
    carousel.addEventListener('focusin', () => { hovered = true; stopTimer(); });
    carousel.addEventListener('focusout', () => { hovered = false; syncTimer(); });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1, true); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, true); }
    });

    // Pause when the tab is hidden
    document.addEventListener('visibilitychange', () => {
        pageHidden = document.hidden;
        syncTimer();
    });

    window.addEventListener('resize', syncHeight);
    window.addEventListener('load', syncHeight);

    goTo(0, false);
    syncTimer();
}

// --- INIT ALL ON DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    initRegister();
    initCheatSheet();
    initHackCarousel();

    // Smooth scroll only for hash anchors (#)
    const navLinks = document.querySelectorAll('.nav-pill');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }
    });
});
