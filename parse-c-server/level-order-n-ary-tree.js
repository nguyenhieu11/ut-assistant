import lodash from 'lodash';

export function levelOrder(root) {
    let ans = [];
    if (!root)
        console.log("N-Ary tree does not any nodes");

    // Create a queue namely main_queue
    let main_queue = [];

    // Push the root value in the main_queue
    main_queue.push(lodash.clone(root));

    // Create a temp vector to store the all the node values
    // present at a particular level
    let temp = [];

    // Run a while loop until the main_queue is empty
    while (main_queue.length) {

        // Get the front of the main_queue
        let n = main_queue.length;

        // Iterate through the current level
        for (let i = 0; i < n; i++) {
            let cur = main_queue.shift();
            temp.push(lodash.clone(cur.mark));
            for (let u of cur.children)
                main_queue.push(lodash.clone(u));
        }
        ans.push(lodash.clone(temp));
        temp = [];
    }
    console.log(ans)
    return ans;
}

// let num_mark = 1;
// export function markNumOfTree(node) {
//     num_mark = 1;
//     markNumRecursive(node)
// }

// function markNumRecursive(node) {
//     node.mark = num_mark;
//     if (node.children.length) {
//         for (let i = 0; i < node.children.length; i++) {
//             num_mark++
//             node.children[i].mark = num_mark;
//             markNumRecursive(node.children[i]);
//         }
//     }
// }

//============================ ASYNC functions ============================

export async function levelOrderAsync(root) {
    let ans = [];
    if (!root)
        console.log("N-Ary tree does not have any nodes");

    // Create a queue namely main_queue
    let main_queue = [];

    // Push the root value in the main_queue
    main_queue.push(lodash.clone(root));

    // Create a temp vector to store all the node values
    // present at a particular level
    let temp = [];

    // Run a while loop until the main_queue is empty
    while (main_queue.length) {

        // Get the front of the main_queue
        let n = main_queue.length;

        // Iterate through the current level
        for (let i = 0; i < n; i++) {
            let cur = main_queue.shift();
            temp.push(lodash.clone(cur.mark));
            for (let u of cur.children)
                main_queue.push(lodash.clone(u));
        }
        ans.push(lodash.clone(temp));
        temp = [];
    }
    console.log(ans)
    return ans;
}

