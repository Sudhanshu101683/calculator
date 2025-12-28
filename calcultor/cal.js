const input = document.getElementById('inputbox');
const buttons = document.querySelectorAll('button');

let expression = "";
let justEvaluated = false;

function updateDisplay() {
  input.value = expression;
}

function handleInput(rawValue) {
  // normalize operators
  let value = rawValue === '×' ? '*' : (rawValue === '÷' ? '/' : rawValue);

  // EQUAL
  if (value === '=') {
    try {
      expression = expression.replace(/[+\-*/.]$/, ''); // strip trailing ops
      const result = expression ? eval(expression) : 0;
      expression = String(result);
      input.value = expression;
    } catch {
      input.value = "Error";
      expression = "";
    }
    justEvaluated = true;
    return;
  }

  // ALL CLEAR
  if (value === 'AC') {
    expression = "";
    updateDisplay();
    justEvaluated = false;
    return;
  }

  // DELETE
  if (value === 'DEL') {
    expression = expression.slice(0, -1);
    updateDisplay();
    return;
  }

  // if last was evaluation and user enters number/dot → start fresh
  if (justEvaluated) {
    if (/[0-9.]/.test(value)) {
      expression = value;
    } else {
      expression += value;
    }
    justEvaluated = false;
    updateDisplay();
    return;
  }

  // prevent multiple operators
  if (/^[+\-*/]$/.test(value)) {
    if (expression === "") {
      if (value !== '-') return; // only allow leading minus
    } else if (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
  }

  // prevent multiple dots in same number
  if (value === '.') {
    const lastNum = expression.split(/[+\-*/]/).pop();
    if (lastNum.includes('.')) return;
    if (lastNum === '') expression += '0';
  }

  expression += value;
  updateDisplay();
}

// button clicks
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.value || btn.textContent.trim();
    handleInput(value);
  });
});

// keyboard support
document.addEventListener('keydown', (e) => {
  const k = e.key;
  if ((k >= '0' && k <= '9') || k === '.' || '+-*/'.includes(k)) {
    handleInput(k);
  } else if (k === 'Enter') {
    handleInput('=');
  } else if (k === 'Backspace') {
    handleInput('DEL');
  } else if (k.toLowerCase() === 'c') {
    handleInput('AC');
  }
});
