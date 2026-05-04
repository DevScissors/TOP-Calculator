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

const regexOperators = /(?<=\d)[\+\-x\÷](?=-?\d)/;

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


function checkValues() {
    inputDisplay.scrollLeft = inputDisplay.scrollWidth;
    if (operator === '' && runningSum === '' && secondNum == '') {
        firstNum = parseFloat(inputDisplay.value);
        return;
    }
    if (operator !== '' && runningSum === '' && operator === '-') {
        const evaluationParts = inputDisplay.value.split(regexOperators);
        firstNum = parseFloat(evaluationParts[0].trim());
        secondNum = evaluationParts[1] ? parseFloat(evaluationParts[1].trim()) : '';
        return;
    }
    if (operator !== '' && runningSum === '' && operator !== '-') {
        const evaluationParts = inputDisplay.value.split(operator);
        firstNum = parseFloat(evaluationParts[0].trim());
        secondNum = evaluationParts[1] ? parseFloat(evaluationParts[1].trim()) : '';
        return;
    }
    if (runningSum !== '' && !regexOperators.test(inputDisplay.value)) {
        inputDisplay.value = formatNumberForDisplay(runningSum);
        return;
    }
    if (runningSum !== '' && regexOperators.test(inputDisplay.value) && runningSum < 0 && operator === '-') {
        const evaluationParts = inputDisplay.value.split(/^((?:[^-]*-){1}[^-]*)-/).slice(1);
        firstNum = parseFloat(evaluationParts[0].trim());
        secondNum = evaluationParts[1] ? parseFloat(evaluationParts[1].replace('%', '').trim()) : '';
        return;
    }
    if (runningSum !== '') {
        const evaluationParts = inputDisplay.value.split(regexOperators);
        firstNum = parseFloat(evaluationParts[0].trim());
        secondNum = evaluationParts[1] ? parseFloat(evaluationParts[1].replace('%', '').trim()) : '';
        return;
    }
    return inputDisplay.value;
}

