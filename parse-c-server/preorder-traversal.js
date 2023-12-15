
import { json } from 'express';
import lodash from 'lodash';
/**
 * https://www.geeksforgeeks.org/preorder-traversal-of-a-n-ary-tree/?ref=lbp
 */
// export function preorderTraversal(root) {
//     let stack = [];
//     // 'Preorder'-> contains all the
//     // visited nodes.

//     let preorder = [];
//     console.log("==== begin preorder")
//     console.log(preorder)
//     preorder.push(root.mark);
//     stack.push(root);

//     while (stack.length > 0) {
//         // 'flag' checks whether all the child
//         // nodes have been visited.
//         let flag = 0;
//         // CASE 1- If Top of the stack is a leaf
//         // node then remove it from the stack:
//         if (stack[stack.length - 1].children.length === 0) {
//             let x = stack.pop();
//             // CASE 2- If Top of the stack is
//             // Parent with children:
//         } else {
//             let par = stack[stack.length - 1];
//             // a)As soon as an unvisited child is
//             // found(left to right sequence),
//             // Push it to Stack and Store it in
//             // Auxiliary List(Marked Visited)
//             // Start Again from Case-1, to explore
//             // this newly visited child
//             for (let i = 0; i < par.children.length; i++) {
//                 if (!preorder.includes(par.children[i].mark)) {
//                     flag = 1;
//                     stack.push(par.children[i]);
//                     preorder.push(par.children[i].mark);
//                     break;
//                 }
//                 // b)If all Child nodes from left to right
//                 // of a Parent have been visited
//                 // then remove the parent from the stack.
//             }
//             if (flag === 0) {
//                 stack.pop();
//             }
//         }
//     }
//     console.log("==== end preorder")
//     console.log("==== start print preorder")
//     console.log(preorder);
//     console.log("==== end print preorder")
//     return preorder
// }


//====================== ASYNC FUNC ======================
export async function preorderTraversal(root) {
    let stack = [];
    // 'Preorder'-> contains all the
    // visited nodes.
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
    // console.log("preorder");
    // console.log(preorder);
    return preorder
}


// export function findIfCondition(root) {
//     let stack = [];
//     // 'Preorder'-> contains all the
//     // visited nodes.
//     let if_list = [];
//     let preorder = [];
//     preorder.push(root.mark);
//     stack.push(root);
//     while (stack.length > 0) {
//         // 'flag' checks whether all the child
//         // nodes have been visited.
//         let flag = 0;
//         // CASE 1- If Top of the stack is a leaf
//         // node then remove it from the stack:
//         if (stack[stack.length - 1].children.length === 0) {
//             let x = stack.pop();
//             // CASE 2- If Top of the stack is
//             // Parent with children:
//         } else {
//             let par = stack[stack.length - 1];
//             // a)As soon as an unvisited child is
//             // found(left to right sequence),
//             // Push it to Stack and Store it in
//             // Auxiliary List(Marked Visited)
//             // Start Again from Case-1, to explore
//             // this newly visited child
//             for (let i = 0; i < par.children.length; i++) {
//                 if (!preorder.includes(par.children[i].mark)) {
//                     flag = 1;
//                     stack.push(par.children[i]);
//                     preorder.push(par.children[i].mark);

//                     let node = par.children[i];
//                     if (node.type == 'if_statement') {
//                         if_list.push({
//                             node,
//                             // par_mark: par.mark,
//                             mark: node.mark
//                         })
//                     }
//                     break;
//                 }
//                 // b)If all Child nodes from left to right
//                 // of a Parent have been visited
//                 // then remove the parent from the stack.
//             }
//             if (flag === 0) {
//                 stack.pop();
//             }
//         }
//     }
//     console.log("findIfCondition -- preorder")
//     console.log(preorder);
//     // console.log('if_list')
//     // console.log(if_list);
//     return if_list;
// }

