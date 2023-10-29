
/**
 * https://www.geeksforgeeks.org/preorder-traversal-of-a-n-ary-tree/?ref=lbp
 */
export function preorderTraversal(root) {
    let stack = [];
    // 'Preorder'-> contains all the
    // visited nodes.

    let preorder = [];
    console.log("Start Func")
    console.log(preorder)
    preorder.push(root.mark);
    stack.push(root);
    while (stack.length > 0) {
        // 'flag' checks whether all the child
        // nodes have been visited.
        let flag = 0;
        // CASE 1- If Top of the stack is a leaf
        // node then remove it from the stack:
        if (stack[stack.length - 1].children.length === 0) {
            let x = stack.pop();
            // CASE 2- If Top of the stack is
            // Parent with children:
        } else {
            let par = stack[stack.length - 1];
            // a)As soon as an unvisited child is
            // found(left to right sequence),
            // Push it to Stack and Store it in
            // Auxiliary List(Marked Visited)
            // Start Again from Case-1, to explore
            // this newly visited child
            for (let i = 0; i < par.children.length; i++) {
                if (!preorder.includes(par.children[i].mark)) {
                    flag = 1;
                    stack.push(par.children[i]);
                    preorder.push(par.children[i].mark);
                    break;
                }
                // b)If all Child nodes from left to right
                // of a Parent have been visited
                // then remove the parent from the stack.
            }
            if (flag === 0) {
                stack.pop();
            }
        }
    }
    // console.log(preorder);
    return preorder
}


export function findIfCondition(root) {
    let stack = [];
    // 'Preorder'-> contains all the
    // visited nodes.
    let if_list = [];
    let preorder = [];
    preorder.push(root.mark);
    stack.push(root);
    while (stack.length > 0) {
        // 'flag' checks whether all the child
        // nodes have been visited.
        let flag = 0;
        // CASE 1- If Top of the stack is a leaf
        // node then remove it from the stack:
        if (stack[stack.length - 1].children.length === 0) {
            let x = stack.pop();
            // CASE 2- If Top of the stack is
            // Parent with children:
        } else {
            let par = stack[stack.length - 1];
            // a)As soon as an unvisited child is
            // found(left to right sequence),
            // Push it to Stack and Store it in
            // Auxiliary List(Marked Visited)
            // Start Again from Case-1, to explore
            // this newly visited child
            for (let i = 0; i < par.children.length; i++) {
                if (!preorder.includes(par.children[i].mark)) {
                    flag = 1;
                    stack.push(par.children[i]);
                    preorder.push(par.children[i].mark);

                    let node = par.children[i];
                    if (node.type == 'if_statement') {
                        if_list.push({
                            node,
                            // par_mark: par.mark,
                            mark: node.mark
                        })
                    }
                    break;
                }
                // b)If all Child nodes from left to right
                // of a Parent have been visited
                // then remove the parent from the stack.
            }
            if (flag === 0) {
                stack.pop();
            }
        }
    }
    console.log(preorder);
    // console.log('if_list')
    // console.log(if_list);
    return if_list;
}

export function getIfInfo(node) {
    if (node.type !== "if_statement") {
        console.log('This node have no if_statement type')
    }
    else {
        if (node.children.length) {
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].type === 'parenthesized_expression') {
                    return {
                        condition: node.children[i].text,
                        line: node.children[i].startPosition.row
                    }
                }
            }
        }
        return {}
    }
}


export function findBinaryExpression(root) {
    console.log("findBinaryExpression");
    console.log("root.children.length: ", root.children.length)
    let stack = [];
    // 'Preorder'-> contains all the
    // visited nodes.
    let binary_expression_list = [];
    let preorder = [];
    preorder.push(root.mark);
    stack.push(root);


    while (stack.length > 0) {
        // 'flag' checks whether all the child
        // nodes have been visited.
        let flag = 0;
        // CASE 1- If Top of the stack is a leaf
        // node then remove it from the stack:
        if (stack[stack.length - 1].children.length === 0) {
            let x = stack.pop();
            // CASE 2- If Top of the stack is
            // Parent with children:
        } else {
            let par = stack[stack.length - 1];
            // a)As soon as an unvisited child is
            // found(left to right sequence),
            // Push it to Stack and Store it in
            // Auxiliary List(Marked Visited)
            // Start Again from Case-1, to explore
            // this newly visited child
            for (let i = 0; i < par.children.length; i++) {
                if (!preorder.includes(par.children[i].mark)) {
                    flag = 1;
                    stack.push(par.children[i]);
                    preorder.push(par.children[i].mark);

                    let node = par.children[i];
                    if (node.type == 'binary_expression') {
                        // binary_expression_list.push({
                        //     node,
                        //     mark: node.mark
                        // })
                        binary_expression_list.push({
                            // node,
                            // par_mark: par.mark,
                            mark: node.mark,
                            binary_expression: node.text
                        })
                    }
                    break;
                }
                // b)If all Child nodes from left to right
                // of a Parent have been visited
                // then remove the parent from the stack.
            }
            if (flag === 0) {
                stack.pop();
            }
        }
    }
    console.log(preorder);
    // console.log('binary_expression_list')
    // console.log(binary_expression_list);
    return binary_expression_list;
}