import lodash from 'lodash';

/**
 * @param {tree} var_decl_node is node with type declaration
 * @returns {var_decl} information of declaration node
 */
export async function parseVariableDeclaration(var_decl_node) {
    try {
        let node = lodash.clone(var_decl_node)
        node.is_static = false
        node.is_pointer = false
        node.is_init = false

        if (node.type !== 'declaration') {
            console.log(`Mark: ${var_decl_node.mark}, 
                Text: ${var_decl_node.text} is not declaration node`)
            return {}
        }
        else {
            for (const lv_1 of node.children) {
                if (lv_1.type === 'storage_class_specifier' && lv_1.text === 'static') {
                    node.is_static = true
                }
                else if (lv_1.type === 'primitive_type') {
                    node.primitive_type = lv_1.text
                }
                else if (lv_1.type === 'type_identifier') {
                    node.type_identifier = lv_1.text
                }
                else if (lv_1.type === 'identifier') {
                    node.identifier = lv_1.text
                }
                else if (lv_1.type === 'pointer_declarator') {
                    node.is_pointer = true
                    for (const lv_2 of lv_1.children) {
                        if (lv_2.type === 'identifier') {
                            node.identifier = lv_2.text
                        }
                    }
                }
                else if (lv_1.type === 'init_declarator') {
                    node.is_init = true
                    node.init_declarator = lv_1.text
                    /** Check if init value for pointer */
                    let pointer_decl_node = {}
                    for (const lv_2 of lv_1.children) {
                        if (lv_2.type === 'pointer_declarator') {
                            node.is_pointer = true
                            pointer_decl_node = lv_2
                        }
                    }
                    if (node.is_pointer) {
                        for (const child_node of pointer_decl_node.children) {
                            if (child_node.type === 'identifier') {
                                node.identifier = child_node.text
                            }
                        }
                    }
                    /** Init with normal variable */
                    else {
                        node.identifier = lv_1.children[0].text
                    }
                    /** Same with pointer and normal variable */
                    if (lv_1.children[1].text === '=') {
                        node.init_value = lv_1.children[2].text
                    }
                }
            }
        }
        delete node.children
        return node
    }
    catch (error) {
        throw (error)
    }
}

/**
 * 
 * @param {tree} root_node is root node of source file (.c)
 * @returns {var_decl[]}global variable list
 */
export async function findGloabalVariable(root_node) {
    try {
        console.log("run findGloabalVariable");
        if (root_node.type !== 'translation_unit') {
            console.log('Error: This node is NOT root of c file');
            return [];
        }

        let temp_root = lodash.clone(root_node);
        // /** Try to re-mark the tree */
        // if (!(await checkPreorder(temp_root))) {
        //     console.log("input root_node has null mark");
        //     temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        // }

        let global_var_list = [];
        for (const lv_1 of temp_root.children) {
            if (lv_1.type == 'declaration') {
                let global_var = await parseVariableDeclaration(lv_1)
                global_var_list.push(lodash.clone(global_var));
            }
        }

        return global_var_list;
    }
    catch (error) {
        throw (error)
    }
}