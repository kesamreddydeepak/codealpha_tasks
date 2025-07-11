const display = document.getElementById('display');
let currentInput = '';
let resetNext = false;

function updateDisplay() {
  display.textContent = currentInput || '0';
}

function appendCharacter(char) {
  if (resetNext) {
    currentInput = '';
    resetNext = false;
  }
  currentInput += char;
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    let result = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    currentInput = eval(result).toString();
    updateDisplay();
    resetNext = true;
  } catch {
    display.textContent = 'Error';
    currentInput = '';
  }
}

// Button clicks
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    if (button.classList.contains('number') || button.classList.contains('operator')) {
      appendCharacter(value);
    } else if (button.classList.contains('clear')) {
      clearDisplay();
    } else if (button.classList.contains('del')) {
      deleteLast();
    } else if (button.classList.contains('equal')) {
      calculate();
    }
  });
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (!isNaN(e.key) || '+-*/.'.includes(e.key)) {
    appendCharacter(e.key);
  } else if (e.key === 'Enter') {
    calculate();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