// export function getIfInfo(node) {
//     if (node.type !== "if_statement") {
//         console.log('This node have no if_statement type')
//     }
//     else {
//         if (node.children.length) {
//             for (let i = 0; i < node.children.length; i++) {
//                 if (node.children[i].type === 'parenthesized_expression') {
//                     return {
//                         condition: node.children[i].text,
//                         startPosition: node.children[i].startPosition,
//                         endPosition: node.children[i].endPosition,
//                         node: node.children[i]
//                     }
//                 }
//             }
//         }
//         return {}
//     }
// }


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
                        /** only push the lowest level binary_expression to array */
                        let isLowestLevel = true;
                        for (let iCheckLowestLevel = 0; iCheckLowestLevel < node.children.length; iCheckLowestLevel++) {
                            if (node.children[iCheckLowestLevel].children.length) {
                                console.log('this binary_expression is not lowest level')
                                console.log(node.text);
                                isLowestLevel = false;
                            }

                        }
                        if (isLowestLevel) {
                            binary_expression_list.push({
                                // node,
                                // par_mark: par.mark,
                                mark: node.mark,
                                startPosition: node.startPosition,
                                endPosition: node.endPosition,
                                binary_expression: node.text,
                                node
                            })
                        }

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

export function findIdentifier(root) {
    console.log("findIdentifier");
    console.log("root.children.length: ", root.children.length)
    let stack = [];
    // 'Preorder'-> contains all the
    // visited nodes.
    let identifier_list = [];
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
                    if (node.type == 'identifier') {
                        // identifier_list.push({
                        //     node,
                        //     mark: node.mark
                        // })
                        identifier_list.push({
                            // node,
                            // par_mark: par.mark,
                            mark: node.mark,
                            startPosition: node.startPosition,
                            endPosition: node.endPosition,
                            identifier: node.text,
                            node
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
    // console.log('identifier_list')
    // console.log(identifier_list);
    return identifier_list;
}

export async function checkPreorder(root_node) {
    try {
        // Variable contains the result
        let check_preorder = [];
        let res_ok = true;
        // Declare recursive function
        async function checkPreorderRecursive(node) {
            check_preorder.push({
                mark: node.mark ? node.mark : null,
                text: node.text ? node.text : null
            });
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    await checkPreorderRecursive(node.children[i]);
                }
            }
        }
        // Call the recursive function
        await checkPreorderRecursive(root_node);
        /** if there is any node has mark = null --> wrong */
        check_preorder.forEach(node => {
            if (node.mark == null) {
                res_ok = false;
            }
        })
        return res_ok;
    } catch (error) {
        throw (error);
    }
}
// ***************** TEST
export async function markNumPreorderTree(root_node, start_num) {
    try {
        console.log("run markNumPreorderTree")
        console.log("start_num", start_num)
        /** Start mark num of tree */
        let num_mark = start_num;
        /** Declare mark num of tree with preorder */
        async function markNumPreorderRecursive(node) {
            node.mark = num_mark;
            if (node.childCount) {
                for (let i = 0; i < node.childCount; i++) {
                    num_mark++
                    node.children[i].mark = num_mark;
                    await markNumPreorderRecursive(node.children[i]);
                }
            }
        }

        /** Declare temp_root with init value is a clone of root_node */
        let temp_root = lodash.clone(root_node);
        /** Traversal until it works */
        let mark_ok = true;
        for (let i = 0; i < 10; i++) {
            /** Reset temp_root */
            temp_root = lodash.clone(root_node);
            /** Reset num_mark */
            num_mark = start_num;
            await markNumPreorderRecursive(temp_root);
            mark_ok = await checkPreorder(temp_root);
            if (mark_ok) {
                console.log(`check preorder OK with try times: ${i + 1}`)
                break;
            }
        }
        if (!mark_ok) {
            console.log("run markNumPreorderTree FAILED")
            temp_root = []
        }
        return temp_root
    }
    catch (error) {
        throw (error)
    }

}




/** ===================== Using this code to test preorder work fine ===================== */
// let dbg_arr = []
// for (let i = 0; i < 100; i++) {
//     await markNumPreorderTree(root_node);
//     let preorder = await checkPreorder(root_node);
//     let res_ok = true
//     preorder.forEach(node => {
//         if (node.mark == null) {
//             res_ok = false;
//         }
//     })
//     if (res_ok) {
//         dbg_arr.push(preorder)
//         console.log(`check preorder OK with try times: ${i + 1}`)
//     }
// }

// // /** Check same mark has same text */
// let org_data = dbg_arr[0];
// let check_expected = true;
// org_data.forEach((node, index_node) => {
//     const { mark, text } = node
//     dbg_arr.forEach((dbg, index_dbg) => {
//         if ((mark != dbg[index_node].mark) || (text != dbg[index_node].text)) {
//             console.log(`Check expected fail mark index_node: ${index_node} - index_dbg: ${index_dbg}`)
//             check_expected = false;
//         }
//     })
// })
/** ===================== END TEST CODE ===================== */