


export function getTestCaseList(if_list_info) {
    let all_test_case = []
    if_list_info.forEach(ili => {
        let ts_each_condition = parseTestCase(ili)
        all_test_case.push(ts_each_condition);
    });
    return all_test_case
}

function parseTestCase(condition_info) {
    /**===== Begin pre-process ===== */
    let condition = condition_info
    /** delete .node */
    if (condition.info.node) {
        delete condition.info.node
    }

    let i_replace = 0;
    let replace_list = []
    /** Check the binary_expression is contained inside condition */
    condition.valid_binary_expression_list.forEach(vbe => {
        if (vbe.startPosition.row == condition.info.startPosition.row
            && vbe.startPosition.column > condition.info.startPosition.column
            && vbe.endPosition.row == condition.info.endPosition.row
            && vbe.endPosition.column < condition.info.endPosition.column
        ) {
            i_replace++;
            vbe.i_replace = i_replace;
            replace_list.push(vbe);
        }
    })
    condition.identifier_list.forEach(iden => {
        if (iden.startPosition.row == condition.info.startPosition.row
            && iden.startPosition.column > condition.info.startPosition.column
            && iden.endPosition.row == condition.info.endPosition.row
            && iden.endPosition.column < condition.info.endPosition.column
        ) {
            let is_contained_in_condition = false;
            condition.valid_binary_expression_list.forEach(vbe => {
                if (iden.startPosition.row == vbe.startPosition.row
                    && iden.startPosition.column >= vbe.startPosition.column
                    && iden.endPosition.row == vbe.endPosition.row
                    && iden.endPosition.column <= vbe.endPosition.column
                ) {
                    is_contained_in_condition = true;
                }
            })

            if (!is_contained_in_condition) {
                i_replace++;
                iden.i_replace = i_replace;
                replace_list.push(iden);
            }
        }
    })

    condition.number_var = i_replace;
    condition.replace_list = replace_list
    /**===== End pre-process ===== */
    let mcdc_table = getMcdcTable(condition);
    return mcdc_table
}

function getAssignValue(identifier, operator, var_value, condition_value) {
    let assign = {}

    // console.log({ identifier, operator, var_value, condition_value })

    assign.identifier = identifier;
    switch (operator) {
        case '>':
            if (condition_value == 1) {
                assign.value = parseInt(var_value) + 1;
            }
            else {

                assign.value = parseInt(var_value);
            }
            break;
        case '>=':
            if (condition_value == 1) {
                assign.value = parseInt(var_value);
            }
            else {
                assign.value = parseInt(var_value) - 1;
            }
            break;
        case '<':
            if (condition_value == 1) {
                assign.value = parseInt(var_value) - 1;
            }
            else {

                assign.value = parseInt(var_value);
            }
            break;
        case '<=':
            if (condition_value == 1) {
                assign.value = parseInt(var_value);
            }
            else {
                assign.value = parseInt(var_value) + 1;
            }
            break;
        case '==':
            if (condition_value == 1) {
                assign.value = parseInt(var_value);
            }
            else {
                assign.value = parseInt(var_value) + 1;
            }
            break;

        default:
            break;
    }
    return assign;
}

function getAssignFromBinaryExpression(binary_expression_node, condition_value) {
    const node = binary_expression_node;
    if (node.children.length == 3) {
        const left = node.children[0];
        const operator = node.children[1];
        const right = node.children[2];
        let assign_value = {}
        if (left.type == 'identifier' && right.type == 'number_literal') {
            assign_value = getAssignValue(left.text, operator.text, right.text, condition_value);
        }
        else if (left.type == 'number_literal' && right.type == 'identifier') {
            assign_value = getAssignValue(right.text, operator.text, left.text, condition_value);
        }
        return assign_value
    }
    else {
        console.log(`binary_expression_node.childred.length: ${binary_expression_node.children.length}`)
    }

    return {}
}

