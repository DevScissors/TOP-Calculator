const numberButtons = document.querySelectorAll(".number");
const equalsButton = document.querySelector(".operator-equals");
const expressionDisplay = document.querySelector(".expression-display");
const inputDisplay = document.querySelector(".results-input");
const clearButton = document.querySelector('.clear');
const positiveNegButton = document.querySelector(".positive-negative");
const miscButtons = document.querySelectorAll(".misc");
const operatorButtons = document.querySelectorAll(".operator");
const decimalPointButton = document.querySelector(".decimal-point");

let firstNum = '';
let secondNum = '';
let operator = '';
let runningSum = '';
let isPercentage = false;
expressionDisplay.textContent = '';

const regexOperators = /[^-][+\-x\÷]/;

function formatNumberForDisplay(num) {
    let str = num.toString();
    let decimals = 10;

    // Check if the initial string exceeds the display width
    while (str.length > 15 && decimals > 0) {
        const rounded = parseFloat(num.toFixed(decimals));
        str = rounded.toString();
        decimals--;
    }

    // If still too long, use exponential notation
    if (str.length > 15) {
        str = num.toExponential(5);
    }

    return str;
}

const MAX_DIGITS = 12;
let shouldResetInput = false;

function getExpression() {
    return inputDisplay.value || '';
}

function countDigits(value) {
    return (value.match(/[0-9]/g) || []).length;
}

function roundString(value, maxDigits) {
    const sign = value.startsWith('-') ? '-' : '';
    const normalized = sign ? value.slice(1) : value;
    if (normalized.includes('e')) return value;

    const [integerPart, fractionPart = ''] = normalized.split('.');
    const integerDigits = integerPart.replace(/^0+/, '').length || 1;
    if (integerDigits >= maxDigits) {
        const trimmed = integerPart.slice(0, maxDigits);
        const nextDigit = integerPart.charAt(maxDigits);
        if (nextDigit >= '5') {
            let rounded = BigInt(trimmed) + 1n;
            const roundedStr = rounded.toString();
            return sign + roundedStr.slice(0, maxDigits);
        }
        return sign + trimmed;
    }

    const allowedFraction = maxDigits - integerPart.length;
    if (fractionPart.length <= allowedFraction) {
        return value;
    }

    const keepFraction = fractionPart.slice(0, allowedFraction);
    const nextDigit = fractionPart.charAt(allowedFraction);
    if (nextDigit >= '5') {
        let combined = integerPart + keepFraction;
        let carryIndex = combined.length - 1;
        let rounded = combined.split('');
        while (carryIndex >= 0) {
            if (rounded[carryIndex] === '9') {
                rounded[carryIndex] = '0';
                carryIndex -= 1;
                continue;
            }
            rounded[carryIndex] = String(Number(rounded[carryIndex]) + 1);
            break;
        }
        if (carryIndex < 0) {
            rounded.unshift('1');
        }
        const roundedStr = rounded.join('');
        const integerLen = integerPart.length + (carryIndex < 0 ? 1 : 0);
        const newInteger = roundedStr.slice(0, integerLen);
        const newFraction = roundedStr.slice(integerLen);
        return sign + (newFraction ? `${newInteger}.${newFraction}` : newInteger);
    }

    return sign + (allowedFraction ? `${integerPart}.${keepFraction}` : integerPart);
}

function trimTrailingZeros(value) {
    let suffix = '';
    if (value.endsWith('%')) {
        suffix = '%';
        value = value.slice(0, -1);
    }
    if (value.includes('e')) {
        return value + suffix;
    }
    if (value.endsWith('.')) {
        return value + suffix;
    }
    if (!value.includes('.')) {
        return value + suffix;
    }

    const [integerPart, fractionPart] = value.split('.');
    const trimmedFraction = fractionPart.replace(/0+$/, '');
    if (!trimmedFraction) {
        return integerPart + suffix;
    }
    return `${integerPart}.${trimmedFraction}${suffix}`;
}

function formatResult(value) {
    value = trimTrailingZeros(value);
    const digits = countDigits(value);
    if (digits <= MAX_DIGITS) return value;
    return trimTrailingZeros(roundString(value, MAX_DIGITS));
}

