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


function checkValues() {
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
        if (runningSum < 0 && !regexOperators.test(inputDisplay.value)) {
            inputDisplay.value = runningSum;
        }
        if (regexOperators.test(inputDisplay.value) && runningSum < 0 && operator === '-') {
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

function handleNumberClick(button) {
    inputDisplay.value += button.value;
    checkValues();
    clearButtonImageToggle();
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
        return inputDisplay.value = runningSum;
    } else if (runningSum === '' && firstNum && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum + actualSecond;
        return inputDisplay.value = runningSum;
    } else {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = runningSum + actualSecond;
        return inputDisplay.value = runningSum;
    }
}

function subtract(firstNum, secondNum) {
    let actualSecond = isPercentage ? firstNum * secondNum / 100 : secondNum;
    if (runningSum === '' && firstNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum - actualSecond;
        return inputDisplay.value = runningSum;
    } else if (runningSum === '' && firstNum && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum - actualSecond;
        return inputDisplay.value = runningSum;
    } else {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = runningSum - actualSecond;
        return inputDisplay.value = runningSum;
    }
}

function multiply(firstNum, secondNum) {
    let actualSecond = isPercentage ? secondNum / 100 : secondNum;
    if (firstNum === '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum * actualSecond;
        return inputDisplay.value = runningSum;
    } else if (runningSum !== '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = runningSum * actualSecond;
        return inputDisplay.value = runningSum;
    } else if (firstNum !== '' && secondNum !== '') {
        expressionDisplay.textContent = `${firstNum}${operator}${secondNum}${isPercentage ? '%' : ''}`;
        runningSum = firstNum * actualSecond;
        return inputDisplay.value = runningSum;
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
        return inputDisplay.value = runningSum;
    } else {
        return inputDisplay.value;
    }
}

function percentage() {
    checkValues();
    if (firstNum !== '' || (operator !== '' && secondNum !== '')) {
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
    if (operator === '' && isPercentage) {
        inputDisplay.value = (parseFloat(firstNum) / 100).toString();
        isPercentage = false;
    } else if (operator === '') {
        inputDisplay.value = inputDisplay.value;
    } else if (operator !== '' && secondNum === '') {
        inputDisplay.value = firstNum;
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
            inputDisplay.value = firstNum + operator;
        }
    } else if (runningSum !== '' && !regexOperators.test(inputDisplay.value)) {
        operator = button.value;
        inputDisplay.value = runningSum + operator;
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
    if (inputDisplay.value === '') {
        return;
    }
    checkValues();
    if (operator === '') {
        firstNum = -firstNum;
        inputDisplay.value = firstNum + (isPercentage ? '%' : '');
    } else if (operator !== '' && secondNum === '') {
        firstNum = -firstNum;
        inputDisplay.value = firstNum + operator;
    } else if (runningSum != '' && !regexOperators.test(inputDisplay.value)) {
        runningSum = -runningSum;
        inputDisplay.value = runningSum;
    } else if (runningSum != '' && regexOperators.test(inputDisplay.value)) {
        if (operator === '+' || operator === '-') {
            operator = operator === '+' ? '-' : '+';
            inputDisplay.value = runningSum + operator + secondNum + (isPercentage ? "%" : '');
        } else {
            secondNum = -secondNum;
            inputDisplay.value = runningSum + operator + secondNum + (isPercentage ? "%" : '');
        }
    } else {
        secondNum = -secondNum;
        inputDisplay.value = firstNum + operator + secondNum + (isPercentage ? '%' : '');
    }
}



positiveNegButton.addEventListener("click", () => handlePositiveNegClick());
