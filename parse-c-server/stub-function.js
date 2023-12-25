import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';


export async function getStubFunc(root_node) {
    const no_assigned_stub_func_list = await findNoAssignedStubFunc(root_node);
    const assigned_stub_func_list = await findAssignedStubFunc(root_node);

    // const stub_func_info_list = await getDataTypeOfStubFunc(root_node, assigned_stub_func_list, no_assigned_stub_func_list)

    const param_data_type_list = await getParamDataTypeOfStubFunc(root_node, assigned_stub_func_list, no_assigned_stub_func_list);

    return { no_assigned_stub_func_list, assigned_stub_func_list }


    // let stub_func_info_list = []
    // for (const stub of called_stub_func_list) {
    //     const stub_info = await analyzeStubFunc(stub);
    //     stub_func_info_list.push(lodash.clone(stub_info));
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
                                        stub_func.argument_list.push(lodash.clone(arg_info))
                                    } else if (lv_3.type == "pointer_expression") {
                                        let arg_info = {}
                                        arg_info.type = "pointer_expression"
                                        for (const lv_4 of lv_3.children) {
                                            if (lv_4.type == "identifier") {
                                                arg_info.pointer_expression = lv_4.text;
                                            }
                                        }
                                        stub_func.argument_list.push(lodash.clone(arg_info))
                                    }
                                }
                            }
                        }

                        no_assigned_stub_func_list.push(lodash.clone(stub_func));
                    }
                }

            }
            if (node.children.length) {
                for (let i = 0; i < node.children.length; i++) {
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
                unique_no_assigned_stub_func_list.push(lodash.clone(e));
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
                                /** Start -  Get left side of assignment */
                                for (const temp of lv_1.children) {
                                    if (temp.type == "identifier") {
                                        stub_func.assign_to = {}
                                        stub_func.assign_to.identifier = temp.text
                                    }
                                }
                                /** End - Get left side of assignment */

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
                                                stub_func.argument_list.push(lodash.clone(arg_info))
                                            } else if (lv_4.type == "pointer_expression") {
                                                let arg_info = {}
                                                arg_info.type = "pointer_expression"
                                                for (const lv_5 of lv_4.children) {
                                                    if (lv_5.type == "identifier") {
                                                        arg_info.pointer_expression = lv_5.text;
                                                    }
                                                }
                                                stub_func.argument_list.push(lodash.clone(arg_info))
                                            }
                                        }
                                    }
                                }
                                assigned_stub_func_list.push(lodash.clone(stub_func));
                            }
                        }
                    }
                }
            }
            if (node.children.length) {
                for (let i = 0; i < node.children.length; i++) {
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
                unique_assigned_stub_func_list.push(lodash.clone(e));
            }
        })
        return unique_assigned_stub_func_list;
    } catch (error) {
        throw error;
    }
}