function getMcdcTable(condition) {
    let { info, number_var, replace_list } = condition;
    const condition_text = info.condition

    let shorten_condition = condition_text;
    // let shorten_condition_text =
    for (let i_rp = 0; i_rp < replace_list.length; i_rp++) {
        /** start from 'A' (65) */
        let rp_to = String.fromCharCode(i_rp + 65);
        replace_list[i_rp].character = rp_to;
        let rp_from = ''
        if (replace_list[i_rp].binary_expression) {
            rp_from = replace_list[i_rp].binary_expression
        } else if (replace_list[i_rp].identifier) {
            rp_from = replace_list[i_rp].identifier
        }
        let length_of_rp = rp_from.length;
        for (let i_space = 0; i_space < (length_of_rp - 1); i_space++) {
            rp_to += ' '
        }
        /** text.replace only replace the first found text */
        shorten_condition = shorten_condition.replace(rp_from, rp_to)
    }
    shorten_condition = shorten_condition.replaceAll(' ', '');

    let truth_table = []
    /** [var_1, var_2, ...., var_n, result] */
    for (let i_row = 0; i_row < Math.pow(2, number_var); i_row++) {
        truth_table[i_row] = {};
        truth_table[i_row]['TC'] = i_row + 1;
        for (let i_var = 0; i_var < number_var; i_var++) {

            /**
             * ==== i_row = 0;
             * i_var = 0 --> var_1 = 0
             * i_var = 1 --> var_2 = 0
             * ==== i_row = 1
             * i_var = 0 --> var_1 = 0
             * i_var = 1 --> var_2 = 1
             * ==== i_row = 2
             * i_var = 0 --> var_1 = 1
             * i_var = 1 --> var_2 = 0
             */
            /** 65: character 'A' */
            truth_table[i_row][`var_${String.fromCharCode(65 + i_var)}`] = (i_row & (1 << (number_var - 1 - i_var))) ? 1 : 0;
        }
    }

    truth_table.forEach(tr => {
        let test_str = ''
        for (let i_rp = 0; i_rp < replace_list.length; i_rp++) {
            /** 65: character 'A' */
            test_str += `let ${replace_list[i_rp].character} = ` + tr[`var_${String.fromCharCode(65 + i_rp)}`] + '; '
        }
        test_str += shorten_condition;
        console.log(test_str);
        console.log(eval(test_str))
        tr.result = eval(test_str);

        // let result = test_str
    })

    /** Create test case form truth table */
    let test_case_list = []

    truth_table.forEach(tr => {
        let test_case = {}
        test_case.ts_number = tr['TC']
        test_case.condition_result = tr['result']

        /** Assign value for variables */
        /** 1. Get list of replace character */
        let obj_key = Object.keys(tr);
        // test_case.obj_key = obj_key
        let character_list = []
        obj_key.forEach(obk => {
            if (obk.includes('var_')) {
                let character = obk.replace('var_', '');
                character_list.push(character);
            }
        })
        // test_case.character_list = character_list

        let rp_condition_list = []
        character_list.forEach(chr => {
            let rp_condition = {}
            replace_list.forEach(rp => {
                if (rp.character == chr) {
                    rp_condition = rp
                }
            })
            rp_condition.value = tr[`var_${chr}`]
            rp_condition_list.push(rp_condition)
        })
        // test_case.rp_condition_list = rp_condition_list

        /** Get assign_list form rp_condition_list */
        let assign_list = []
        rp_condition_list.forEach(cond => {
            let assign = {}
            if (Object.keys(cond).includes('binary_expression')) {
                assign = getAssignFromBinaryExpression(cond.node, cond.value);
                assign.mark = cond.mark
            } else if (Object.keys(cond).includes('identifier')) {
                assign.identifier = cond.identifier
                assign.value = cond.value
                assign.mark = cond.mark

            }
            /** Get character and condition result for generate description step */
            assign.character = cond.character
            assign.conditon_value = cond.value
            assign_list.push(assign)
        })
        test_case.assign_list = assign_list
        /** Push test case to array */
        test_case_list.push(test_case)

        /** Generate test case description*/
        test_case_list.forEach(ts => {
            let case_in_text = shorten_condition
            ts.assign_list.forEach(as => {
                if (as.conditon_value == 1) {
                    case_in_text = case_in_text.replace(as.character, ' T ')
                } else {
                    case_in_text = case_in_text.replace(as.character, ' F ')
                }
            })
            ts.case_in_text = case_in_text
            ts.condition = condition_text
        })

    })

    return test_case_list
}
