import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';


export async function getStubFunc(root_node) {
    const no_assigned_stub_func_list = await findNoAssignedStubFunc(root_node);
    const assigned_stub_func_list = await findAssignedStubFunc(root_node);

    // const stub_func_info_list = await getDataTypeOfStubFunc(root_node, assigned_stub_func_list, no_assigned_stub_func_list)

    const data_type_assing = await getDataTypeOfAssignedStubFunc(root_node, assigned_stub_func_list);

    return { no_assigned_stub_func_list, assigned_stub_func_list, data_type_assing }


    // let stub_func_info_list = []
    // for (const stub of called_stub_func_list) {
    //     const stub_info = await analyzeStubFunc(stub);
    //     stub_func_info_list.push(stub_info);
    // }
    // return stub_func_info_list;

}

export async function findNoAssignedStubFunc(root_node) {
    try {
        console.log("run findNoAssignedStubFunc");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find called stub function with recursive */
        let no_assigned_stub_func_list = [];
        /** Declare mark num of tree with preorder */
        async function findNoAssignedStubFuncRecursive(node) {
            if (node.type == "expression_statement") {
                for (const lv_1 of node.children) {
                    if (lv_1.type == "call_expression") {
                        let stub_func = {}
                        stub_func.mark = lv_1.mark
                        stub_func.startPosition = lv_1.startPosition
                        stub_func.endPosition = lv_1.endPosition
                        for (const lv_2 of lv_1.children) {
                            if (lv_2.type == "identifier") {
                                stub_func.identifier = lv_2.text;
                            } else if (lv_2.type == "argument_list") {
                                stub_func.argument_list_text = lv_2.text;
                                stub_func.argument_list = []
                                for (const lv_3 of lv_2.children) {
                                    if (lv_3.type == "identifier") {
                                        let arg_info = {}
                                        arg_info.type = "identifier"
                                        arg_info.identifier = lv_3.text;
                                        stub_func.argument_list.push(arg_info)
                                    } else if (lv_3.type == "pointer_expression") {
                                        let arg_info = {}
                                        arg_info.type = "pointer_expression"
                                        for (const lv_4 of lv_3.children) {
                                            if (lv_4.type == "identifier") {
                                                arg_info.pointer_expression = lv_4.text;
                                            }
                                        }
                                        stub_func.argument_list.push(arg_info)
                                    }
                                }
                            }
                        }

                        no_assigned_stub_func_list.push(stub_func);
                    }
                }

            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findNoAssignedStubFuncRecursive(node.children[i]);
                }
            }
        }

        await findNoAssignedStubFuncRecursive(temp_root);

        /** Remove duplicate function */
        let unique_no_assigned_stub_func_list = []
        no_assigned_stub_func_list.forEach((e) => {
            let is_unique = true
            for (let func of unique_no_assigned_stub_func_list) {
                if (e.identifier == func.identifier) {
                    is_unique = false;
                }
            }
            if (is_unique) {
                unique_no_assigned_stub_func_list.push(e);
            }
        })
        return unique_no_assigned_stub_func_list;
    } catch (error) {
        throw error;
    }
}

export async function findAssignedStubFunc(root_node) {
    try {
        console.log("run findAssignedStubFunc");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find called stub function with recursive */
        let assigned_stub_func_list = [];
        /** Declare mark num of tree with preorder */
        async function findAssignedStubFuncRecursive(node) {
            if (node.type == "expression_statement") {
                for (const lv_1 of node.children) {
                    if (lv_1.type == "assignment_expression") {
                        for (const lv_2 of lv_1.children) {
                            if (lv_2.type == "call_expression") {
                                let stub_func = {}
                                stub_func.mark = lv_2.mark
                                stub_func.startPosition = lv_2.startPosition
                                stub_func.endPosition = lv_2.endPosition
                                for (const lv_3 of lv_2.children) {
                                    if (lv_3.type == "identifier") {
                                        stub_func.identifier = lv_3.text;
                                    } else if (lv_3.type == "argument_list") {
                                        stub_func.argument_list_text = lv_3.text;
                                        stub_func.argument_list = []
                                        for (const lv_4 of lv_3.children) {
                                            if (lv_4.type == "identifier") {
                                                let arg_info = {}
                                                arg_info.type = "identifier"
                                                arg_info.identifier = lv_4.text;
                                                stub_func.argument_list.push(arg_info)
                                            } else if (lv_4.type == "pointer_expression") {
                                                let arg_info = {}
                                                arg_info.type = "pointer_expression"
                                                for (const lv_5 of lv_4.children) {
                                                    if (lv_5.type == "identifier") {
                                                        arg_info.pointer_expression = lv_5.text;
                                                    }
                                                }
                                                stub_func.argument_list.push(arg_info)
                                            }
                                        }
                                    }
                                }
                                assigned_stub_func_list.push(stub_func);
                            }
                        }
                    }
                }
            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findAssignedStubFuncRecursive(node.children[i]);
                }
            }
        }

        await findAssignedStubFuncRecursive(temp_root);

        /** Remove duplicate function */
        let unique_assigned_stub_func_list = []
        assigned_stub_func_list.forEach((e) => {
            let is_unique = true
            for (let func of unique_assigned_stub_func_list) {
                if (e.identifier == func.identifier) {
                    is_unique = false;
                }
            }
            if (is_unique) {
                unique_assigned_stub_func_list.push(e);
            }
        })
        return unique_assigned_stub_func_list;
    } catch (error) {
        throw error;
    }
}

