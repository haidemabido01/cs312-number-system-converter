/**
 * BitSeen Core Conversion Engine
 * Pure number system conversion logic
 */

/**
 * Checks if a value is a valid number in the given base
 * @param {string} value 
 * @param {number} base 
 * @returns {object} { valid: boolean, reason?: string }
 */
function validateInput(value, base) {
    if (typeof value !== 'string') return { valid: false, reason: "Input must be a string" };
    value = value.trim();
    if (value === '') return { valid: false, reason: "Empty input" };
    
    if (base < 2 || base > 36) return { valid: false, reason: "Base must be between 2 and 36" };
    
    let isNegative = value.startsWith('-');
    let numStr = isNegative ? value.slice(1) : value;
    
    if (numStr === '') return { valid: false, reason: "Empty number after minus sign" };
    
    let parts = numStr.split('.');
    if (parts.length > 2) return { valid: false, reason: "Multiple decimal points" };
    if (parts.length === 2 && parts[0] === '' && parts[1] === '') return { valid: false, reason: "Invalid decimal format" };
    
    for (let i = 0; i < parts.length; i++) {
        for (let j = 0; j < parts[i].length; j++) {
            let char = parts[i][j].toUpperCase();
            let val = getDigitValue(char);
            if (val === null) return { valid: false, reason: `Invalid character '${char}'` };
            if (val >= base) return { valid: false, reason: `Digit '${char}' is not valid in base ${base}` };
        }
    }
    
    return { valid: true };
}

/**
 * Converts any character (0-9, A-Z) to its numeric value (0-35)
 * @param {string} char 
 * @returns {number|null}
 */
function getDigitValue(char) {
    const code = char.toUpperCase().charCodeAt(0);
    if (code >= 48 && code <= 57) { // 0-9
        return code - 48;
    }
    if (code >= 65 && code <= 90) { // A-Z
        return code - 65 + 10;
    }
    return null;
}

/**
 * Converts a numeric value (0-35) to its character (0-9, A-Z)
 * @param {number} value 
 * @returns {string|null}
 */
function getDigitChar(value) {
    if (value >= 0 && value <= 9) {
        return String.fromCharCode(value + 48);
    }
    if (value >= 10 && value <= 35) {
        return String.fromCharCode(value - 10 + 65);
    }
    return null;
}

/**
 * Converts a valid string representation of a number in fromBase to a JS decimal number
 * @param {string} value 
 * @param {number} fromBase 
 * @returns {number}
 */
function toDecimal(value, fromBase) {
    let isNegative = value.trim().startsWith('-');
    let numStr = isNegative ? value.trim().slice(1) : value.trim();
    
    let parts = numStr.split('.');
    let wholePart = parts[0];
    let fractionPart = parts.length > 1 ? parts[1] : '';
    
    let decimalValue = 0;
    
    // Whole part
    for (let i = 0; i < wholePart.length; i++) {
        let digitVal = getDigitValue(wholePart[i]);
        decimalValue += digitVal * Math.pow(fromBase, wholePart.length - 1 - i);
    }
    
    // Fraction part
    for (let i = 0; i < fractionPart.length; i++) {
        let digitVal = getDigitValue(fractionPart[i]);
        decimalValue += digitVal * Math.pow(fromBase, -(i + 1));
    }
    
    return isNegative ? -decimalValue : decimalValue;
}

/**
 * Converts a JS decimal number to a string representation in toBase
 * @param {number} decimalValue 
 * @param {number} toBase 
 * @returns {string}
 */
