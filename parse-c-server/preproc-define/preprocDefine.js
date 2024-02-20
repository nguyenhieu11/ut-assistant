import lodash from 'lodash';

/**
 * @param {tree} preproc_def_node is node with type preproc_def
 * @returns {preproc_def} information preprocess define
 */

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


export async function parsePreprocDefine(preproc_def_node) {
    try {
        let node = lodash.clone(preproc_def_node)
        if (node.type !== 'preproc_def') {
            console.log(`Mark: ${preproc_def_node.mark}, 
                Text: ${preproc_def_node.text} is not declaration node`)
            return {}
        }

        for (const lv_1 of node.children) {
            if (lv_1.type === 'identifier') {
                node.identifier = lv_1.text
            }
            else if (lv_1.type === 'preproc_arg') {
                /** Using trim() to remove whitespace */
                let preproc_arg = lv_1.text.trim()

                node.arg_is_number = false
                if (isNumeric(preproc_arg.slice(0, -1)) &&
                    (preproc_arg[preproc_arg.length - 1] === 'U' || preproc_arg[preproc_arg.length - 1] === 'u')
                ) {
                    node.preproc_arg = preproc_arg.slice(0, -1)
                    node.arg_is_number = true
                }
                else if (isNumeric(preproc_arg)) {
                    node.arg_is_number = true
                    if (preproc_arg.includes('.')) {
                        node.arg_data_type = 'float'
                    } else if (preproc_arg.includes('-')) {
                        node.arg_data_type = 'int32'
                    } else {
                        node.arg_data_type = 'uint32'
                    }
                }
                else {
                    node.preproc_arg = preproc_arg
                    /** Need check type of argument ......... Continue here......... */
                }

                node.preproc_arg = preproc_arg
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
 * @param {tree} root_node is root node of file
 * @returns {preproc_def_list[]} preproc define list
 */
export async function findPreprocDefOfFile(root_node) {
    try {
        console.log("run findPreprocDefOfFile");
        let temp_root = lodash.clone(root_node);
        let preproc_def_list = [];

        async function findPreprocDefRecursive(node) {
            if (node.type == "preproc_def") {
                // console.log(node.text)
                let preproc_def = await parsePreprocDefine(node)
                preproc_def_list.push(preproc_def)
            }
            if (node.children.length) {
                for (let i = 0; i < node.children.length; i++) {
                    await findPreprocDefRecursive(node.children[i]);
                }
            }
        }

        await findPreprocDefRecursive(temp_root);
        return preproc_def_list;
    }
    catch (error) {
        throw (error)
    }
}