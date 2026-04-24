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

function clearButtonToggle(displayValue) {
    const clearButton = document.querySelector(".clear");
    console.log(clearButton);
    const deleteLeftIcon = document.createElement("img");
    deleteLeftIcon.src = "./images/delete-left-icon.png";
    if (!displayValue) {
        return clearButton.textContent = "AC";
    } else {
        return clearButton.appendChild(deleteLeftIcon);
    }
}

clearButtonToggle(false);

const operatorButtons = document.querySelectorAll(".operator");

operatorButtons.forEach((button) => {
    button.addEventListener("mousedown", () => {
        button.style.filter = "brightness(1.2)";
    })
    button.addEventListener("mouseup", () => {
        button.style.filter = "";
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


const inputDisplay = document.querySelector(".results-input");

inputDisplay.value = "";