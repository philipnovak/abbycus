function NumberBlock({ value, index, isComplete, isSolved, onValueChange, setSolveForIndex }) {
    return (
        <div className="number-block">
            <input
                type={isComplete ? 'number' : 'text'}
                className="digit"
                value={value}
                onChange={(event) => {
                    if (isSolved) {
                        setSolveForIndex()
                    }
                    onValueChange(event.target.value, index)
                }}
            />
            <label>
                <input
                    type="checkbox"
                    checked={isSolved}
                    onChange={(event) => {
                        if (event.target.checked) {
                            setSolveForIndex(index)
                        }
                    }}
                />
                Solve
            </label>
        </div>
    )
}

function OperatorBlock({ value }) {
    return <div className="operator-block">{value}</div>
}

function Expression({ symbols, setSymbolValue, solveForIndex, setSolveForIndex }) {
    return symbols.map((symbol, index) => {
        switch (symbol.type) {
            case 'number':
                return (
                    <NumberBlock
                        value={symbol.value}
                        index={index}
                        isComplete={symbol.isComplete}
                        isSolved={index === solveForIndex}
                        onValueChange={setSymbolValue}
                        setSolveForIndex={setSolveForIndex}
                        key={index}
                    ></NumberBlock>
                )
            case 'operator':
                return <OperatorBlock value={symbol.value} key={index}></OperatorBlock>
        }
    })
}
