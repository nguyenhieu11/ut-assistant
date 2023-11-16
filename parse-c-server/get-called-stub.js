import { isInsideNode, getNodeType } from "./tree-algorithms/tree-helper.js";

export function getCalledStubFunc(root_node, if_list, test_case_list) {

    let all_call_expression = getNodeType(root_node, 'call_expression');

    // let debug = {}
    test_case_list.forEach(tc => {
        if_list.forEach(ie => {
            if (isInsideNode(ie.node, tc.assign_list[0].mark)) {
                // get node of if condition corresponding with condition of assign_list
                let if_of_tc = ie.node
                let compound_statement_list = getNodeType(if_of_tc, 'compound_statement');
                let call_expression_list = getNodeType(if_of_tc, 'call_expression');
                // debug.call_expression_list = call_expression_list;
                // debug.compound_statement_list = compound_statement_list
                console.log("compound_statement_list.length: ", compound_statement_list.length);

                let compound = {}
                /** Now only support if and 1 else */
                if (tc.condition_result == 1) {
                    compound = compound_statement_list[0]
                }
                else if (tc.condition_result == 0) {
                    if (compound_statement_list.length == 2) {
                        compound = compound_statement_list[1]
                    }
                }

                let inside_func_call_list = []
                call_expression_list.forEach(ce => {
                    if (isInsideNode(compound.node, ce.mark)) {
                        let func_info = {}
                        ce.node.children.forEach(cec => {
                            if (cec.type == 'identifier') {
                                func_info.func_name = cec.text;
                                func_info.mark = ce.mark
                            }
                        })
                        inside_func_call_list.push(func_info);
                    }
                })
                tc.compound = compound
                tc.inside_func_call_list = inside_func_call_list
            }
        })
    });
    /** Get called function outside condition */
    test_case_list.forEach(tc => {
        let outside_func_call_list = []
        all_call_expression.forEach(ce => {
            let func_name = ''
            ce.node.children.forEach(cec => {
                if (cec.type == 'identifier') {
                    func_name = cec.text
                }
            })

            let is_called = false;
            tc.inside_func_call_list.forEach(ifc => {
                if (ifc.func_name == func_name) {
                    is_called = true;
                }
            })
            if (!is_called) {
                /** Check this function is existed inside the corresponding compound */
                if (isInsideNode(tc.compound.node, ce.node.mark)) {
                    let func_info = {
                        func_name: func_name,
                        mark: ce.mark
                    }
                    outside_func_call_list.push(func_info);
                }


            }
        })
        tc.outside_func_call_list = outside_func_call_list
    })

    /** Remove compound field in return data */
    test_case_list.forEach(tc => {
        if (tc.compound) {
            delete tc.compound
        }
    })

    return test_case_list
}