import lodash from 'lodash';

/**
 * @param {tree} param_decl_node is node with type parameter_declaration
 * @returns {param_decl_info} information of parameter_declaration node
 */
export async function parseParameterDeclaration(param_decl_node) {
    try {
        let node = lodash.clone(param_decl_node);
        node.is_pointer = false
        if (node.type !== 'parameter_declaration') {
            console.log(`Mark: ${param_decl_node.mark}, 
                Text: ${param_decl_node.text} is not parameter_declaration node`)
            return {}
        }
        else {
            for (const lv_1 of node.children) {
                if (lv_1.type == 'primitive_type') {
                    node.primitive_type = lv_1.text
                }
                else if (lv_1.type == 'type_identifier') {
                    node.type_identifier = lv_1.text
                }
                else if (lv_1.type == 'identifier') {
                    node.identifier = lv_1.text
                }
                else if (lv_1.type == 'pointer_declarator') {
                    node.is_pointer = true
                    for (const lv_2 of lv_1.children) {
                        if (lv_2.type == 'identifier') {
                            node.identifier = lv_2.text
                        }
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