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

function showTrivia(factText) {
    if (!factText) return;

    if (typeof showSwitchyTrivia === 'function' && showSwitchyTrivia(factText)) {
        return;
    }

    if (typeof setFeedback === 'function') {
        setFeedback(factText, 'hint', 'trivia');
    }
}

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

const switchyData = buildSwitchyData();

function buildSwitchyData() {
    const seen = new Set();
    const entries = [
        ...CONTEXT_TRIVIA.map(rule => ({ category: 'TRIVIA', text: rule.text })),
        ...FALLBACK_TRIVIA.map(text => ({ category: 'TRIVIA', text })),
        ...SWITCHY_STUDY_TIPS.map(text => ({ category: 'STUDY TIP', text })),
        ...SWITCHY_CHEERS.map(text => ({ category: 'CHEER', text }))
    ];

    return entries.filter(entry => {
        if (seen.has(entry.text)) return false;
        seen.add(entry.text);
        return true;
    });
}

window.switchyData = switchyData;
