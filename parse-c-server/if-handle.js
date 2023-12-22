
import { json } from 'express';
import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';
import { findIdentifier } from './identifier-handle.js';

export async function findIfCondition(root_node) {
    try {
        console.log("run findIfCondition");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */

        let if_list = [];
        /** Declare mark num of tree with preorder */
        async function findIfRecursive(node) {
            if (node.type == "if_statement") {
                if_list.push(lodash.clone({
                    node: node,
                    mark: node.mark ? node.mark : null
                }))
            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findIfRecursive(node.children[i]);
                }
            }
        }

        await findIfRecursive(temp_root);

        return if_list;

    } catch (error) {
        throw error;
    }
}

export async function findChildIfCondition(root_node) {
    try {
        console.log("run findChildIfCondition");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */
        let child_if_list = [];
        /** Declare mark num of tree with preorder */
        async function findChildIfRecursive(node) {
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    if (node.children[i].type == "if_statement") {
                        /** Only push NOT existed node */
                        let is_existed = false;
                        child_if_list.forEach(ci => {
                            if (ci.mark === node.children[i].mark) {
                                is_existed = true;
                            }
                        })
                        if (!is_existed) {
                            child_if_list.push(lodash.clone({
                                node: node.children[i],
                                mark: node.children[i].mark ? node.children[i].mark : null
                            }))
                        }

                    }
                    await findChildIfRecursive(node.children[i]);
                }
            }
        }

        await findChildIfRecursive(temp_root);

        return child_if_list;

    } catch (error) {
        throw error;
    }
}

export async function findBinaryExpression(root_node) {

    try {
        console.log("run findBinaryExpression");
        let temp_root = lodash.clone(root_node);
        /** Try to re-mark the tree */
        if (!(await checkPreorder(temp_root))) {
            console.log("input root_node has null mark");
            temp_root = await markNumPreorderTree(temp_root, temp_root.mark);
        }

        /** Find if condition with recursive */

        let binary_expression_list = [];
        /** Declare mark num of tree with preorder */
        async function findBinaryExpressionRecursive(node) {
            if (node.type == "binary_expression") {
                let is_lowest_level = true;
                for (let i_check_lowest_level = 0; i_check_lowest_level < node.children.length; i_check_lowest_level++) {
                    if (node.children[i_check_lowest_level].children.length) {
                        console.log('this binary_expression is NOT lowest level')
                        console.log(node.text);
                        is_lowest_level = false;
                    }

                }
                if (is_lowest_level) {
                    binary_expression_list.push(lodash.clone({
                        // node,
                        // par_mark: par.mark,
                        mark: node.mark ? node.mark : null,
                        startPosition: node.startPosition,
                        endPosition: node.endPosition,
                        binary_expression: node.text,
                        node
                    }))
                }
            }
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await findBinaryExpressionRecursive(node.children[i]);
                }
            }
        }

        await findBinaryExpressionRecursive(temp_root);

        return binary_expression_list;

    } catch (error) {
        throw error;
    }
}

export async function getIfInfo(node) {
    if (node.type !== "if_statement") {
        console.log('This node have no if_statement type')
    }
    else {
        if (node.children.length) {
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].type === 'parenthesized_expression') {
                    return {
                        condition: node.children[i].text,
                        startPosition: node.children[i].startPosition,
                        endPosition: node.children[i].endPosition,
                        node: node.children[i]
                    }
                }
            }
        }
        return {}
    }

}

export async function getIfInfoList(if_list) {
    try {
        console.log("run getIfInfoList");
        let if_info_list = []

        let temp_if_list = lodash.clone(if_list);

        for (const e of temp_if_list) {
            const info = await getIfInfo(e.node);
            const child_if_list = await findChildIfCondition(e.node);
            const binary_expression_list = await findBinaryExpression(e.node)
            const identifier_list = await findIdentifier(e.node)

            let child_if_list_mark = []
            child_if_list.forEach(child => {
                child_if_list_mark.push(lodash.clone(child.mark))
            })

            let valid_binary_expression_list = []
            binary_expression_list.forEach(be => {
                if (child_if_list_mark.length) {
                    let min_child_mark = child_if_list_mark[0];
                    child_if_list_mark.forEach(cim => {
                        if (min_child_mark > cim) {
                            min_child_mark = cim
                        }
                    })

                    /** Only push the condition not existed */
                    if (be.mark >= e.mark && be.mark < min_child_mark) {
                        let existed_be = false;
                        valid_binary_expression_list.forEach(vbe => {
                            if (vbe.mark == be.mark) {
                                existed_be = true;
                            }
                        })
                        if (!existed_be) {
                            valid_binary_expression_list.push(lodash.clone(be))
                        }
                    }
                }
                else {
                    valid_binary_expression_list = binary_expression_list
                }
            })
            if_info_list.push(lodash.clone({
                par_mark: e.node.par_mark,
                mark: e.node.mark,
                info,
                child_if_list_mark,
                // binary_expression_list,
                valid_binary_expression_list,
                identifier_list,
            }))

        }
        // console.log('if_info_list ======================');
        // console.log(if_info_list);
        return if_info_list
    } catch (error) {
        throw error;
    }

}
