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
