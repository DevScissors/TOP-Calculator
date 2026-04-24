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
            operator = "/";
            break;
        case "%":
            operator = "%";
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
    expressionDisplay.textContent = inputDisplay.value;
    clearButtonImageToggle();
    getTotal(currentOperator);
})

function getTotal() {

    const expression = inputDisplay.value;
    const parts = expression.split(currentOperator);
    if (currentOperator === "x") {
        currentOperator = "*";
    }
    const result = new Function(`return ${parts[0]} ${currentOperator} ${parts[1]}`)();
    inputDisplay.value = result;
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
            inputDisplay.value = firstNum += currentOperator;
        } else {
            inputDisplay.value = inputDisplay.value += currentOperator;
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

const miscButtons = document.querySelectorAll(".misc");

miscButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.5)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = "";
    })
})

clearButtonImageToggle();


