import express from 'express';
import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { traverse, traverseTypeOfLine } from './traverse.js';

import util from 'util';

import lodash from 'lodash';

import {
    getFuncIdentifier,
    getFuncReturnType,
    getFuncParamList,
    getFuncLocalVarList,
    getIfStatement
} from './analyze-function.js'

import {
    levelOrder,
    levelOrderAsync
} from './level-order-n-ary-tree.js'

import {
    preorderTraversal,
    // findIfCondition,
    // getIfInfo,
    findBinaryExpression,
    findIdentifier,
    checkPreorder,
    markNumPreorderTree
} from './preorder-traversal.js'

import { getTestCaseList } from './decision/parse-decision.js'
import { getCalledStubFunc } from './get-called-stub.js';

import {
    findIfCondition,
    getIfInfo,
    getIfInfoList
} from './if-handle.js';

import fs from 'fs'
import { findEnumerator, findPreProcDefine } from './predefine-handle.js';
import { findGlobalFunc } from './test-func.js';
import { generateExternGlobalVariableString, generateExternGlobalFuncString, generateTestCaseString } from './test-file-template.js';
import { findGlobalVar } from './identifier-handle.js';
import { insertToTestFile } from './testing-file-handle.js';
import { generateStubFuncDefineString, getStubFunc } from './stub-function.js';
import { cloneArrayTreeWithMark, getParentNode } from './tree-algorithms/treeHelper.js';
import { findGloabalVariableOfHeaderFile, findGloabalVariableOfSourceFile } from './variable-declaration/variableDeclaration.js';
import { findGlobalFuncDecl } from './function-definition/functionDefinition.js';
import { findStubFunc } from './stub-function/stubFuncion.js';
import { findPreprocDefOfFile } from './preproc-define/preprocDefine.js';
import { decideCondition, test_function } from './preproc-handler/preproc-replace.js';

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
            child_if_list_mark.push(lodash.clone(child.mark))
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
                        valid_binary_expression_list.push(lodash.clone(be))
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

        if_list_info.push(lodash.clone({
            par_mark: e.node.par_mark,
            mark: e.node.mark,
            info,
            child_if_list_mark,
            // binary_expression_list,
            valid_binary_expression_list,
            identifier_list,
        }))
    })

    const test_case_list = getTestCaseList(if_list_info);

    res.send({
        test_case_list,
        if_list,
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
app.get('/auto-generate', async (req, res) => {
    try {
        let test_folder_path = ''
        let test_module_name = ''
        if (req.query.absolute_path_of_testing_folder) {
            console.log('absolute_path_of_testing_folder');
            console.log(req.query.absolute_path_of_testing_folder);
            test_folder_path = req.query.absolute_path_of_testing_folder
        }
        if (req.query.module_name) {
            console.log('test_module_name');
            console.log(req.query.module_name);
            test_module_name = req.query.module_name.replace('.c', '');
        }
        /** Get pre-define */
        let stub_header_str = fs.readFileSync(`${test_folder_path}/test_${test_module_name}/test_${test_module_name}.h`, 'utf8');
        const header_tree = parser.parse(stub_header_str);
        /** Just collect necessary data of header_root ( .h file )*/
        const cloned_header_tree = await cloneArrayTreeWithMark(header_tree.rootNode);
        const header_root = await markNumPreorderTree(cloned_header_tree, 1);
        const preproc_list = await findPreProcDefine(header_root);
        const enum_list = await findEnumerator(header_root);

        let c_func_str = fs.readFileSync(`${test_folder_path}/${test_module_name}.c`, 'utf8');
        const tree = parser.parse(c_func_str);

        /** Just collect necessary data of root ( .c file )*/
        const cloned_root = await cloneArrayTreeWithMark(tree.rootNode);
        const root_node = await markNumPreorderTree(cloned_root, 1);

        let if_list = await findIfCondition(root_node);
        let if_info_list = await getIfInfoList(if_list);
        let global_func_list = await findGlobalFunc(root_node);

        /** Need fix: test_case_list is array in array*/
        const test_case_list = getTestCaseList(if_info_list, preproc_list, enum_list);
        if (!test_case_list.length) {
            res.send('No test case')
            return;
        }

        test_case_list.forEach(tc_group => {
            if (tc_group.length) {
                tc_group.forEach(tc => {
                    tc.compound = {}
                    tc.inside_func_call_list = []
                })
            }
        })

        const global_var_list = await findGlobalVar(root_node);
        const test_case_str = await generateTestCaseString(test_case_list, global_func_list, global_var_list);

        const extern_global_func_str = await generateExternGlobalFuncString(global_func_list, test_module_name);
        const extern_global_var_str = await generateExternGlobalVariableString(global_var_list, test_module_name);

        const called_stub_func_list = await getStubFunc(root_node);
        const stub_func_str = await generateStubFuncDefineString(called_stub_func_list);

        const final_content = await insertToTestFile(test_folder_path, test_module_name, test_case_str, extern_global_func_str, extern_global_var_str, stub_func_str)

        // res.send({ root_node, header_root, test_case_list, global_func_list, called_stub_func_list, global_var_list, final_content });
        res.send(final_content);

        return;
    } catch (error) {
        // Handle errors here
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route for the API endpoint
app.get('/refactor', async (req, res) => {
    try {
        let test_folder_path = ''
        let test_module_name = ''
        if (req.query.absolute_path_of_testing_folder) {
            console.log('absolute_path_of_testing_folder');
            console.log(req.query.absolute_path_of_testing_folder);
            test_folder_path = req.query.absolute_path_of_testing_folder
        }
        if (req.query.module_name) {
            console.log('test_module_name');
            console.log(req.query.module_name);
            test_module_name = req.query.module_name.replace('.c', '');
        }

        let source_file_str = fs.readFileSync(`${test_folder_path}/${test_module_name}.c`, 'utf8');
        const source_tree = parser.parse(source_file_str);
        let stub_header_str = fs.readFileSync(`${test_folder_path}/test_${test_module_name}/test_${test_module_name}.h`, 'utf8');
        const stub_header_tree = parser.parse(stub_header_str);

        /** Just collect necessary data of root ( .c file )*/
        const cloned_source_tree = await cloneArrayTreeWithMark(source_tree.rootNode);
        const source_root = await markNumPreorderTree(cloned_source_tree, 1);
        const cloned_stub_header_tree = await cloneArrayTreeWithMark(stub_header_tree.rootNode);
        const stub_header_root = await markNumPreorderTree(cloned_stub_header_tree, 1);

        const source_global_var_list = await findGloabalVariableOfSourceFile(source_root);
        const stub_header_global_var_list = await findGloabalVariableOfHeaderFile(stub_header_root);
        const global_func_list = await findGlobalFuncDecl(source_root);

        const preproc_def_list = await findPreprocDefOfFile(stub_header_root);

        const stub_func_list = await findStubFunc(
            source_root,
            global_func_list,
            source_global_var_list,
            stub_header_global_var_list,
            preproc_def_list
        )
        res.send({ stub_header_root, preproc_def_list, stub_func_list });

        return;
    } catch (error) {
        // Handle errors here
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/test-func', async (req, res) => {
    const data = await test_function();
    res.send(data)
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