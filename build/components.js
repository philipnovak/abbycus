function NumberBlock({
  value,
  index,
  isComplete,
  isSolved,
  onValueChange,
  setSolveForIndex
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "number-block"
  }, /*#__PURE__*/React.createElement("input", {
    type: isComplete ? 'number' : 'text',
    className: "digit",
    value: value,
    onChange: event => {
      if (isSolved) {
        setSolveForIndex();
      }
      onValueChange(event.target.value, index);
    }
  }), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: isSolved,
    onChange: event => {
      if (event.target.checked) {
        setSolveForIndex(index);
      }
    }
  }), "Solve"));
}
function OperatorBlock({
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "operator-block"
  }, value);
}
function Expression({
  symbols,
  setSymbolValue,
  solveForIndex,
  setSolveForIndex
}) {
  return symbols.map((symbol, index) => {
    switch (symbol.type) {
      case 'number':
        return /*#__PURE__*/React.createElement(NumberBlock, {
          value: symbol.value,
          index: index,
          isComplete: symbol.isComplete,
          isSolved: index === solveForIndex,
          onValueChange: setSymbolValue,
          setSolveForIndex: setSolveForIndex,
          key: index
        });
      case 'operator':
        return /*#__PURE__*/React.createElement(OperatorBlock, {
          value: symbol.value,
          key: index
        });
    }
  });
}