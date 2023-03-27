const equation = [];
let solveForIndex;
document.addEventListener('keypress', event => {
  if (hasEqualSign()) return;
  if (event.target instanceof HTMLInputElement) return;
  const input = event.key;
  if (equation.length) {
    if (isNumeric(input)) {
      handleNumber(input);
    } else if (isOperator(input)) {
      handleOperator(input);
    } else if (isEqualSign(input)) {
      createOperator('=');
      createNumber('x');
      solve();
    }
  } else {
    if (isNumeric(input) || input === '-') {
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
function format(expression) {
  return expression.flatMap(symbol => symbol.value ?? symbol.symbols);
}
function nest(expression, operators) {
  for (let i = 1; i < expression.length; i += 2) {
    if (operators.find(operator => operator === expression[i].value)) {
      const symbols = expression.slice(i - 1, i + 2);
      const hasX = !!symbols.find(symbol => symbol.value === 'x');
      expression.splice(i - 1, 3, {
        type: 'expression',
        symbols,
        hasX
      });
      nest(expression, operators);
      break;
    }
  }
  return expression;
}
function invert(nestedExpression) {}
let i = 0;
function calculate(nestedExpression) {
  console.log('nested expression ' + i++);
  console.log(format(nestedExpression));
  const leftSide = nestedExpression[0];
  const operator = nestedExpression[1];
  const rightSide = nestedExpression[2];
  if (leftSide.type === 'expression') {
    leftSide.value = calculate(leftSide.symbols);
  }
  if (rightSide.type === 'expression') {
    rightSide.value = calculate(rightSide.symbols);
  }
  switch (operator.value) {
    case '*':
      return new Decimal(leftSide.value).times(new Decimal(rightSide.value)).toString();
    case '/':
      return new Decimal(leftSide.value).dividedBy(new Decimal(rightSide.value)).toString();
    case '+':
      return new Decimal(leftSide.value).plus(new Decimal(rightSide.value)).toString();
    case '-':
      return new Decimal(leftSide.value).minus(new Decimal(rightSide.value)).toString();
    case '=':
      return new Decimal(leftSide.value);
  }
}
function solve() {
  solveForIndex ??= equation.length - 1;
  let equationCopy = deepCopy(equation);
  console.log('Solving', format(equationCopy));
  const nestedExpression = nest(nest(equationCopy, ['*', '/']), ['+', '-']);
  console.log('Nested', nestedExpression);
  console.log('Formatted', format(nestedExpression));
  const solution = calculate(nestedExpression);
  console.log(solution);
  equation[solveForIndex].value = solution.toString();
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
const isNumeric = input => input.match(/[0-9.]/);
const isOperator = input => input.match(/[*+/-]/);
const isEqualSign = input => input === '=' || input === 'Enter';
const isNegativeNumber = symbol => symbol.type === 'number' && symbol.value.startsWith('-');
const hasEqualSign = () => equation.findIndex(symbol => symbol.value === '=') >= 0;
const deepCopy = array => JSON.parse(JSON.stringify(array));
const isComplete = number => !number.endsWith('.') && number !== '-';
const formatDecimal = number => number.replace(/(?<!\d)[.]/, '0.').replace('+', ''); // replace decimal point that doesn't start with anything to '0.'