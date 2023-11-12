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

import { getTestCaseList } from './decision/parse-decision.js'

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

    const test_case_list = getTestCaseList(if_list_info);

    res.send({
        test_case_list
        // if_list_info,
        // preorder,
        // binary_expression_list
        // func_return_type,
        // func_name,
        // func_param_list,
        // func_local_var_list,
        // c_func
    })
});

// Define a route for the API endpoint
app.get('/auto-generate', (req, res) => {

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

    /** Need fix: test_case_list is array in array*/
    const test_case_list = getTestCaseList(if_list_info)[0];
    if (!test_case_list.length) {
        res.send('No test case')
    }
    let insert_str = ''
    test_case_list.forEach(tc => {
        let assing_str = ''
        tc.assign_list.forEach(as => {
            assing_str += `${as.identifier} = ${as.value}; \n`
        })

        let tc_str = `
        /** 
         * Check coverage case ${tc.case_in_text}
         *      ${tc.condition}
        */
        TEST_F(ClassUnitTest, FUN_Test_TC${tc.ts_number}){

            /* Test case declaration */
            Stub stubObj;

            /* Set value */
            ${assing_str}
            
            /* Call Stub function */

            /* Call SUT */

            /* Test case check for variables */

        }
        `
        insert_str += tc_str
    })
    // res.send(insert_str)

    let cpp_file_str = fs.readFileSync('../source-structure/example_01/test_example_01/test_example_01.cpp', 'utf8');
    // Find the position to insert the text
    const beginMarker = '//=================BEGIN_AUTO_GEN_TC=================//';
    const endMarker = '//==================END_AUTO_GEN_TC==================//';

    const beginIndex = cpp_file_str.indexOf(beginMarker);
    const endIndex = cpp_file_str.indexOf(endMarker, beginIndex + beginMarker.length);

    if (beginIndex === -1 || endIndex === -1) {
        console.error('Markers not found in the file');
        res.send('Markers not found in the file')
        return;
    }

    // Delete the text between markers and insert the new text
    const modifiedContent = cpp_file_str.slice(0, beginIndex + beginMarker.length) + insert_str + cpp_file_str.slice(endIndex);

    // Write the modified content back to the file

    fs.writeFileSync('../source-structure/example_01/test_example_01/test_example_01.cpp', modifiedContent, 'utf8');
    res.send(modifiedContent)
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