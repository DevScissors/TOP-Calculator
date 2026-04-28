let firstNum = 0;
let secondNum = '';
let operator = '';
let runningSum = 0;

function getFirstNum() {
    if (operator === '') {
        firstNum = inputDisplay.value;
    }
    return firstNum;
}

function getSecondNum() {
    if (firstNum && operator != '') {
        const evaluationParts = inputDisplay.value.split(operator);
        secondNum = evaluationParts[1];
    }
}

function add(firstNum, secondNum) {

    if (runningSum === 0 && firstNum != 0) {
        expressionDisplay.textContent = inputDisplay.value;
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
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = firstNum - secondNum;
        return inputDisplay.value = runningSum;
    }
}

function multiply(firstNum, secondNum) {
    if (runningSum === 0 && firstNum != 0) {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = firstNum * secondNum;
        return inputDisplay.value = runningSum;
    }
}

function divide(firstNum, secondNum) {
    if (runningSum === 0 && firstNum != 0) {
        expressionDisplay.textContent = inputDisplay.value;
        runningSum = firstNum / secondNum;
        return inputDisplay.value = runningSum;
    } else if (firstNum != 0 && secondNum === 0) {
        return inputDisplay.value = "Um, can't divide by 0, nice try!";
    }
}


// const percentage = () => {
//     if(firstNum && !secondNum) {
//         inputDisplay.value = firstNum / 100;
//     } 
// }

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
        case "/":
            operator = "\u00F7"
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

if (inputDisplay.value !== "") {
    firstNum = inputDisplay.value;
}

const clearButton = document.querySelector(".clear");

let timer;
const longPress = 800;
clearButton.addEventListener("click", () => {
    if (expressionDisplay.textContent != "") {
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

    if (inputDisplay.value == "" || expressionDisplay.textContent != "") {
        clearButton.textContent = "AC";
        if (clearButton.contains(deleteLeftIcon)) {
            clearButton.removeChild(deleteLeftIcon);
        }
    } else {
        clearButton.textContent = "";
        return clearButton.appendChild(deleteLeftIcon);
    }
}

clearButtonImageToggle();

function deleteDigit() {
    if (inputDisplay.value != "" && expressionDisplay.textContent == '') {
        inputDisplay.value = inputDisplay.value.slice(0, -1);
    }
}

function handleOperatorClick(button) {
    operator = button.value;
    if (inputDisplay.value === '') {
        inputDisplay.value = firstNum + operator;
    } else {
        operate(operator, firstNum, secondNum);
        inputDisplay.value = inputDisplay.value + operator;
    }
}

const operatorButtons = document.querySelectorAll(".operator");

operatorButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.2)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = "";
    })
    button.addEventListener("click", () => handleOperatorClick(button));
})

function handleNumberClick(button) {
    inputDisplay.value += button.value;
    getFirstNum(button.value);
    getSecondNum(button.value);
    clearButtonImageToggle();
}

const numberButtons = document.querySelectorAll(".number");

numberButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(3)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = "";
    })
    button.addEventListener("click", () => handleNumberClick(button));
})

function handleDecimalPointClick(decimalPointButton) {
    if (inputDisplay.value === '') {
        decimalPointButton.disabled = false;
    } else if (inputDisplay.value.includes(".")) {
        decimalPointButton.disabled = true;
    } else {
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
        button.style.filter = "";
    })
})

function handlePositiveNegClick() {
    const regexPosNeg = /[()-]/g;

    if (inputDisplay.value.charAt(0) === "-") {
        expressionDisplay.textContent = '';
        inputDisplay.value = inputDisplay.value.replace("-", "");
    }
    else if (!inputDisplay.value.includes("(-") && !operator) {
        expressionDisplay.textContent = '';
        inputDisplay.value = `(-${inputDisplay.value})`;
    } else if (inputDisplay.value.includes("(-") && !operator) {
        expressionDisplay.textContent = '';
        inputDisplay.value = inputDisplay.value.replace(regexPosNeg, "");
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
