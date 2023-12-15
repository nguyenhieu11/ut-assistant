import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';
import { findIdentifier } from './identifier-handle.js';

export async function findPreProcDefine(root_node) {
    try {
        console.log("run findPreProcDefine");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */
        let preproc_list = [];
        /** Declare mark num of tree with preorder */
        async function findPreProcRecursive(node) {
            if (node.type == "preproc_def") {
                let preproc = {
                    mark: node.mark ? node.mark : null,
                    startPosition: node.startPosition,
                    endPosition: node.endPosition
                }
                for (let i = 0; i < node.childCount; i++) {
                    if (node.children[i].type == "identifier") {
                        preproc.identifier = node.children[i].text
                    } else if (node.children[i].type == "preproc_arg") {
                        preproc.preproc_arg = node.children[i].text
                    }
                }
                preproc_list.push(preproc)
            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findPreProcRecursive(node.children[i]);
                }
            }
        }

        await findPreProcRecursive(temp_root);

        return preproc_list;

    } catch (error) {
        throw error;
    }
}

export async function findEnumerator(root_node) {
    try {
        console.log("run findEnumerator");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */
        let enumerator_list = [];
        /** Declare mark num of tree with preorder */
        async function findEnumRecursive(node) {
            if (node.type == "enumerator") {
                let preproc = {
                    mark: node.mark ? node.mark : null,
                    startPosition: node.startPosition,
                    endPosition: node.endPosition
                }
                for (let i = 0; i < node.childCount; i++) {
                    if (node.children[i].type == "identifier") {
                        preproc.identifier = node.children[i].text
                    } else if (node.children[i].type == "number_literal") {
                        preproc.number_literal = node.children[i].text
                    }
                }
                enumerator_list.push(preproc)
            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findEnumRecursive(node.children[i]);
                }
            }
        }

        await findEnumRecursive(temp_root);

        return enumerator_list;

    } catch (error) {
        throw error;
    }
}