function updateDisplay(value) {
    inputDisplay.value = value;
    inputDisplay.scrollLeft = inputDisplay.scrollWidth;
    if (operator === '' && runningSum === '' && secondNum == '') {
        firstNum = parseFloat(inputDisplay.value);
    } else if (operator !== '' && runningSum === '') {
        const evaluationParts = inputDisplay.value.split(operator);
        firstNum = parseFloat(evaluationParts[0].trim());
        if (evaluationParts[1] === '') {
            secondNum = '';
        } else {
            secondNum = parseFloat(evaluationParts[1].trim());
        }
    } else if (runningSum !== '') {
        if (!regexOperators.test(inputDisplay.value)) {
            inputDisplay.value = formatNumberForDisplay(runningSum);
        }
        else if (regexOperators.test(inputDisplay.value) && runningSum < 0 && operator === '-') {
            const evaluationParts = inputDisplay.value.split(/^((?:[^-]*-){1}[^-]*)-/).slice(1);
            firstNum = parseFloat(evaluationParts[0].trim());
            if (evaluationParts[1] === '') {
                secondNum = '';
            } else {
                secondNum = parseFloat(evaluationParts[1].replace('%', '').trim());
            }
        } else {
            const evaluationParts = inputDisplay.value.split(/(?<!^)[+\-x÷]/);
            firstNum = parseFloat(evaluationParts[0].trim());
            if (evaluationParts[1] === '') {
                secondNum = '';
            } else {
                secondNum = parseFloat(evaluationParts[1].replace('%', '').trim());
            }
        }
    } else {
        return inputDisplay.value;
    }
}

function appendDigit(digit) {
    const expression = getExpression();
    if (countDigits(expression) >= MAX_DIGITS) return;

    if (shouldResetInput) {
        updateDisplay(digit);
        shouldResetInput = false;
        return;
    }

    if (expression === '0') {
        updateDisplay(digit);
    } else {
        updateDisplay(expression + digit);
    }
}

numberButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(3)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = '';
    })
    button.addEventListener("click", () => handleNumberClick(button));
})