export async function getDataTypeOfAssignedStubFunc(root_node, assigned_stub_func_list) {
    try {
        console.log("run getDataTypeOfAssignedStubFunc");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        let return_data = []
        for (const stub_func of assigned_stub_func_list) {
            /** Get global function use this stub_func */
            let global_func = {};
            for (const lv_1 of temp_root.children) {
                if (lv_1.type == "function_definition") {
                    if (lv_1.startPosition.row <= stub_func.startPosition.row && lv_1.endPosition.row >= stub_func.endPosition.row) {
                        global_func = lv_1
                    }
                }
            }

            let local_var_data_type_list = []
            async function getLocalDeclarationListRecursive(node) {
                if (node.type == "declaration") {
                    let local_var_info = {}
                    for (const lv_1 of node.children) {
                        if (lv_1.type == "primitive_type") {
                            local_var_info.primitive_type = lv_1.text
                        }
                        else if (lv_1.type == "type_identifier") {
                            local_var_info.type_identifier = lv_1.text
                        }
                        else if (lv_1.type == "identifier") {
                            local_var_info.identifier = lv_1.text;

                            /** Save var */
                            let saved_var = lodash.clone(local_var_info);
                            local_var_data_type_list.push(saved_var);
                        }
                        else if (lv_1.type == "init_declarator") {
                            /** Not pointer */
                            if (lv_1.children[0].type == "identifier") {
                                local_var_info.identifier = lv_1.children[0].text
                                local_var_info.between = lv_1.children[1].text
                                if (lv_1.children[2].type == "number_literal") {
                                    local_var_info.number_literal = lv_1.children[2].text
                                } else if (lv_1.children[2].type == "identifier") {
                                    local_var_info.identifier_value = lv_1.children[2].text
                                }
                                /** Save var */
                                let saved_var = lodash.clone(local_var_info);
                                local_var_data_type_list.push(saved_var);
                            } else if (lv_1.children[0].type == "pointer_declarator") {
                                local_var_info.pointer_declarator = lv_1.children[0].text
                                local_var_info.value = lv_1.children[2].text

                                for (const lv_2 of lv_1.children[0].children) {
                                    if (lv_2.type == "identifier") {
                                        local_var_info.identifier = lv_2.text
                                        /** Save var */
                                        let saved_var = lodash.clone(local_var_info);
                                        local_var_data_type_list.push(saved_var);
                                    }
                                }
                            }

                        }
                        else if (lv_1.type == "pointer_declarator") {
                            local_var_info.pointer_declarator = lv_1.text;
                            for (const lv_2 of lv_1.children) {
                                if (lv_2.type == "identifier") {
                                    local_var_info.identifier = lv_2.text
                                    /** Save var */
                                    let saved_var = lodash.clone(local_var_info);
                                    local_var_data_type_list.push(saved_var);
                                }
                            }
                        }
                    }
                    // local_var_data_type_list.push(local_var_info);

                }
                if (node.childCount) {
                    for (let i = 0; i < node.childCount; i++) {
                        await getLocalDeclarationListRecursive(node.children[i]);
                    }
                }
            }

            await getLocalDeclarationListRecursive(global_func)
            return_data.push({ ...stub_func, local_var_data_type_list })
        }

        return return_data
    } catch (error) {
        throw error;
    }
}