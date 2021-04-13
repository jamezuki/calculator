const buttons = document.querySelectorAll('button');
const display = document.querySelector('#display');
let operation = '0';
display.textContent = '0';

/****************************** DOM ******************************/

window.addEventListener('keydown', e => {
    const button = getbutton(e.key);
    if (!button) return;
    switch (button.classList.value) {
        case 'digit': digitAction(button); break;
        case 'operator':
            e.preventDefault();
            operatorAction(button);
            break;
        default: switch (button.dataset.key) {
            case 'Escape': escape(); break;
            case 'Backspace': backspace(); break;
            case '%': percent(); break;
            case 'F9;¬': negate(); break;
            case '.': point(); break;
            case '=;Enter': equal(); break;
            default: return;
        }
    }
});

function getbutton(key) {
    for (let i = 0; i < buttons.length; i++) {
        const keys = buttons[i].dataset.key.split(';');
        for (let k = 0; k < keys.length; k++) {
            if (keys[k] == key) return buttons[i];
        }
    }
}

buttons.forEach(button => button.addEventListener('click', () => {
    switch (button.classList.value) {
        case 'digit': digitAction(button); break;
        case 'operator': operatorAction(button); break;
        default: switch (button.dataset.key) {
            case 'Escape': escape(); break;
            case 'Backspace': backspace(); break;
            case '%': percent(); break;
            case 'F9;¬': negate(); break;
            case '.': point(); break;
            case '=;Enter': equal(); break;
            default: return;
        }
    }
}));

/****************************** Buttons ******************************/

function digitAction(digit) {
    if (error()) return;
    operation == '0' ? operation = digit.dataset.key : operation += digit.dataset.key;
    updateDisplay();
}

function operatorAction(operator) {
    if (error()) return;
    if (validOperation()) {
        if (/^[-\.]$/.test(getNum1())) operation = `0${getOperator()}${getNum2()}`;
        if (/^[-\.]$/.test(getNum2())) operation = `${getNum1()}${getOperator()}0`;
        if (getOperator() == '/' && getNum2() == '0') {
            errorStyle(true);
            display.textContent = 'Can\'t divide by 0!';
            return;
        }
        operation = operate(getOperator(), Number(getNum1()), Number(getNum2()));
        operation += operator.dataset.key;
        updateDisplay();
        return;
    }
    if (operation.charAt(operation.length - 1) == '.') operation += '0';
    if (getNum2() == null) operation = getNum1() + operator.dataset.key;
}

function escape() {
    if (error()) errorStyle(false);
    operation = '0';
    display.textContent = '0';
}

function backspace() {
    if (error()) return;
    if (getOperator() != null && getNum2() == null) return;
    if (getNum2() == null) {
        operation.length == 1 ? operation = '0' : operation = operation.slice(0, -1);
        if (/^[-\.]0?$/.test(operation)) operation = '0';
    } else {
        getNum2().length == 1 ? operation = operation.slice(0, -1) + '0' : operation = operation.slice(0, -1);
        if (/^[-\.]0?$/.test(getNum2())) operation = `${getNum1()}${getOperator()}0`;
    }
    updateDisplay();
}

function percent() {
    if (error()) return;
    if (getNum2() != null) {
        if (getOperator() == '+' || getOperator() == '-') {
            let percent = Number(getNum1()) / 100 * Number(getNum2());
            percent = parseFloat(percent.toFixed(5)).toString();
            operation = `${getNum1()}${getOperator()}${percent}`;
            updateDisplay();
        } else {
            let percent = Number(getNum2()) / 100;
            percent = parseFloat(percent.toFixed(5)).toString();
            operation = `${getNum1()}${getOperator()}${getNum2() / 100}`;
            updateDisplay();
        }
    }
}

function negate() {
    if (error()) return;
    if (getOperator() != null && getNum2() == null) return;
    if (getOperator() == null && getNum2() == null) {
        operation.charAt(0) == '-' ? operation = operation.slice(1) : operation = `-${operation}`;
    } else {
        if (getNum2().charAt(0) == '-') {
            operation = `${getNum1()}${getOperator()}${getNum2().slice(1)}`;
        } else {
            operation = `${getNum1()}${getOperator()}-${getNum2()}`;
        }
    }
    updateDisplay();
}

function point() {
    if (error()) return;
    if (getOperator() == null) {
        if (/\./g.test(getNum1())) return;
        operation == '0' ? operation = '0.' : operation += '.';
    } else {
        if (/\./g.test(getNum2())) return;
        getNum2() == null ? operation += '0.' : operation += '.';
    }
    updateDisplay();
}

function equal() {
    if (error()) return;
    if (validOperation()) {
        if (/^[-\.]$/.test(getNum1())) operation = `0${getOperator()}${getNum2()}`;
        if (/^[-\.]$/.test(getNum2())) operation = `${getNum1()}${getOperator()}0`;
        if (getOperator() == '/' && getNum2() == '0') {
            errorStyle(true);
            display.textContent = 'Can\'t divide by 0!';
            return;
        }
        operation = operate(getOperator(), Number(getNum1()), Number(getNum2()));
        updateDisplay();
    }
}

/****************************** Utils ******************************/

function getNum1() {
    const num = /-?[0-9]+\.?[0-9]*/.exec(operation);
    if (num == null) return null;
    return num[0];
}

function getNum2() {
    const num = /[0-9\.][\+\-\*\/]-?[0-9]+\.?[0-9]*/.exec(operation);
    if (num == null) return null;
    return num[0].slice(2);
}

function getOperator() {
    const operator = /[0-9][\+\-\*\/]/.exec(operation);
    if (operator == null) return null;
    return operator[0].slice(1);
}

function validOperation() {
    const validNum = '-?[0-9]+\\.?[0-9]*';
    const validOp = '[\\+\\-\\*\\/]';
    return new RegExp(`^${validNum}${validOp}${validNum}$`).test(operation);
}

function updateDisplay() {
    getNum2() == null ? display.textContent = getNum1() : display.textContent = getNum2();

    // 30px is max char width support
    const maxLength = display.offsetWidth / 30;
    if (display.textContent.length - 1 > maxLength) {
        errorStyle(true);
        display.textContent = 'Overflow';
    }
}

let error = () => /[a-z]/gi.test(display.textContent) ? true : false;

function errorStyle(set) {
    if (set) {
        display.style.justifyContent = 'center';
        display.style.fontSize = '1.5rem';
    } else {
        display.style.justifyContent = 'end';
        display.style.fontSize = '3rem';
    }
}

/****************************** Arithmetic ******************************/

let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;

function operate(operator, a, b) {
    let result = 0;
    switch (operator) {
        case '+': result = add(a, b); break;
        case '-': result = subtract(a, b); break;
        case '*': result = multiply(a, b); break;
        case '/': result = divide(a, b); break;
    }
    return parseFloat(result.toFixed(5)).toString();
}