function add(firstNum, secondNum) {
    let actualSecond = isPercentage ? firstNum * secondNum / 100 : secondNum;
    if (runningSum === '' && firstNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum + actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else if (runningSum === '' && firstNum && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum + actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = runningSum + actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    }
}

function subtract(firstNum, secondNum) {
    let actualSecond = isPercentage ? firstNum * secondNum / 100 : secondNum;
    if (runningSum === '' && firstNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum - actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else if (runningSum === '' && firstNum && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum - actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = runningSum - actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    }
}

function multiply(firstNum, secondNum) {
    let actualSecond = isPercentage ? secondNum / 100 : secondNum;
    if (firstNum === '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum * actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else if (runningSum !== '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = runningSum * actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else if (firstNum !== '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum * actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else {
        return inputDisplay.value;
    }
}

function divide(firstNum, secondNum) {
    let actualSecond = isPercentage ? secondNum / 100 : secondNum;
    operator = "÷";
    if (firstNum === '' && secondNum !== '') {
        return alert("0 divided by anything is 0");
    } else if (runningSum === '' && secondNum === '') {
        return alert("Um, can't divide by 0, nice try!");
    } else if (firstNum !== '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}`;
        runningSum = firstNum / actualSecond;
        return inputDisplay.value = formatNumberForDisplay(runningSum);
    } else {
        return inputDisplay.value;
    }
}

function percentage() {
    checkValues();
    if (runningSum !== '' && operator === '') {
        runningSum = parseFloat(firstNum) / 100;
        firstNum = runningSum;
        inputDisplay.value = formatNumberForDisplay(runningSum);
        isPercentage = false;
    } else if (firstNum !== '' || (operator !== '' && secondNum !== '')) {
        isPercentage = true;
        inputDisplay.value += "%";
    }
}


function operate(operator, firstNum, secondNum) {
    switch (operator) {
        case "+":
            operator = "+";
            add(firstNum, secondNum);
            break;
        case "-":
            operator = "-";
            subtract(firstNum, secondNum);
            break;
        case "x":
            operator = "x";
            multiply(firstNum, secondNum);
            break;
        case "÷":
            operator = "÷"
            divide(firstNum, secondNum);
            break;
        default:
            operator = '';
    }
    return operator;
}

function handleEqualsClick() {
    checkValues();
    const evaluationParts = inputDisplay.value.split(operator);
    if ((runningSum !== '' && isPercentage) || operator === '' && isPercentage) {
        expressionDisplay.textContent = `${firstNum}${isPercentage ? '%' : ''}`;
        runningSum = parseFloat(firstNum) / 100;
        firstNum = runningSum;
        inputDisplay.value = formatNumberForDisplay(runningSum);
        isPercentage = false;
    } else if (operator === '') {
        inputDisplay.value = inputDisplay.value;
    } else if (operator !== '' && secondNum === '') {
        inputDisplay.value = formatNumberForDisplay(firstNum);
    } else if (regexOperators.test(inputDisplay.value) && evaluationParts[1] === '') {
        inputDisplay.value = inputDisplay.value;
    } else {
        operate(operator, firstNum, secondNum);
        clearButtonImageToggle();
        firstNum = runningSum;
        isPercentage = false;
    }
}

equalsButton.addEventListener("click", () => handleEqualsClick());

function handleOperatorClick(button) {
    const evaluationParts = inputDisplay.value.split(operator);
    if (inputDisplay.value === '') {
        inputDisplay.value = '';
    } else if (firstNum !== '' && operator === '') {
        operator = button.value;
        if (isPercentage) {
            inputDisplay.value = inputDisplay.value + operator;
        } else {
            inputDisplay.value = formatNumberForDisplay(firstNum) + operator;
        }
    } else if (runningSum !== '' && !regexOperators.test(inputDisplay.value)) {
        operator = button.value;
        inputDisplay.value = formatNumberForDisplay(runningSum) + operator;
    } else if (regexOperators.test(inputDisplay.value) && evaluationParts[1] === '') {
        operator = button.value;
        inputDisplay.value = inputDisplay.value.slice(0, -1) + operator;
    } else {
        operate(operator, firstNum, secondNum);
        operator = button.value;
        inputDisplay.value = inputDisplay.value + operator;
    }
}


function clearDisplayAndNumberValues() {
    inputDisplay.value = '';
    expressionDisplay.textContent = '';
    runningSum = '';
    firstNum = '';
    secondNum = '';
    operator = '';
    isPercentage = false;
}

if (inputDisplay.value !== '') {
    firstNum = inputDisplay.value;
}

let timer;
const longPress = 800;
clearButton.addEventListener('click', () => {
    if (expressionDisplay.textContent !== '') {
        clearDisplayAndNumberValues();

    }
})
clearButton.addEventListener("mousedown", () => {
    timer = setTimeout(() => {
        clearDisplayAndNumberValues();
        clearButton.textContent = "AC";
        clearButtonImageToggle();
    }, longPress)
})

clearButton.addEventListener("mouseup", () => {
    clearTimeout(timer);
    if (inputDisplay.value !== '') {
        deleteDigit();
        clearButtonImageToggle();
    }
})

clearButton.addEventListener("mouseout", () => {
    clearTimeout(timer);
})


const clearButtonImageToggle = () => {
    const deleteLeftIcon = document.createElement("img");

    deleteLeftIcon.style.paddingTop = "5px";
    deleteLeftIcon.style.paddingRight = "5px";
    deleteLeftIcon.src = "./images/delete-left-icon.png";

    if (inputDisplay.value == '' || expressionDisplay.textContent !== '') {
        clearButton.textContent = "AC";
    } else if (inputDisplay.value !== '') {
        clearButton.textContent = '';
        clearButton.appendChild(deleteLeftIcon);
    } else {
        clearButton.textContent = "AC";
    }
}

clearButtonImageToggle();

function deleteDigit() {
    if (inputDisplay.value !== '') {
        inputDisplay.value = inputDisplay.value.slice(0, -1);
    }
    if (!regexOperators.test(inputDisplay.value)) {
        operator = '';
        secondNum = '';
    }
    checkValues();
}


operatorButtons.forEach((button) => {
    addButtonEffects(button, 1.2);
    button.addEventListener('click', () => setOperator(button.value));
});

decimalPointButton.addEventListener('click', () => appendDecimal());
percentageButton.addEventListener('click', () => applyPercent());
positiveNegButton.addEventListener('click', () => toggleSign());
equalsButton.addEventListener('click', () => handleEquals());

let clearTimer = null;
const longPressDuration = 800;

function handleDecimalPointClick(decimalPointButton) {
    checkValues();
    if (!Number.isInteger(firstNum) && secondNum === '') {
        inputDisplay.value = firstNum;
    } else if (secondNum !== '' && !Number.isInteger(secondNum)) {
        inputDisplay.value = firstNum + operator + secondNum;
    } else {
        inputDisplay.value += decimalPointButton.value;
    }
}



decimalPointButton.addEventListener("click", () => handleDecimalPointClick(decimalPointButton));




miscButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.5)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = '';
    })
    if (button.value === "%") {
        button.addEventListener("click", () => percentage())
    } else {
        return button.value;
    }
})