export async function getParamDataTypeOfStubFunc(root_node, assigned_stub_func_list, no_assigned_stub_func_list) {
    try {
        console.log("run getParamDataTypeOfStubFunc");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        let all_stub_func_list = [...assigned_stub_func_list, ...no_assigned_stub_func_list]
        let return_data = []
        for (const stub_func of all_stub_func_list) {
            /** Get global function use this stub_func */
            let global_func = {};
            for (const lv_1 of temp_root.children) {
                if (lv_1.type == "function_definition") {
                    if (lv_1.startPosition.row <= stub_func.startPosition.row && lv_1.endPosition.row >= stub_func.endPosition.row) {
                        global_func = lv_1
                    }
                }
            }

            let local_var_list = []
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
                            local_var_list.push(lodash.clone(saved_var));
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
                                local_var_list.push(lodash.clone(saved_var));
                            } else if (lv_1.children[0].type == "pointer_declarator") {
                                local_var_info.pointer_declarator = lv_1.children[0].text
                                local_var_info.value = lv_1.children[2].text

                                for (const lv_2 of lv_1.children[0].children) {
                                    if (lv_2.type == "identifier") {
                                        local_var_info.identifier = lv_2.text
                                        /** Save var */
                                        let saved_var = lodash.clone(local_var_info);
                                        local_var_list.push(lodash.clone(saved_var));
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
                                    local_var_list.push(lodash.clone(saved_var));
                                }
                            }
                        }
                    }
                    // local_var_list.push(lodash.clone(local_var_info);
                }
                if (node.children.length) {
                    for (let i = 0; i < node.children.length; i++) {
                        await getLocalDeclarationListRecursive(node.children[i]);
                    }
                }
            }

            await getLocalDeclarationListRecursive(global_func)

            /** For both assigned and no-assigned stub func */
            for (const argm of stub_func.argument_list) {
                for (const local_var of local_var_list) {
                    if (argm.identifier == local_var.identifier) {
                        if (local_var.primitive_type) {
                            argm.primitive_type = local_var.primitive_type
                        } else if (local_var.type_identifier) {
                            argm.type_identifier = local_var.type_identifier
                        }
                        if (local_var.pointer_declarator) {
                            argm.pointer_declarator = local_var.pointer_declarator
                        }
                    } else if (argm.pointer_expression == local_var.identifier) {
                        if (local_var.primitive_type) {
                            argm.primitive_type = local_var.primitive_type
                        } else if (local_var.type_identifier) {
                            argm.type_identifier = local_var.type_identifier
                        }
                        if (local_var.pointer_declarator) {
                            argm.pointer_declarator = local_var.pointer_declarator
                        }
                    }
                }
            }

            /** Only For Assigned stub func */
            if (stub_func.assign_to?.identifier) {
                for (const local_var of local_var_list) {
                    if (stub_func.assign_to.identifier == local_var.identifier) {
                        if (local_var.primitive_type) {
                            stub_func.assign_to.data_type = local_var.primitive_type
                        } else if (local_var.type_identifier) {
                            stub_func.assign_to.data_type = local_var.type_identifier
                        }
                    }
                }
            }
            /** Get parameter data type of function */
            return_data.push(lodash.clone({ ...stub_func, local_var_list }))
        }

        return return_data
    } catch (error) {
        throw error;
    }
}

