
import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from '../preorder-traversal.js';
// import { parseParameterDeclaration } from '../parameter-declaration/parameterDeclaration.js';
// import { parseVariableDeclaration } from '../variable-declaration/variableDeclaration.js';



export async function findStubFunc(root_node, global_func_list) {
    console.log("run findStubFunc");
    const stub_func_without_arg_type = await findStubFuncWithoutArgmType(root_node)
    const stub_func_list = await findArgmTypeOfStubFunc(stub_func_without_arg_type, global_func_list)
    return stub_func_list
}

async function findStubFuncWithoutArgmType(root_node) {
    try {
        console.log("run findStubFuncWithoutArgmType");
        let temp_root = lodash.clone(root_node);
        // /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }
        let stub_func_list = [];
        /** Declare recursive function */
        async function findCallExpressionRecursive(node) {
            if (node.type === 'call_expression') {
                let s_func = {}
                s_func.mark = node.mark
                s_func.text = node.text
                s_func.startPosition = node.startPosition
                s_func.endPosition = node.endPosition
                let is_dup = false
                for (const lv_1 of node.children) {
                    if (lv_1.type == 'identifier') {
                        for (const stub_func of stub_func_list) {
                            if (stub_func.identifier === lv_1.text) {
                                is_dup = true
                            }
                        }
                        s_func.identifier = lv_1.text
                    } else if (lv_1.type === 'argument_list') {
                        s_func.argument_list = []
                        let argm_index = 1
                        for (const lv_2 of lv_1.children) {
                            if ((lv_2.type === 'identifier')
                                || (lv_2.type === 'pointer_expression')
                                || lv_2.type === 'number_literal') {
                                let argm = {}
                                argm.mark = lv_2.mark
                                argm.text = lv_2.text
                                argm.startPosition = lv_2.startPosition
                                argm.endPosition = lv_2.endPosition
                                argm.re_identifier = `argm_${argm_index}`
                                argm.is_pointer = false
                                if (lv_2.type === 'identifier') {
                                    argm.identifier = lv_2.text
                                }
                                else if (lv_2.type === 'pointer_expression') {
                                    for (const lv_3 of lv_2.children) {
                                        if (lv_3.type === 'identifier') {
                                            argm.identifier = lv_3.text
                                        }
                                    }
                                    argm.is_pointer = true
                                } else if (lv_2.type === 'number_literal') {
                                    if (lv_2.text.includes('.')) {
                                        argm.primitive_type = 'float'
                                    } else if (lv_2.text.includes('-')) {
                                        argm.primitive_type = 'int32_t'
                                    } else {
                                        argm.primitive_type = 'uint32_t'
                                    }
                                }
                                s_func.argument_list.push(argm)
                                argm_index++
                            }
                        }
                    }
                }
                if (!is_dup) {
                    stub_func_list.push(s_func)
                }
            }
            for (let i = 0; i < node.children.length; i++) {
                await findCallExpressionRecursive(node.children[i])
            }
        }

        await findCallExpressionRecursive(temp_root)
        return stub_func_list
    } catch (error) {
        throw error;
    }
}

async function findArgmTypeOfStubFunc(stub_func_list, global_func_list) {
    try {
        console.log("run findArgmTypeOfStubFunc");


        for (const stub_func of stub_func_list) {
            for (const g_func of global_func_list) {
                /** Check stub_func is called inside g_func */
                if (g_func.children_mark_list.includes(stub_func.mark)) {
                    /** If argm is local var */
                    for (const local_var of g_func.local_var_list) {
                        for (const argm of stub_func.argument_list) {
                            if (argm.identifier === local_var.identifier) {
                                if (local_var.primitive_type) {
                                    argm.primitive_type = local_var.primitive_type
                                }
                                if (local_var.type_identifier) {
                                    argm.type_identifier = local_var.type_identifier
                                }
                                if (local_var.is_pointer && !argm.is_pointer) {
                                    console.log(`${argm.identifier} is pointer because local_var is pointer`)
                                    argm.is_pointer = true
                                }
                            }
                        }
                    }
                    /** If argm is parameter of global function ......... continue here... */
                    /** If argm is global var of source file ......... continue here... */
                    /** If argm is global var of stub.h  ......... continue here... */
                    /** If argm is preproc of source file  ......... continue here... */
                    /** If argm is preproc of stub.h  ......... continue here... */
                }
            }

        }
        return { stub_func_list, global_func_list }
        // return stub_func_list
    } catch (error) {
        throw error;
    }
}