function handlePositiveNegClick() {
    if (inputDisplay.value === '') {
        return;
    }
    checkValues();
    if (operator === '') {
        firstNum = -firstNum;
        inputDisplay.value = formatNumberForDisplay(firstNum) + (isPercentage ? '%' : '');
    } else if (operator !== '' && secondNum === '') {
        firstNum = -firstNum;
        inputDisplay.value = formatNumberForDisplay(firstNum) + operator;
    } else if (runningSum != '' && !regexOperators.test(inputDisplay.value)) {
        runningSum = -runningSum;
        inputDisplay.value = formatNumberForDisplay(runningSum);
    } else if (runningSum != '' && regexOperators.test(inputDisplay.value)) {
        if (operator === '+' || operator === '-') {
            operator = operator === '+' ? '-' : '+';
            inputDisplay.value = formatNumberForDisplay(runningSum) + operator + secondNum + (isPercentage ? "%" : '');
        } else {
            secondNum = -secondNum;
            inputDisplay.value = formatNumberForDisplay(runningSum) + operator + secondNum + (isPercentage ? "%" : '');
        }
    } else {
        secondNum = -secondNum;
        inputDisplay.value = formatNumberForDisplay(firstNum) + operator + secondNum + (isPercentage ? '%' : '');
    }
}

positiveNegButton.addEventListener("click", () => handlePositiveNegClick());

document.addEventListener('keydown', (event) => {
    const key = event.key;
    handleKeyboardInput(key, event);
});

function handleKeyboardInput(key, event) {
    // Number keys 0-9
    if (/^[0-9]$/.test(key)) {
        handleNumberClick({ value: key });
    }
    // Operators
    else if (key === '+') {
        handleOperatorClick({ value: '+' });
        event.preventDefault();
    }
    else if (key === '-' || key === '_') {
        handleOperatorClick({ value: '-' });
        event.preventDefault();
    }
    else if (key === '*') {
        handleOperatorClick({ value: 'x' });
        event.preventDefault();
    }
    else if (key === '/') {
        handleOperatorClick({ value: '÷' });
        event.preventDefault();
    }
    // Equals
    else if (key === 'Enter' || key === '=') {
        handleEqualsClick();
        event.preventDefault();
    }
    // Backspace/Delete
    else if (key === 'Backspace') {
        deleteDigit();
        event.preventDefault();
    }
    // Clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplayAndNumberValues();
        event.preventDefault();
    }
    // Decimal point
    else if (key === '.') {
        handleDecimalPointClick(decimalPointButton);
        event.preventDefault();
    }
    // Percentage
    else if (key === '%') {
        percentage();
        event.preventDefault();
    }
    // Toggle sign
    else if (key === 'Alt') {
        handlePositiveNegClick();
        event.preventDefault();
    }
}
