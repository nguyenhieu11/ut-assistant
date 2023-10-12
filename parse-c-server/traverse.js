export function traverse(node) {

    let log_data = {}
    // Check if the node represents a variable declaration
    if (node.type === 'declaration' && node.namedChildren.length > 0) {

        const variableNameNode = node.namedChildren[0];
        const variableName = variableNameNode.text;
        log_data.variableNameNode = variableNameNode;


        console.log(`Variable Declaration: ${variableName}`);
        console.log(node);
    }

    // Check if the node represents a function declaration
    if (node.type === 'function_definition' && node.namedChildren.length > 0) {
        const functionNameNode = node.namedChildren[0];
        const functionName = functionNameNode.text;
        log_data.functionNameNode = functionNameNode;

        console.log(`Function Declaration: ${functionName}`);
        console.log(node);
    }

    // Check if the node represents an if statement
    if (node.type === 'if_statement' && node.namedChildren.length > 1) {
        const conditionNode = node.namedChildren[1];
        const conditionLine = conditionNode.startPosition.row + 1;

        log_data.conditionNode = conditionNode;

        console.log(`If Condition Line: ${conditionLine}`);
        console.log(node);
    }

    // Check if the node represents a printf statement
    if (node.type === 'call_expression' && node.firstChild.text === 'printf') {
        const printfLine = node.startPosition.row + 1;
        log_data.startPosition = node.startPosition;

        console.log(`Printf Statement Line: ${printfLine}`);
        console.log(node);
    }

    // Recursively traverse child nodes
    node.children.forEach(traverse);
}

export function traverseTypeOfLine(node) {
    const startLine = node.startPosition.row + 1;
    const endLine = node.endPosition.row + 1;
    let type;

    switch (node.type) {
        case 'function_definition':
            type = 'Function Definition';
            break;
        case 'call_expression':
            type = 'Function Call';
            break;
        case 'if_statement':
            type = 'Condition';
            break;
        default:
            type = 'Statement';
    }

    console.log(`Line ${startLine}-${endLine}: ${type}`);

    // Recursively traverse child nodes
    node.children.forEach(traverseTypeOfLine);
}
