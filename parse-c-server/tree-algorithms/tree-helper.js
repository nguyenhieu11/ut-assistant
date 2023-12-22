import lodash from 'lodash';

export function isInsideNode(node, target_mark) {

    // console.log(`check node.mark: ${node.mark} and target_mark: ${target_mark}`)
    // Check if the current node's value is equal to the target mark
    if (node.mark === target_mark) {
        return true;
    }

    // Recursively check each child node

    // console.log('node.children')
    // console.log(node.children)
    // return true;
    for (const child of node.children) {
        if (isInsideNode(child, target_mark)) {
            return true;
        }
    }

    // If none of the children contain the mark, return false
    return false;
}

export function getNodeType(root, target_type) {

    let target_list = [];

    let stack = [];
    let preorder = [];
    preorder.push(lodash.clone(root.mark));
    stack.push(lodash.clone(root));

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
                    stack.push(lodash.clone(par.children[i]));
                    preorder.push(lodash.clone(par.children[i].mark));

                    let node = par.children[i];
                    if (node.type == target_type) {
                        target_list.push(lodash.clone({
                            node,
                            // par_mark: par.mark,
                            mark: node.mark
                        }))
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
    // console.log(preorder);
    return target_list

}