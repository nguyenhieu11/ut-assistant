
import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';

export async function findTestFunc(root_node) {
    try {
        console.log("run findTestFunc");

        if (root_node.type !== 'translation_unit') {
            console.log('Error: This node is not translation_unit')
        }
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */

        let test_func_list = [];
        /** Declare mark num of tree with preorder */
        for (const lv_1 of temp_root.children) {
            if (lv_1.type == 'function_definition') {
                let func = {}
                func.startPosition = lv_1.startPosition;
                func.endPosition = lv_1.endPosition;
                for (const lv_2 of lv_1.children) {
                    if (lv_2.type == 'storage_class_specifier') {
                        func.storage_class_specifier = lv_2.text;
                    }
                    else if (lv_2.type == 'type_identifier') {
                        func.type_identifier = lv_2.text;
                    }
                    else if (lv_2.type == 'primitive_type') {
                        func.primitive_type = lv_2.text
                    } else if (lv_2.type == 'function_declarator') {
                        func.function_declarator = lv_2.text;
                        for (const lv_3 of lv_2.children) {
                            if (lv_3.type == 'identifier') {
                                func.identifier = lv_3.text;
                            }
                            else if (lv_3.type == 'parameter_list') {
                                let declarator_list = [];
                                for (const lv_4 of lv_3.children) {
                                    if (lv_4.type == 'parameter_declaration') {
                                        let param = {}
                                        for (const lv_5 of lv_4.children) {
                                            if (lv_5.type == 'primitive_type') {
                                                param.primitive_type = lv_5.text
                                            }
                                            else if (lv_5.type == 'type_identifier') {
                                                param.type_identifier = lv_5.text
                                            }
                                            else if (lv_5.type == 'identifier') {
                                                param.identifier = lv_5.text
                                            }
                                            else if (lv_5.type == 'pointer_declarator') {
                                                param.pointer_declarator = lv_5.text
                                            }
                                        }
                                        declarator_list.push(lodash.clone(param))
                                        // declarator_list.push(lodash.clone(lv_4.text);
                                    }
                                }
                                func.declarator_list = declarator_list;
                            }
                        }
                    }
                }
                test_func_list.push(lodash.clone(func));
            }
        }

        // await findTestFuncRecursive(temp_root);
        // console.log(temp_root.type)
        return test_func_list;

    } catch (error) {
        throw error;
    }
}