export async function generateStubFuncDefineString(called_stub_func_list, module_name) {
    try {
        const { no_assigned_stub_func_list, assigned_stub_func_list } = called_stub_func_list

        /** Create extern stub functions string */
        let extern_str = `\nextern "C" {`
        extern_str += `\n/** Function directly return void */`
        for (const no_assigned_func of no_assigned_stub_func_list) {
            extern_str += `\n\tvoid ${no_assigned_func.identifier}(`
            /** Function has no argument */
            if (no_assigned_func.argument_list.length) {
                for (const argm of no_assigned_func.argument_list) {
                    if (argm.identifier) {
                        if (argm.pointer_declarator) {
                            if (argm.primitive_type) {
                                extern_str += ` ${argm.primitive_type} *${argm.identifier},`
                            } else if (argm.type_identifier) {
                                extern_str += ` ${argm.type_identifier} *${argm.identifier},`
                            }
                        }
                        else {
                            if (argm.primitive_type) {
                                extern_str += ` ${argm.primitive_type} ${argm.identifier},`
                            } else if (argm.type_identifier) {
                                extern_str += ` ${argm.type_identifier} ${argm.identifier},`
                            }
                        }
                    } else if (argm.pointer_expression) {
                        if (argm.primitive_type) {
                            extern_str += ` ${argm.primitive_type} *${argm.pointer_expression},`
                        } else if (argm.type_identifier) {
                            extern_str += ` ${argm.type_identifier} *${argm.pointer_expression},`
                        }
                    }
                }
                extern_str = extern_str.slice(0, -1);
            }

            extern_str += `){}`
        }
        extern_str += `\n\n/** Stub function affect to code */`
        for (const assigned_func of assigned_stub_func_list) {
            extern_str += `\n\t${assigned_func.assign_to.data_type} ${assigned_func.identifier}(`

            if (assigned_func.argument_list.length) {
                for (const argm of assigned_func.argument_list) {
                    if (argm.identifier) {
                        /** Pointer */
                        if (argm.pointer_declarator) {
                            if (argm.primitive_type) {
                                extern_str += ` ${argm.primitive_type} *${argm.identifier},`
                            } else if (argm.type_identifier) {
                                extern_str += ` ${argm.type_identifier} *${argm.identifier},`
                            }
                        }
                        /** NOT pointer */
                        else {
                            if (argm.primitive_type) {
                                extern_str += ` ${argm.primitive_type} ${argm.identifier},`
                            } else if (argm.type_identifier) {
                                extern_str += ` ${argm.type_identifier} ${argm.identifier},`
                            }
                        }

                    } else if (argm.pointer_expression) {
                        if (argm.primitive_type) {
                            extern_str += ` ${argm.primitive_type} *${argm.pointer_expression},`
                        } else if (argm.type_identifier) {
                            extern_str += ` ${argm.type_identifier} *${argm.pointer_expression},`
                        }
                    }
                }
                extern_str = extern_str.slice(0, -1);
            }

            extern_str += `);`
        }
        extern_str += `\n}`

        /** Create MOCK stub functions string */
        let mock_str = ''
        for (const assigned_func of assigned_stub_func_list) {
            mock_str += `\nMOCK_METHOD${assigned_func.argument_list.length}(${assigned_func.identifier}, ${assigned_func.assign_to?.data_type}(`
            if (assigned_func.argument_list.length) {
                for (const argm of assigned_func.argument_list) {
                    if (argm.identifier) {
                        if (argm.pointer_declarator) {
                            if (argm.primitive_type) {
                                mock_str += ` ${argm.primitive_type} *${argm.identifier},`
                            } else if (argm.type_identifier) {
                                mock_str += ` ${argm.type_identifier} *${argm.identifier},`
                            }
                        } else {
                            if (argm.primitive_type) {
                                mock_str += ` ${argm.primitive_type} ${argm.identifier},`
                            } else if (argm.type_identifier) {
                                mock_str += ` ${argm.type_identifier} ${argm.identifier},`
                            }
                        }
                    } else if (argm.pointer_expression) {
                        if (argm.primitive_type) {
                            mock_str += ` ${argm.primitive_type} *${argm.pointer_expression},`
                        } else if (argm.type_identifier) {
                            mock_str += ` ${argm.type_identifier} *${argm.pointer_expression},`
                        }
                    }
                }
                mock_str = mock_str.slice(0, -1);
            }
            mock_str += `));`;
        }
        mock_str += `\n`;

        /** Create Define stub functions string */
        let define_str = ''
        for (const assigned_func of assigned_stub_func_list) {
            define_str += `\n${assigned_func.assign_to?.data_type} ${assigned_func.identifier}(`

            if (assigned_func.argument_list.length) {
                for (const argm of assigned_func.argument_list) {
                    if (argm.identifier) {
                        if (argm.pointer_declarator) {
                            if (argm.primitive_type) {
                                define_str += ` ${argm.primitive_type} *${argm.identifier},`
                            } else if (argm.type_identifier) {
                                define_str += ` ${argm.type_identifier} *${argm.identifier},`
                            }
                        } else {
                            if (argm.primitive_type) {
                                define_str += ` ${argm.primitive_type} ${argm.identifier},`
                            } else if (argm.type_identifier) {
                                define_str += ` ${argm.type_identifier} ${argm.identifier},`
                            }
                        }

                    } else if (argm.pointer_expression) {
                        if (argm.primitive_type) {
                            define_str += ` ${argm.primitive_type} *${argm.pointer_expression},`
                        } else if (argm.type_identifier) {
                            define_str += ` ${argm.type_identifier} *${argm.pointer_expression},`
                        }
                    }
                }
                define_str = define_str.slice(0, -1);
            }

            define_str += `)`
            define_str += `{\n\t`;
            define_str += `return Stub::s_instance->${assigned_func.identifier}(`
            if (assigned_func.argument_list.length) {
                for (const argm of assigned_func.argument_list) {
                    if (argm.identifier) {
                        define_str += ` ${argm.identifier},`
                    } else if (argm.pointer_expression) {
                        define_str += ` ${argm.pointer_expression},`
                    }
                }
                define_str = define_str.slice(0, -1);
            }
            define_str += `);`
            define_str += `\n}`
        }
        return { extern_str, mock_str, define_str };

    } catch (error) {
        throw error;
    }
}