function handleNumberClick(button) {
    if (runningSum !== '' && regexOperators.test(inputDisplay.value)) {
        clearDisplayAndNumberValues();
        inputDisplay.value += button.value;
    } else {
        inputDisplay.value += button.value;
        checkValues();
        clearButtonImageToggle();
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
    expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
    if (runningSum === '') {
        runningSum = firstNum + actualSecond;
    } else {
        runningSum += actualSecond;
    }
    inputDisplay.value = formatNumberForDisplay(runningSum);
}

function subtract(firstNum, secondNum) {
    let actualSecond = isPercentage ? firstNum * secondNum / 100 : secondNum;
    expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
    if (runningSum === '') {
        runningSum = firstNum - actualSecond;
    } else {
        runningSum -= actualSecond;
    }
    inputDisplay.value = formatNumberForDisplay(runningSum);
}

function multiply(firstNum, secondNum) {
    let actualSecond = isPercentage ? secondNum / 100 : secondNum;
    expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
    if (runningSum !== '' || firstNum === '') {
        runningSum = (runningSum || 0) * actualSecond;
    } else {
        runningSum = firstNum * actualSecond;
    }
    inputDisplay.value = formatNumberForDisplay(runningSum);
}

function divide(firstNum, secondNum) {
    let actualSecond = isPercentage ? secondNum / 100 : secondNum;
    if (firstNum === 0 && secondNum !== '') {
        runningSum = 0;
        return inputDisplay.value = runningSum;
    }
    if (runningSum === '' && secondNum === 0) {
        alert("Um, can't divide by 0, nice try!");
        return inputDisplay.value;
    }
    expressionDisplay.textContent = `${firstNum}${operator}${secondNum}`;
    runningSum = firstNum / actualSecond;
    inputDisplay.value = formatNumberForDisplay(runningSum);
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
    if ((runningSum !== '' && isPercentage) || (operator === '' && isPercentage)) {
        expressionDisplay.textContent = `${firstNum}${isPercentage ? '%' : ''}`;
        runningSum = parseFloat(firstNum) / 100;
        firstNum = runningSum;
        inputDisplay.value = formatNumberForDisplay(runningSum);
        isPercentage = false;
        return;
    }
    if (operator === '') {
        return;
    }
    if (operator !== '' && secondNum === '') {
        inputDisplay.value = formatNumberForDisplay(firstNum);
        return;
    }
    if (regexOperators.test(inputDisplay.value) && evaluationParts[1] === '') {
        return;
    }
    operate(operator, firstNum, secondNum);
    clearButtonImageToggle();
    firstNum = runningSum;
    isPercentage = false;
}

equalsButton.addEventListener("click", () => handleEqualsClick());

function handleOperatorClick(button) {
    const evaluationParts = inputDisplay.value.split(operator);
    if (inputDisplay.value === '') return;
    if (firstNum !== '' && operator === '') {
        operator = button.value;
        if (isPercentage) {
            inputDisplay.value = inputDisplay.value + operator;
        } else {
            inputDisplay.value = formatNumberForDisplay(firstNum) + operator;
        }
        return;
    }
    if (runningSum !== '' && !regexOperators.test(inputDisplay.value)) {
        operator = button.value;
        inputDisplay.value = formatNumberForDisplay(runningSum) + operator;
        return;
    }
    if (regexOperators.test(inputDisplay.value) && evaluationParts[1] === '') {
        operator = button.value;
        inputDisplay.value = inputDisplay.value.slice(0, -1) + operator;
        return;
    }
    operate(operator, firstNum, secondNum);
    operator = button.value;
    inputDisplay.value += operator;
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
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.2)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = '';
    })
    button.addEventListener("click", () => handleOperatorClick(button));
})



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
    if (inputDisplay.value === '') return;
    checkValues();
    if (operator === '') {
        firstNum = -firstNum;
        inputDisplay.value = formatNumberForDisplay(firstNum) + (isPercentage ? '%' : '');
        return;
    }
    if (operator !== '' && secondNum === '') {
        firstNum = -firstNum;
        inputDisplay.value = formatNumberForDisplay(firstNum) + operator;
        return;
    }
    if (runningSum === '' && firstNum !== '' && secondNum !== '') {
        if (operator === '+' || operator === '-') {
            operator = operator === '+' ? '-' : '+';
            inputDisplay.value = formatNumberForDisplay(firstNum) + operator + secondNum + (isPercentage ? "%" : '');
        } else {
            secondNum = -secondNum;
            inputDisplay.value = formatNumberForDisplay(firstNum) + operator + secondNum + (isPercentage ? "%" : '');
        }
        return;

    }
    if (runningSum != '' && !regexOperators.test(inputDisplay.value)) {
        runningSum = -runningSum;
        firstNum = runningSum;
        inputDisplay.value = formatNumberForDisplay(runningSum);
        return;
    }
    if (runningSum != '' && regexOperators.test(inputDisplay.value)) {
        if (operator === '+' || operator === '-') {
            operator = operator === '+' ? '-' : '+';
            inputDisplay.value = formatNumberForDisplay(runningSum) + operator + secondNum + (isPercentage ? "%" : '');
        } else {
            secondNum = -secondNum;
            inputDisplay.value = formatNumberForDisplay(runningSum) + operator + secondNum + (isPercentage ? "%" : '');
            return;
        }

    }
    secondNum = -secondNum;
    inputDisplay.value = formatNumberForDisplay(firstNum) + operator + secondNum + (isPercentage ? '%' : '');
}


positiveNegButton.addEventListener("click", () => handlePositiveNegClick());

document.addEventListener('keydown', (event) => {
    const key = event.key;
    handleKeyboardInput(key, event);
});

function handleKeyboardInput(key, event) {
    if (/^[0-9]$/.test(key)) {
        handleNumberClick({ value: key });
        return;
    }
    switch (key) {
        case '+':
            handleOperatorClick({ value: '+' });
            event.preventDefault();
            break;
        case '-':
        case '_':
            handleOperatorClick({ value: '-' });
            event.preventDefault();
            break;
        case '*':
            handleOperatorClick({ value: 'x' });
            event.preventDefault();
            break;
        case '/':
            handleOperatorClick({ value: '÷' });
            event.preventDefault();
            break;
        case 'Enter':
        case '=':
            handleEqualsClick();
            event.preventDefault();
            break;
        case 'Backspace':
            deleteDigit();
            event.preventDefault();
            break;
        case 'Escape':
        case 'c':
        case 'C':
            clearDisplayAndNumberValues();
            event.preventDefault();
            break;
        case '.':
            handleDecimalPointClick(decimalPointButton);
            event.preventDefault();
            break;
        case '%':
            percentage();
            event.preventDefault();
            break;
        case 'Alt':
            handlePositiveNegClick();
            event.preventDefault();
            break;
    }
}