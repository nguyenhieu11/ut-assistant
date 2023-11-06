

export function parseDecision(if_list_info) {
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

function getMcdcTable(condition) {
    let { info, number_var, replace_list } = condition;
    let condition_text = info.condition

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
        condition_text = condition_text.replace(rp_from, rp_to)
    }
    condition_text = condition_text.replaceAll(' ', '');

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
            truth_table[i_row][`var_${i_var + 1}`] = (i_row & (1 << (number_var - 1 - i_var))) ? 1 : 0;
        }
    }

    truth_table.forEach(t => {
        let test_str = ''
        for (let i_rp = 0; i_rp < replace_list.length; i_rp++) {
            test_str += `let ${replace_list[i_rp].character} = ` + t[`var_${i_rp + 1}`] + '; '
        }
        test_str += condition_text;
        console.log(test_str);
        console.log(eval(test_str))
        t.result = eval(test_str);

        // let result = test_str
    })

    // let result = 1
    return { condition_text, info, number_var, replace_list, truth_table }
    return condition_text;
}

