let firstNum = 0;
let secondNum = '';
let operator = '';
let runningSum = 0;


function checkValues() {
    if (operator === '') {
        firstNum = inputDisplay.value;
    } else if (operator != '' && secondNum === '') {
        const evaluationParts = inputDisplay.value.split(operator);
        secondNum = evaluationParts[1];
    } else if (operator != '' && secondNum != '') {
        const evaluationParts = inputDisplay.value.split(operator);
        firstNum = evaluationParts[0];
        secondNum = evaluationParts[1];
    } else {
        return inputDisplay.value;
    }
}

function handleNumberClick(button) {
    inputDisplay.value += button.value;
    checkValues();
    clearButtonImageToggle();
}

const numberButtons = document.querySelectorAll(".number");

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
    if (runningSum === 0 && firstNum != 0) {
        runningSum = Number(firstNum) + Number(secondNum);
        return inputDisplay.value = runningSum;
    } else if (runningSum === 0 && firstNum && secondNum != 0) {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = Number(firstNum) + Number(secondNum);
        return inputDisplay.value = runningSum;
    } else {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = runningSum + Number(secondNum);
        return inputDisplay.value = runningSum;
    }
}

function subtract(firstNum, secondNum) {
    if (runningSum === 0 && firstNum != 0) {
        runningSum = Number(firstNum) - Number(secondNum);
        return inputDisplay.value = runningSum;
    } else if (runningSum === 0 && firstNum && secondNum != 0) {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = Number(firstNum) - Number(secondNum);
        return inputDisplay.value = runningSum;
    } else {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = runningSum - Number(secondNum);
        return inputDisplay.value = runningSum;
    }
}

function multiply(firstNum, secondNum) {
    if (firstNum === 0 && secondNum != '') {
        runningSum = Number(firstNum) * Number(secondNum);
        return inputDisplay.value = runningSum;
    } else if (runningSum != 0 && secondNum != '') {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = runningSum * Number(secondNum);
        return inputDisplay.value = runningSum;
    } else if (firstNum != 0 && secondNum != '') {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = Number(firstNum) * Number(secondNum);
        return inputDisplay.value = runningSum;
    } else {
        return inputDisplay.value;
    }
}

function divide(firstNum, secondNum) {
    operator = "÷";
    if (firstNum === 0 && secondNum != '') {
        return alert("0 divided by anything is 0");
    } else if (runningSum === 0 && secondNum === 0) {
        return alert("Um, can't divide by 0, nice try!");
    } else if (firstNum != 0 && secondNum != 0) {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = Number(firstNum) / Number(secondNum);
        return inputDisplay.value = runningSum;
    } else {
        return inputDisplay.value;
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
    const evalParts = inputDisplay.value.split(operator);
    if (evalParts[1] === '') {
        equalsButton.disabled = true;
    } else {
        operate(operator, firstNum, secondNum);
        clearButtonImageToggle();
        secondNum = '';
        operator = '';
    }
    equalsButton.disabled = false;
}

const equalsButton = document.querySelector(".operator-equals");
const expressionDisplay = document.querySelector(".expression-display");

expressionDisplay.textContent = '';

equalsButton.addEventListener("click", () => handleEqualsClick());

function clearDisplayAndNumberValues() {
    inputDisplay.value = '';
    expressionDisplay.textContent = '';
    runningSum = 0;
    firstNum = 0;
    secondNum = '';
    operator = '';
}

const inputDisplay = document.querySelector(".results-input");

if (inputDisplay.value !== '') {
    firstNum = inputDisplay.value;
}

const clearButton = document.querySelector('.clear');

let timer;
const longPress = 800;
clearButton.addEventListener('click', () => {
    if (expressionDisplay.textContent != '') {
        decimalPointButton.disabled = false;
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

    if (inputDisplay.value == '' || expressionDisplay.textContent != '') {
        clearButton.textContent = "AC";
    } else if (inputDisplay.value != '') {
        clearButton.textContent = '';
        clearButton.appendChild(deleteLeftIcon);
    } else {
        clearButton.textContent = "AC";
    }
}

clearButtonImageToggle();

function deleteDigit() {
    const regexOperators = /[+\-*\÷]/;
    if (inputDisplay.value != '') {
        inputDisplay.value = inputDisplay.value.slice(0, -1);
    }
    if (!regexOperators.test(inputDisplay.value)) {
        operator = '';
        secondNum = '';
    }
    checkValues();
}

function handleOperatorClick(button) {
    if (operator == '') {
        operator = button.value;
    }
    const evalParts = inputDisplay.value.split(operator);
    if (inputDisplay.value === '') {
        inputDisplay.value = firstNum + operator;
    } else if (evalParts[1] != '') {
        operate(operator, firstNum, secondNum);
        operator = button.value;
        inputDisplay.value = inputDisplay.value + operator;
    } else {
        checkValues();
        operator = button.value;
        inputDisplay.value = firstNum + operator;
    }
}

const operatorButtons = document.querySelectorAll(".operator");

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
    if (firstNum.includes(".") && secondNum === '') {
        inputDisplay.value = firstNum;
    } else if (secondNum.includes(".")) {
        inputDisplay.value = firstNum + operator + secondNum;
    } else {
        decimalPointButton.disabled = false;
        inputDisplay.value += decimalPointButton.value;
    }
}

const decimalPointButton = document.querySelector(".decimal-point");

decimalPointButton.addEventListener("click", () => handleDecimalPointClick(decimalPointButton));


// const percentageButtonListener = () => {

//     const percentageButton = document.querySelector(".percentage");

//     percentageButton.addEventListener("click", () => {
//         inputDisplay.value = inputDisplay.value += percentageButton.value;
//     })
// }


const miscButtons = document.querySelectorAll(".misc");

miscButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.5)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = '';
    })
})

function handlePositiveNegClick() {
    const regexPosNeg = /[()-]/g;

    if (inputDisplay.value.charAt(0) === "-") {
        expressionDisplay.textContent = '';
        inputDisplay.value = inputDisplay.value.replace("-", '');
    }
    else if (!inputDisplay.value.includes("(-") && !operator) {
        expressionDisplay.textContent = '';
        inputDisplay.value = `(-${inputDisplay.value})`;
    } else if (inputDisplay.value.includes("(-") && !operator) {
        expressionDisplay.textContent = '';
        inputDisplay.value = inputDisplay.value.replace(regexPosNeg, '');
    } else if (inputDisplay.value != '' && operator != "-") {
        let expression = inputDisplay.value;
        let expressionParts = expression.split(operator);
        expressionParts[1] = `(-${expressionParts[1]})`;
        inputDisplay.value = expressionParts[0] + operator + expressionParts[1];
    } else if (inputDisplay.value != '' && operator === "-") {
        expression = inputDisplay.value;
        const str = inputDisplay.value.replace(/(-.*?)(-)/, '$1+');
        expressionParts = expression.split("-")
        operator = "+";
        inputDisplay.value = expressionParts[0] + operator + expressionParts[1];
    } else {
        inputDisplay.value = `(-${inputDisplay.value})`;
    }
}

const positiveNegButton = document.querySelector(".positive-negative");

positiveNegButton.addEventListener("click", () => handlePositiveNegClick());
