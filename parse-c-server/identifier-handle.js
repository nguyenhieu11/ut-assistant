import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';

export async function findIdentifier(root_node) {
    try {
        console.log("run findIdentifier");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */

        let identifier_list = [];
        /** Declare mark num of tree with preorder */
        async function findIdentifierRecursive(node) {
            if (node.type == "identifier") {
                identifier_list.push({
                    mark: node.mark ? node.mark : null,
                    startPosition: node.startPosition,
                    endPosition: node.endPosition,
                    identifier: node.text,
                    node
                })
            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findIdentifierRecursive(node.children[i]);
                }
            }
        }

        await findIdentifierRecursive(temp_root);

        return identifier_list;

    } catch (error) {
        throw error;
    }
}

export async function findGlobalVar(root_node) {
    try {
        console.log("run findGlobalVar");
        if (root_node.type !== 'translation_unit') {
            console.log('Error: This node is NOT root of c file');
            return [];
        }

        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */

        let global_var_list = [];
        for (const lv_1 of root_node.children) {
            if (lv_1.type == 'declaration') {
                let global_var = {}
                for (const lv_2 of lv_1.children) {
                    if (lv_2.type == 'primitive_type') {
                        global_var.primitive_type = lv_2.text
                    } else if (lv_2.type == 'type_identifier') {
                        global_var.type_identifier = lv_2.text
                    }
                    else if (lv_2.type == 'identifier') {
                        global_var.identifier = lv_2.text
                    } else if (lv_2.type == 'init_declarator') {
                        global_var.init_declarator = lv_2.text
                        for (const lv_3 of lv_2.children) {
                            if (lv_3.type == 'identifier') {
                                global_var.identifier = lv_3.text
                            }
                        }
                    }
                }
                global_var_list.push(global_var);
            }
        }


        return global_var_list;

    } catch (error) {
        throw error;
    }
}


