import express from 'express';
import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { traverse, traverseTypeOfLine } from './traverse.js';
// import { cFunc } from './c-function.js';
import {
    getFuncIdentifier,
    getFuncReturnType,
    getFuncParamList,
    getFuncLocalVarList,
    getIfStatement
} from './analyze-function.js'

import {
    markNumOfTree,
    levelOrder
} from './level-order-n-ary-tree.js'

import {
    preorderTraversal,
    findIfCondition,
    getIfInfo,
    findBinaryExpression,
    findIdentifier
} from './preorder-traversal.js'

import { parseDecision } from './decision/parse-decision.js'

import fs from 'fs'

// import {
//     getTrustTable
// } from './mcdc/trust-table.js'

// import {
//     getMcdc
// } from './mcdc/mcdc.js'

// Initialize the parser
const parser = new Parser();
parser.setLanguage(C);



const app = express();

// Define a route for the API endpoint
app.get('/get-ast', (req, res) => {

    let c_func_str = fs.readFileSync('../source-structure/example_01/example_01.c', 'utf8');

    // Parse the C code
    const tree = parser.parse(c_func_str);

    markNumOfTree(tree.rootNode, 1);
    levelOrder(tree.rootNode);

    let rootNode = tree.rootNode;

    let preorder = preorderTraversal(rootNode);

    // // preorderTraversal(node.children[0].children[1].children[1]);
    /** */
    let if_list = findIfCondition(rootNode);
    // console.log(if_list[0])
    let if_list_info = []
    if_list.forEach(e => {
        const info = getIfInfo(e.node);
        const child_if_list = findIfCondition(e.node);
        let child_if_list_mark = []
        child_if_list.forEach(child => {
            child_if_list_mark.push(child.mark)
        })
        let binary_expression_list = findBinaryExpression(e.node)
        let valid_binary_expression_list = []
        binary_expression_list.forEach(be => {
            if (child_if_list_mark.length) {
                let min_child_mark = child_if_list_mark[0];
                child_if_list_mark.forEach(cim => {
                    if (min_child_mark > cim) {
                        min_child_mark = cim
                    }
                })

                /** Only push the condition not existed */
                if (be.mark >= e.mark && be.mark < min_child_mark) {
                    let existed_be = false;
                    valid_binary_expression_list.forEach(vbe => {
                        if (vbe.mark == be.mark) {
                            existed_be = true;
                        }
                    })
                    if (!existed_be) {
                        valid_binary_expression_list.push(be)
                    }
                }
            }
            else {
                valid_binary_expression_list = binary_expression_list
            }
        })

        let identifier_list = findIdentifier(e.node)

        /** Delete .node inside info */
        // delete info.node;

        if_list_info.push({
            par_mark: e.node.par_mark,
            mark: e.node.mark,
            info,
            child_if_list_mark,
            // binary_expression_list,
            valid_binary_expression_list,
            identifier_list,
        })
    })

    const decision_list = parseDecision(if_list_info);
    res.send({
        // if_list_info,
        decision_list,
        // preorder,
        // binary_expression_list
        // func_return_type,
        // func_name,
        // func_param_list,
        // func_local_var_list,
        // c_func
    })
});

// app.get('/get-trust-table', (req, res) => {
//     let trust_table = getTrustTable();

//     res.send({
//         trust_table
//     })
// });


// app.get('/get-mcdc', (req, res) => {
//     let trust_table = getTrustTable();
//     let mcdc = getMcdc(trust_table);

//     res.send({
//         mcdc
//     })
// });

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});