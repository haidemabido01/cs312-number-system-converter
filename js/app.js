document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('bitzy-theme', theme);
    }
    const savedTheme = localStorage.getItem('bitzy-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- Converter Logic (Only runs if elements exist) ---
    const inputValueEl = document.getElementById('input-value');
    const inputBaseEl = document.getElementById('input-base');
    const outputValueEl = document.getElementById('output-value');
    const outputBaseEl = document.getElementById('output-base');

    if (inputValueEl && inputBaseEl && outputValueEl && outputBaseEl) {
        // Switchy speaks after the student pauses, so their bubble never flickers mid-typing
        let triviaTimer = null;

        // Live conversion listeners
        inputValueEl.addEventListener('input', handleConversion);
        inputBaseEl.addEventListener('change', handleConversion);
        outputBaseEl.addEventListener('change', handleConversion);

        // Check URL parameters (e.g. from 8-bit register: ?val=169&base=10)
        const urlParams = new URLSearchParams(window.location.search);
        const valParam = urlParams.get('val');
        const baseParam = urlParams.get('base');
        if (valParam) {
            inputValueEl.value = valParam;
            if (baseParam) inputBaseEl.value = baseParam;
            setTimeout(() => handleConversion(), 50);
        }

        function handleConversion() {
            const value = inputValueEl.value;
            const fromBase = parseInt(inputBaseEl.value, 10);
            const toBase = parseInt(outputBaseEl.value, 10);

            if (value.trim() === '') {
                clearTimeout(triviaTimer);
                outputValueEl.value = '';
                outputValueEl.placeholder = '—';
                inputValueEl.classList.remove('error-border');
                return;
            }

            const validation = typeof validateInput === 'function' ? validateInput(value, fromBase) : { valid: true };

            if (!validation.valid) {
                clearTimeout(triviaTimer);
                outputValueEl.value = 'Invalid input';
                inputValueEl.classList.add('error-border');
                setFeedback(`Not a valid base-${fromBase} digit: ${validation.reason || 'check the characters you typed'}.`, 'error', 'converter');
                return;
            }

            inputValueEl.classList.remove('error-border');

            const converted = typeof convert === 'function' ? convert(value, fromBase, toBase) : value;
            outputValueEl.value = converted;

            if (fromBase === toBase) {
                setFeedback(`Same base, same number: ${converted} in base ${fromBase}.`, 'info', 'converter');
            } else {
                setFeedback(`Converted ${value} (base ${fromBase}) into ${converted} (base ${toBase}).`, 'success', 'converter');
                clearTimeout(triviaTimer);
                triviaTimer = setTimeout(() => {
                    if (typeof showTrivia === 'function' && typeof getTriviaForConversion === 'function') {
                        showTrivia(getTriviaForConversion(value, fromBase, converted, toBase));
                    }
                }, 650);
            }

            // Update steps if panel is open
            const stepsPanel = document.getElementById('steps-panel');
            if (stepsPanel && !stepsPanel.classList.contains('hidden')) {
                updateStepsPanel();
            }
        }

        // --- Steps Panel Logic ---
        const showStepsBtn = document.getElementById('show-steps-btn');
        const stepsPanel = document.getElementById('steps-panel');

        if (showStepsBtn && stepsPanel) {
            showStepsBtn.addEventListener('click', () => {
                if (stepsPanel.classList.contains('hidden')) {
                    stepsPanel.classList.remove('hidden');
                    setFeedback('Here is the full breakdown, step by step.', 'hint', 'converter');
                    updateStepsPanel();
                } else {
                    stepsPanel.classList.add('hidden');
                    handleConversion();
                }
            });
        }

        function updateStepsPanel() {
            if (!stepsPanel) return;
            const value = inputValueEl.value;
            const fromBase = parseInt(inputBaseEl.value, 10);
            const toBase = parseInt(outputBaseEl.value, 10);

            if (value.trim() === '') {
                stepsPanel.innerHTML = '<p>Feed me a number first!</p>';
                return;
            }

            if (typeof explainConversion === 'function') {
                const explanation = explainConversion(value, fromBase, toBase);
                if (!explanation) {
                    stepsPanel.innerHTML = '<p>Fix your number first, then ask again.</p>';
                    return;
                }

                let html = `<h3>${explanation.summary}</h3>`;
                explanation.steps.forEach(step => {
                    html += `<div class="step-block">`;
                    html += `<div class="step-title">${step.title}</div>`;
                    step.lines.forEach(line => {
                        html += `<div class="step-line">${line}</div>`;
                    });
                    html += `</div>`;
                });
                stepsPanel.innerHTML = html;
            }
        }
    }

    // --- ASCII Mode Logic ---
    const asciiDec = document.getElementById('ascii-dec');
    const asciiChar = document.getElementById('ascii-char');
    const asciiBin = document.getElementById('ascii-bin');
    const asciiHex = document.getElementById('ascii-hex');
    const asciiChips = document.querySelectorAll('.ascii-chip');

    let asciiUpdating = false;

    if (asciiDec && asciiChar) {
        asciiDec.addEventListener('input', () => {
            if (asciiUpdating) return;
            asciiUpdating = true;

            let val = parseInt(asciiDec.value, 10);
            if (isNaN(val) || val < 0 || val > 127) {
                asciiChar.value = '';
                if (asciiBin) asciiBin.textContent = '—';
                if (asciiHex) asciiHex.textContent = '—';
                setFeedback('Standard ASCII only covers code points 0 to 127.', 'error', 'ascii');
            } else {
                let char = String.fromCharCode(val);
                asciiChar.value = char;
                updateAsciiReadouts(val);

                let charDisplay = val === 32 ? 'Space' : char;
                setFeedback(`That is '${charDisplay}' - ${val} in decimal, ${val.toString(16).toUpperCase()} in hex.`, 'success', 'ascii');
            }
            asciiUpdating = false;
        });

        asciiChar.addEventListener('input', () => {
            if (asciiUpdating) return;
            asciiUpdating = true;

            let char = asciiChar.value;
            if (char.length > 0) {
                let val = char.charCodeAt(0);
                if (val > 127) {
                    setFeedback('Bitzy only knows standard ASCII (0-127) right now.', 'error', 'ascii');
                    asciiDec.value = '';
                    if (asciiBin) asciiBin.textContent = '—';
                    if (asciiHex) asciiHex.textContent = '—';
                } else {
                    asciiDec.value = val;
                    updateAsciiReadouts(val);
                    let charDisplay = val === 32 ? 'Space' : char;
                    setFeedback(`That is '${charDisplay}' - ${val} in decimal, ${val.toString(16).toUpperCase()} in hex.`, 'success', 'ascii');
                }
            } else {
                asciiDec.value = '';
                if (asciiBin) asciiBin.textContent = '—';
                if (asciiHex) asciiHex.textContent = '—';
            }
            asciiUpdating = false;
        });

        asciiChips.forEach(chip => {
            chip.addEventListener('click', () => {
                let val = chip.getAttribute('data-val');
                asciiDec.value = val;
                asciiDec.dispatchEvent(new Event('input'));
            });
        });

        function updateAsciiReadouts(val) {
            if (asciiBin) asciiBin.textContent = val.toString(2).padStart(8, '0');
            if (asciiHex) asciiHex.textContent = val.toString(16).toUpperCase();
        }
    }
});
