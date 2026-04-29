const inputDisplay = document.querySelector('.results-input');
const expressionDisplay = document.querySelector('.expression-display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const decimalPointButton = document.querySelector('.decimal-point');
const clearButton = document.querySelector('.clear');
const positiveNegButton = document.querySelector('.positive-negative');
const percentageButton = document.querySelector('.percentage');
const equalsButton = document.querySelector('.operator-equals');

let shouldResetInput = false;

function updateDisplay(value) {
    inputDisplay.value = value;
    inputDisplay.scrollLeft = inputDisplay.scrollWidth;
    updateClearButton();
}

function getExpression() {
    return inputDisplay.value || '';
}

function parseExpression(expression) {
    const match = expression.match(/^(-?\d*\.?\d+%?)([+\-x÷])?(.*)$/);
    return {
        first: match?.[1] || '',
        operator: match?.[2] || '',
        second: match?.[3] || ''
    };
}

function toggleNumber(value) {
    return value.startsWith('-') ? value.slice(1) : '-' + value;
}

function parseNumber(value) {
    if (value.endsWith('%')) {
        const normalized = Number(value.slice(0, -1));
        return Number.isNaN(normalized) ? NaN : normalized / 100;
    }
    return Number(value);
}

function calculate(first, operator, second) {
    const a = parseNumber(first);
    const b = parseNumber(second);

    if (Number.isNaN(a) || Number.isNaN(b)) return null;

    if (second.endsWith('%')) {
        if (operator === '+') {
            return String(a + a * b);
        }
        if (operator === '-') {
            return String(a - a * b);
        }
    }

    switch (operator) {
        case '+':
            return String(a + b);
        case '-':
            return String(a - b);
        case 'x':
            return String(a * b);
        case '÷':
            if (b === 0) {
                alert("Um, can't divide by 0, nice try!");
                return null;
            }
            return String(a / b);
        default:
            return null;
    }
}

function appendDigit(digit) {
    if (shouldResetInput) {
        updateDisplay(digit);
        shouldResetInput = false;
        return;
    }

    const expression = getExpression();
    if (expression === '0') {
        updateDisplay(digit);
    } else {
        updateDisplay(expression + digit);
    }
}

function appendDecimal() {
    const expression = getExpression();
    const { first, operator, second } = parseExpression(expression);

    if (!operator) {
        if (first.includes('.')) return;
        updateDisplay(expression ? expression + '.' : '0.');
        shouldResetInput = false;
        return;
    }

    if (second.includes('.')) return;
    updateDisplay(expression + '.');
}

function setOperator(newOperator) {
    const expression = getExpression();
    const { first, operator, second } = parseExpression(expression);

    if (!first) return;

    if (!operator) {
        if (first.endsWith('%')) {
            const normalizedFirst = parseNumber(first);
            if (Number.isNaN(normalizedFirst)) return;
            updateDisplay(String(normalizedFirst) + newOperator);
            shouldResetInput = false;
            return;
        }

        updateDisplay(first + newOperator);
        shouldResetInput = false;
        return;
    }

    if (!second) {
        updateDisplay(first + newOperator);
        return;
    }

    const result = calculate(first, operator, second);
    if (result === null) return;

    expressionDisplay.textContent = expression;
    updateDisplay(result + newOperator);
    shouldResetInput = false;
}

function handleEquals() {
    const expression = getExpression();
    const { first, operator, second } = parseExpression(expression);

    if (!operator || !second) return;

    const result = calculate(first, operator, second);
    if (result === null) return;

    expressionDisplay.textContent = expression;
    updateDisplay(result);
    shouldResetInput = true;
}

function toggleSign() {
    const expression = getExpression();
    const { first, operator, second } = parseExpression(expression);

    if (!operator) {
        if (!first) return;
        updateDisplay(toggleNumber(first));
        return;
    }

    if (!second) {
        updateDisplay(toggleNumber(first) + operator);
        return;
    }

    if (operator === '+' || operator === '-') {
        const toggled = toggleNumber(second);
        if (toggled.startsWith('-')) {
            const displayOp = operator === '+' ? '-' : '+';
            updateDisplay(first + displayOp + toggled.slice(1));
        } else {
            updateDisplay(first + operator + toggled);
        }
        return;
    }

    updateDisplay(first + operator + toggleNumber(second));
}

function applyPercent() {
    const expression = getExpression();
    const { first, operator, second } = parseExpression(expression);

    if (!operator) {
        if (!first || first.endsWith('%')) return;
        updateDisplay(first + '%');
        return;
    }

    if (!second || second.endsWith('%')) return;
    updateDisplay(first + operator + second + '%');
}

function deleteLastCharacter() {
    const expression = getExpression();
    if (!expression) return;
    updateDisplay(expression.slice(0, -1));
}

function clearAll() {
    expressionDisplay.textContent = '';
    updateDisplay('');
    shouldResetInput = false;
}

function updateClearButton() {
    const deleteLeftIcon = document.createElement('img');
    deleteLeftIcon.style.paddingTop = '5px';
    deleteLeftIcon.style.paddingRight = '5px';
    deleteLeftIcon.src = './images/delete-left-icon.png';

    if (getExpression() === '') {
        clearButton.textContent = 'AC';
        if (clearButton.contains(deleteLeftIcon)) {
            clearButton.removeChild(deleteLeftIcon);
        }
        return;
    }

    clearButton.textContent = '';
    if (!clearButton.querySelector('img')) {
        clearButton.appendChild(deleteLeftIcon);
    }
}

function addButtonEffects(button, brightness) {
    button.addEventListener('mousedown', () => {
        button.style.filter = `brightness(${brightness})`;
    });
    button.addEventListener('mouseup', () => {
        button.style.filter = '';
    });
    button.addEventListener('mouseout', () => {
        button.style.filter = '';
    });
}

numberButtons.forEach((button) => {
    addButtonEffects(button, 3);
    button.addEventListener('click', () => appendDigit(button.value));
});

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

clearButton.addEventListener('mousedown', () => {
    clearTimer = setTimeout(() => {
        clearAll();
    }, longPressDuration);
});

clearButton.addEventListener('mouseup', () => {
    if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
    }
    if (getExpression()) {
        deleteLastCharacter();
    } else {
        clearAll();
    }
});

clearButton.addEventListener('mouseout', () => {
    if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
    }
});

clearAll();
