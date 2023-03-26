const equation = [];
let solveForIndex;
document.addEventListener('keypress', event => {
  if (hasEqualSign()) return;
  if (event.target instanceof HTMLInputElement) return;
  const input = event.key;
  if (equation.length) {
    if (isNumber(input)) {
      handleNumber(input);
    } else if (isOperator(input)) {
      handleOperator(input);
    } else if (isEqualSign(input)) {
      createOperator('=');
      createNumber('x');
      solve();
    }
  } else {
    if (isNumber(input) || input === '-') {
      createNumber(input);
    }
  }
  render();
});
function handleNumber(input) {
  if (equation.at(-1).type === 'number') {
    concatNumber(input);
  } else {
    createNumber(input);
  }
}
function handleOperator(input) {
  if (equation.at(-1).type === 'operator') {
    replaceOperator(input);
  } else {
    createOperator(input);
  }
}
function createNumber(input) {
  equation.push({
    type: 'number',
    value: input,
    isComplete: isComplete(input)
  });
}
function concatNumber(input) {
  const lastNumber = equation.at(-1);
  const newValue = String(lastNumber.value) + input;
  lastNumber.value = formatDecimal(newValue);
  lastNumber.isComplete = isComplete(newValue);
}
function createOperator(input) {
  equation.push({
    type: 'operator',
    value: input
  });
}
function replaceOperator(input) {
  equation.at(-1).value = input;
}
function formatEquation(equation) {
  return equation.map(symbol => isNegativeNumber(symbol) ? `(${symbol.value})` : symbol.value).join(' ');
}
function solve() {
  solveForIndex ??= equation.length - 1;
  let equationCopy = deepCopy(equation);
  equationCopy[solveForIndex].value = 'x';
  equationCopy = formatEquation(equationCopy);
  console.log('Solving', equationCopy);
  try {
    const solution = algebra.parse(equationCopy).solveFor('x');
    equation[solveForIndex].value = solution.valueOf().toString();
  } catch (error) {
    console.error(error.message);
  }
}
function setSymbolValue(value, index) {
  equation[index].value = formatDecimal(value);
  equation[index].isComplete = isComplete(value);
  if (hasEqualSign()) {
    solve();
  }
  render();
}
function setSolveForIndex(newIndex) {
  solveForIndex = newIndex ?? equation.findLastIndex((symbol, index) => symbol.type === 'number' && index !== solveForIndex);
  render();
}
const root = ReactDOM.createRoot(document.getElementById('abbycus-root'));
function render() {
  root.render( /*#__PURE__*/React.createElement(Expression, {
    symbols: equation,
    setSymbolValue: setSymbolValue,
    solveForIndex: solveForIndex,
    setSolveForIndex: setSolveForIndex
  }));
}

// helper functions
const isNumber = input => input.match(/[0-9.]/);
const isOperator = input => input.match(/[*+/-]/);
const isEqualSign = input => input === '=' || input === 'Enter';
const isNegativeNumber = symbol => symbol.type === 'number' && symbol.value.startsWith('-');
const hasEqualSign = () => equation.findIndex(symbol => symbol.value === '=') >= 0;
const deepCopy = array => JSON.parse(JSON.stringify(array));
const isComplete = number => !number.endsWith('.') && number !== '-';
const formatDecimal = number => number.replace(/(?<!\d)[.]/, '0.').replace('+', ''); // replace decimal point that doesn't start with anything to '0.'