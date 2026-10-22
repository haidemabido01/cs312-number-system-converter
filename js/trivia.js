/**
 * Bitzy Trivia Engine
 * ---------------------------------------------
 * The Easter Fairy Chick is the only place trivia is ever shown. This file
 * picks the right fact for the current conversion; fairy.js says it out loud.
 */

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
 * Hands a trivia fact to the Easter Fairy Chick, who says it in her bubble.
 * If the chick is minimized or unavailable, the fact falls back to a toast
 * so no trivia is ever silently dropped.
 * @param {string} factText
 */
function showTrivia(factText) {
    if (!factText) return;

    if (typeof showFairyTrivia === 'function' && showFairyTrivia(factText)) {
        return;
    }

    if (typeof setFeedback === 'function') {
        setFeedback(factText, 'hint', 'trivia');
    }
}