function fromDecimal(decimalValue, toBase) {
    if (decimalValue === 0) {
        return Object.is(decimalValue, -0) ? "-0" : "0";
    }
    
    let isNegative = decimalValue < 0 || Object.is(decimalValue, -0);
    let absValue = Math.abs(decimalValue);
    
    let wholePart = Math.floor(absValue);
    let fractionPart = absValue - wholePart;
    
    let wholeStr = '';
    if (wholePart === 0) {
        wholeStr = '0';
    } else {
        let temp = wholePart;
        while (temp > 0) {
            let remainder = temp % toBase;
            wholeStr = getDigitChar(remainder) + wholeStr;
            temp = Math.floor(temp / toBase);
        }
    }
    
    let fractionStr = '';
    if (fractionPart > 0) {
        fractionStr = '.';
        let temp = fractionPart;
        let digits = 0;
        let MAX_FRACTION_DIGITS = 10;
        
        while (temp > 0 && digits < MAX_FRACTION_DIGITS) {
            temp *= toBase;
            let intPart = Math.floor(temp);
            fractionStr += getDigitChar(intPart);
            temp -= intPart;
            digits++;
            
            // Break early if we're dealing with floating point precision issues
            if (Math.abs(temp) < 1e-10) break;
        }
        
        // Trim trailing zeros in fraction
        while (fractionStr.endsWith('0')) {
            fractionStr = fractionStr.slice(0, -1);
        }
        if (fractionStr === '.') {
            fractionStr = '';
        }
    }
    
    return (isNegative ? '-' : '') + wholeStr + fractionStr;
}

/**
 * Converts a number string from one base to another
 * @param {string} value 
 * @param {number} fromBase 
 * @param {number} toBase 
 * @returns {string|null}
 */
function convert(value, fromBase, toBase) {
    const validation = validateInput(value, fromBase);
    if (!validation.valid) {
        return null;
    }
    
    const decimalValue = toDecimal(value, fromBase);
    return fromDecimal(decimalValue, toBase);
}

/**
 * Returns a friendly name for the base
 * @param {number} base 
 * @returns {string}
 */
function getBaseName(base) {
    switch (base) {
        case 2: return "Binary";
        case 8: return "Octal";
        case 10: return "Decimal";
        case 16: return "Hexadecimal";
        default: return `Base-${base}`;
    }
}

function explainToDecimal(value, fromBase) {
    let steps = [];
    let isNegative = value.trim().startsWith('-');
    let numStr = isNegative ? value.trim().slice(1) : value.trim();
    let parts = numStr.split('.');
    let wholePart = parts[0];
    let fractionPart = parts.length > 1 ? parts[1] : '';
    
    let lines = [];
    if (isNegative) lines.push("Note: We'll calculate the positive value first, then add the minus sign back.");
    
    let expressionParts = [];
    let lineByLine = [];
    let sumValues = [];
    let totalDecimal = 0;
    
    for (let i = 0; i < wholePart.length; i++) {
        let char = wholePart[i];
        let digitVal = getDigitValue(char);
        let pos = wholePart.length - 1 - i;
        let weight = Math.pow(fromBase, pos);
        let val = digitVal * weight;
        totalDecimal += val;
        
        expressionParts.push(`${digitVal}×${fromBase}^${pos}`);
        lineByLine.push(`${char} (value ${digitVal}) × ${weight} = ${val}`);
        sumValues.push(val);
    }
    
    if (fractionPart) {
        for (let i = 0; i < fractionPart.length; i++) {
            let char = fractionPart[i];
            let digitVal = getDigitValue(char);
            let pos = -(i + 1);
            let weight = Math.pow(fromBase, pos);
            let val = digitVal * weight;
            totalDecimal += val;
            
            expressionParts.push(`${digitVal}×${fromBase}^(${pos})`);
            lineByLine.push(`${char} (value ${digitVal}) × ${weight} = ${val}`);
            sumValues.push(val);
        }
    }
    
    lines.push(`Equation: ${expressionParts.join(' + ')}`);
    lines.push(...lineByLine);
    lines.push(`Sum: ${sumValues.join(' + ')} = ${totalDecimal}`);
    
    if (isNegative) lines.push(`Re-apply the minus sign: -${totalDecimal}`);
    
    steps.push({
        title: `Converting ${value} from base ${fromBase} to decimal (base 10)`,
        lines: lines
    });
    return steps;
}

