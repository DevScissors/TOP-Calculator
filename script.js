const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;

function operate(operator, num1, num2) {
    switch (operator) {
        case "add": add(num1, num2)
        case "subtract": subtract(num1, num2)
        case "multiply": multiply(num1, num2)
        case "divide": divide(num1, num2)
        default:
            add(num1, num2);
    }
}

function generateButtons() {
    const calcDiv = document.querySelector(".calculator-container");
    const operatorButton = document.createElement("button");
    operatorButton.textContent = "+";
    console.log(calcDiv);
    calcDiv.appendChild(operatorButton);
}

generateButtons();