function getOperator(operator) {
    switch (operator) {
        case "+":
            operator = "+";
            break;
        case "-":
            operator = "-";
            break;
        case "x":
            operator = "x";
            break;
        case "/":
            operator = "\u00F7"
            break;
        default:
            operator = '';
    }
    return operator;
}

let currentOperator = '';

const equalsButton = document.querySelector(".operator-equals");
const expressionDisplay = document.querySelector(".expression-display");
expressionDisplay.textContent = '';

equalsButton.addEventListener("click", () => {
    if (currentOperator) {
        expressionDisplay.textContent = inputDisplay.value;
    }
    clearButtonImageToggle();
    getTotal(currentOperator);
    currentOperator = '';
})

function getTotal() {
    let result = null;
    let expression = inputDisplay.value;
    let parts = null;
    if (expression.includes("%") && currentOperator) {
        parts = expression.split(currentOperator);
        if (parts[0].includes("%")) {
            parts[0] = parts[0].replace("%", "");
            result = new Function(`return ${parts[0] / 100} ${currentOperator} ${parts[1]}`)();
            return inputDisplay.value = result;
        } else {
            parts[1] = parts[1].replace("%", "");
            result = new Function(`return ${parts[0]} * (${parts[1]}/100) ${currentOperator} ${parts[0]}`)();
            return inputDisplay.value = result;
        }
    }
    if (expression.includes("%") && currentOperator == '') {
        expression = expression.replace("%", "");
        result = new Function(`return ${expression}/100`)();
        expressionDisplay.textContent = inputDisplay.value;
        inputDisplay.value = result;
    }
    if (inputDisplay.value.includes("(-") && !currentOperator) {
        return;
    }
    parts = expression.split(currentOperator);
    if (currentOperator === "x") {
        currentOperator = "*";
        result = new Function(`return ${parts[0]} ${currentOperator} ${parts[1]}`)();
        inputDisplay.value = result;
    } else if (currentOperator === "\u00F7") {
        currentOperator = "/";
        result = new Function(`return ${parts[0]} ${currentOperator} ${parts[1]}`)();
        inputDisplay.value = result;
    } else if (currentOperator === "") {
        result = inputDisplay.value;
    } else {
        result = new Function(`return ${parts[0]} ${currentOperator} ${parts[1]}`)();
        inputDisplay.value = result;
    }
}

let firstNum = 0;

const inputDisplay = document.querySelector(".results-input");
if (inputDisplay.value !== "") {
    firstNum = inputDisplay.value;
}

const clearButton = document.querySelector(".clear");

let timer;
const longPress = 800;
clearButton.addEventListener("click", () => {
    if (expressionDisplay.textContent != "") {
        inputDisplay.value = '';
        expressionDisplay.textContent = '';
        decimalPointButton.disabled = false;
    }
})
clearButton.addEventListener("mousedown", () => {
    timer = setTimeout(() => {
        inputDisplay.value = '';
        expressionDisplay.textContent = '';
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



function clearButtonImageToggle() {
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

function deleteDigit() {
    if (inputDisplay.value != "" && expressionDisplay.textContent == '') {
        inputDisplay.value = inputDisplay.value.slice(0, -1);
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
    button.addEventListener("click", () => {
        currentOperator = getOperator(button.value);
        if (inputDisplay.value === '') {
            inputDisplay.value = firstNum + currentOperator;
        } else if (!currentOperator) {
            inputDisplay.value = inputDisplay.value + currentOperator;
        } else if (/([+\-\x]|\u00F7)$/.test(inputDisplay.value)) {
            inputDisplay.value = inputDisplay.value.slice(0, -1) + currentOperator;
        } else {
            inputDisplay.value = inputDisplay.value + currentOperator;
        }

    })
})

const numberButtons = document.querySelectorAll(".number");

numberButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(3)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = "";
    })
    button.addEventListener("click", () => {
        inputDisplay.value += button.value;
        clearButtonImageToggle();
    })
})

const decimalPointButton = document.querySelector(".decimal-point");

decimalPointButton.addEventListener("click", () => {
    if (inputDisplay.value === '') {
        decimalPointButton.disabled = false;
    } else if (inputDisplay.value.includes(".")) {
        decimalPointButton.disabled = true;
    } else {
        inputDisplay.value += decimalPointButton.value;
    }
})

const percentageButton = document.querySelector(".percentage");

percentageButton.addEventListener("click", () => {
    inputDisplay.value = inputDisplay.value += percentageButton.value;
})

const miscButtons = document.querySelectorAll(".misc");

miscButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.5)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = "";
    })
})

const positiveNegButton = document.querySelector(".positive-negative");

positiveNegButton.addEventListener("click", () => {
    const regexPosNeg = /[()-]/g

    if (inputDisplay.value.charAt(0) === "-") {
        expressionDisplay.textContent = '';
        inputDisplay.value = inputDisplay.value.replace("-", "");
    }
    else if (!inputDisplay.value.includes("(-") && !currentOperator) {
        expressionDisplay.textContent = '';
        inputDisplay.value = `(-${inputDisplay.value})`;
    } else if (inputDisplay.value.includes("(-") && !currentOperator) {
        expressionDisplay.textContent = '';
        inputDisplay.value = inputDisplay.value.replace(regexPosNeg, "");
    } else if (inputDisplay.value != '' && currentOperator != "-") {
        let expression = inputDisplay.value;
        let expressionParts = expression.split(currentOperator);
        expressionParts[1] = `(-${expressionParts[1]})`;
        inputDisplay.value = expressionParts[0] + currentOperator + expressionParts[1];
    } else if (inputDisplay.value != '' && currentOperator === "-") {
        expression = inputDisplay.value;
        const str = inputDisplay.value.replace(/(-.*?)(-)/, '$1+');
        expressionParts = expression.split("-")
        currentOperator = "+";
        inputDisplay.value = expressionParts[0] + currentOperator + expressionParts[1];
    } else {
        inputDisplay.value = `(-${inputDisplay.value})`;
    }
})

clearButtonImageToggle();