function explainFromDecimal(decimalValue, toBase) {
    let steps = [];
    let lines = [];
    
    if (decimalValue === 0) {
        steps.push({ title: `Converting 0 to base ${toBase}`, lines: ["Zero is always just 0! Easy peasy!"] });
        return steps;
    }
    
    let isNegative = decimalValue < 0 || Object.is(decimalValue, -0);
    if (isNegative) lines.push("Note: We'll calculate the positive value first, then add the minus sign back.");
    
    let absValue = Math.abs(decimalValue);
    let wholePart = Math.floor(absValue);
    let fractionPart = absValue - wholePart;
    
    let wholeStr = '';
    if (wholePart === 0) {
        lines.push(`Whole part is 0, so the result starts with 0.`);
        wholeStr = '0';
    } else {
        lines.push(`--- Whole Part Conversion ---`);
        lines.push(`Repeatedly divide by ${toBase} and collect remainders:`);
        let temp = wholePart;
        while (temp > 0) {
            let remainder = temp % toBase;
            let quotient = Math.floor(temp / toBase);
            let char = getDigitChar(remainder);
            lines.push(`${temp} ÷ ${toBase} = ${quotient} remainder ${remainder} (digit '${char}')`);
            wholeStr = char + wholeStr;
            temp = quotient;
        }
        lines.push(`Read remainders from bottom to top to get ${wholeStr}`);
    }
    
    let fractionStr = '';
    if (fractionPart > 0) {
        lines.push(`--- Fraction Part Conversion ---`);
        lines.push(`Repeatedly multiply by ${toBase} and take the integer parts:`);
        fractionStr = '.';
        let temp = fractionPart;
        let digits = 0;
        let intParts = [];
        
        while (temp > 0 && digits < 10) {
            let nextTemp = temp * toBase;
            let intPart = Math.floor(nextTemp);
            let char = getDigitChar(intPart);
            lines.push(`${temp} × ${toBase} = ${nextTemp} -> take ${intPart} (digit '${char}')`);
            fractionStr += char;
            intParts.push(char);
            temp = nextTemp - intPart;
            digits++;
            if (Math.abs(temp) < 1e-10) break;
        }
        lines.push(`Read integers from top to bottom to get .${intParts.join('')}`);
    }
    
    let finalRes = (isNegative ? '-' : '') + wholeStr + fractionStr;
    lines.push(`Final result: ${finalRes}`);
    
    steps.push({
        title: `Converting ${isNegative ? '-' : ''}${absValue} to base ${toBase}`,
        lines: lines
    });
    return steps;
}

function explainConversion(value, fromBase, toBase) {
    const validation = validateInput(value, fromBase);
    if (!validation.valid) return null;
    
    let isNeg = value.trim().startsWith('-');
    let normValue = isNeg ? '-' + value.trim().slice(1).toUpperCase() : value.trim().toUpperCase();
    
    let steps = [];
    if (fromBase === toBase) {
        steps.push({
            title: `Converting from base ${fromBase} to base ${toBase}`,
            lines: ["Same base, same number! No math needed here."]
        });
        return { steps: steps, summary: `${normValue} in base ${fromBase} = ${normValue} in base ${toBase}` };
    }
    
    let decimalValue = toDecimal(value, fromBase);
    
    if (fromBase === 10) {
        steps = explainFromDecimal(decimalValue, toBase);
    } else if (toBase === 10) {
        steps = explainToDecimal(value, fromBase);
    } else {
        let step1 = explainToDecimal(value, fromBase);
        step1[0].title = `Step 1: ` + step1[0].title;
        steps.push(...step1);
        
        let step2 = explainFromDecimal(decimalValue, toBase);
        step2[0].title = `Step 2: ` + step2[0].title;
        steps.push(...step2);
        
        if ((fromBase === 2 && toBase === 16) || (fromBase === 16 && toBase === 2)) {
            steps.push({ title: "Shortcut", lines: ["Since 16 is 2 to the 4th, you can directly convert between Binary and Hexadecimal by grouping binary digits into sets of 4!"] });
        }
        if ((fromBase === 2 && toBase === 8) || (fromBase === 8 && toBase === 2)) {
            steps.push({ title: "Shortcut", lines: ["Since 8 is 2 to the 3rd, you can directly convert between Binary and Octal by grouping binary digits into sets of 3!"] });
        }
    }
    
    return {
        steps: steps,
        summary: `${normValue} in ${getBaseName(fromBase)} = ${fromDecimal(decimalValue, toBase)} in ${getBaseName(toBase)}`
    };
}

// Test cases:
// console.log(toDecimal("1011", 2) === 11);
// console.log(fromDecimal(255, 16) === "FF");
// console.log(convert("10.1", 2, 10) === "2.5");
// console.log(convert("FF", 16, 2) === "11111111");
// console.log(convert("-101", 2, 10) === "-5");
