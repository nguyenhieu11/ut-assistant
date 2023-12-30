
import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from '../preorder-traversal.js';
import { parseParameterDeclaration } from '../parameter-declaration/parameterDeclaration.js';
import { parseVariableDeclaration } from '../variable-declaration/variableDeclaration.js';

/**
 * 
 * @param {tree} func_def_node is node with type is 'function_definition'
 * @returns {var_decl[]} list of local var of function
 */
export async function findLocalVarOfFunc(func_def_node) {
    try {
        console.log("run findLocalVarOfFunc");

        if (func_def_node.type !== 'function_definition') {
            console.log('Error: This node is not function_definition')
        }
        let temp_root = lodash.clone(func_def_node);
        /** Try to re-mark the tree */
        // if (!(await checkPreorder(temp_root))) {
        //     console.log("input func_def_node has null mark");
        //     temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        // }

        /** Find local var with recursive */
        let local_var_list = []

        async function findLocalVarRecursive(node) {
            if (node.type == "declaration") {
                // console.log(node.text)
                let local_var = await parseVariableDeclaration(node)
                local_var_list.push(local_var)
            }
            if (node.children.length) {
                for (let i = 0; i < node.children.length; i++) {
                    await findLocalVarRecursive(node.children[i]);
                }
            }
        }

        await findLocalVarRecursive(temp_root);

        return local_var_list;

    } catch (error) {
        throw error;
    }
}

export async function findChildrenMarkList(func_def_node) {
    try {
        console.log("run findLocalVarOfFunc");

        if (func_def_node.type !== 'function_definition') {
            console.log('Error: This node is not function_definition')
        }
        let temp_root = lodash.clone(func_def_node);
        /** Try to re-mark the tree */
        // if (!(await checkPreorder(temp_root))) {
        //     console.log("input func_def_node has null mark");
        //     temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        // }

        /** Find local var with recursive */
        let children_mark_list = []

        async function findChildrenMarkList(node) {

            children_mark_list.push(node.mark)

            if (node.children.length) {
                for (let i = 0; i < node.children.length; i++) {
                    await findChildrenMarkList(node.children[i]);
                }
            }
        }

        await findChildrenMarkList(temp_root);

        return children_mark_list;

    } catch (error) {
        throw error;
    }
}
/**
 * 
 * @param {tree} root_node is root node of source file (.c)
 * @returns {func_def[]} list of global function
 */
export async function findGlobalFuncDecl(root_node) {
    try {
        console.log("run findGlobalFuncDecl");

        if (root_node.type !== 'translation_unit') {
            console.log('Error: This node is not translation_unit')
        }
        let temp_root = lodash.clone(root_node);
        // /** Try to re-mark the tree */
        // if (!(await checkPreorder(temp_root))) {
        //     console.log("input root_node has null mark");
        //     temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        // }

        /** Find if condition with recursive */

        let global_func_list = [];
        /** Declare mark num of tree with preorder */
        for (const lv_1 of temp_root.children) {
            if (lv_1.type == 'function_definition') {
                let func = {}
                func.mark = lv_1.mark
                func.text = lv_1.text
                func.startPosition = lv_1.startPosition;
                func.endPosition = lv_1.endPosition;

                func.is_static = false
                for (const lv_2 of lv_1.children) {
                    if (lv_2.type == 'storage_class_specifier' && lv_2.text === 'static') {
                        func.is_static = true
                    }
                    else if (lv_2.type == 'type_identifier') {
                        func.type_identifier = lv_2.text
                    }
                    else if (lv_2.type == 'primitive_type') {
                        func.primitive_type = lv_2.text
                    } else if (lv_2.type == 'function_declarator') {
                        func.function_declarator = lv_2.text
                        for (const lv_3 of lv_2.children) {
                            if (lv_3.type == 'identifier') {
                                func.identifier = lv_3.text
                            }
                            else if (lv_3.type == 'parameter_list') {
                                let param_decl_list = []
                                for (const lv_4 of lv_3.children) {
                                    if (lv_4.type == 'parameter_declaration') {
                                        let param = await parseParameterDeclaration(lv_4)
                                        param_decl_list.push(lodash.clone(param))
                                        // param_decl_list.push(lodash.clone(lv_4.text);
                                    }
                                }
                                func.param_decl_list = param_decl_list;
                            }
                        }
                    }
                }
                func.local_var_list = await findLocalVarOfFunc(lv_1)
                func.children_mark_list = await findChildrenMarkList(lv_1)
                global_func_list.push(lodash.clone(func));
            }
        }

        // await findGlobalFuncRecursive(temp_root);
        // console.log(temp_root.type)
        return global_func_list;

    } catch (error) {
        throw error;
    }
}

