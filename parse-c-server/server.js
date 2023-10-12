import express from 'express';
import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { traverse, traverseTypeOfLine } from './traverse.js';
import { cFunc } from './c-function.js';
import {
    getFuncIdentifier,
    getFuncReturnType,
    getFuncParamList,
    getFuncLocalVarList,
    getIfStatement
} from './analyze-function.js'

// Initialize the parser
const parser = new Parser();
parser.setLanguage(C);


// Parse the C code
const tree = parser.parse(cFunc);


const app = express();

// Define a route for the API endpoint
app.get('/get-ast', (req, res) => {
    // traverseTypeOfLine(tree.rootNode)



    getIfStatement(tree.rootNode);

    const func_name = getFuncIdentifier(tree.rootNode);
    console.log("function name: ", func_name);

    const func_return_type = getFuncReturnType(tree.rootNode);
    console.log("function return type: ", func_return_type);

    const func_param_list = getFuncParamList(tree.rootNode);
    console.log("function param list: ", func_param_list);

    const func_local_var_list = getFuncLocalVarList(tree.rootNode);
    console.log("function param list: ", func_local_var_list);


    let node = tree.rootNode;
    // node = tree.rootNode.children[0];
    // node = tree.rootNode.children[0].children[1].children[1].namedChildren[0].children[1];
    // node = tree.rootNode.nameChildren[0].nameChildren[1].nameChildren[1].namedChildren[0];
    res.send({
        func_return_type,
        func_name,
        func_param_list,
        func_local_var_list
    })
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});