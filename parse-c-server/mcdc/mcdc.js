export function getMcdc(trust_table) {

    /** For a1 */
    let a1_decide_list = [];
    trust_table.forEach(e => {
        if (e.a1 == e.result) {
            a1_decide_list.push(e);
        }
    });

    let a1_pair_list = [];
    for (let i = 0; i < a1_decide_list.length; i++) {
        for (let j = 0; j < a1_decide_list.length; j++) {
            if (i != j) {

                if ((a1_decide_list[i].a2 == a1_decide_list[j].a2)
                    && (a1_decide_list[i].a3 == a1_decide_list[j].a3)
                    && (a1_decide_list[i].a4 == a1_decide_list[j].a4)
                    && (a1_decide_list[i].a5 == a1_decide_list[j].a5)
                    && (a1_decide_list[i].a6 == a1_decide_list[j].a6)) {
                    let need_insert = true;
                    if (!a1_pair_list.length) {
                        need_insert = true;
                    }
                    else {
                        a1_pair_list.forEach(p => {
                            if ((p[0].row == a1_decide_list[i].row)
                                || (p[0].row == a1_decide_list[j].row)
                                || (p[1].row == a1_decide_list[i].row)
                                || (p[1].row == a1_decide_list[j].row)) {
                                need_insert = false;
                            }
                        })
                    }
                    if (need_insert) {
                        let element = [];
                        element.push({ row: a1_decide_list[i].row })
                        element.push({ row: a1_decide_list[j].row });
                        a1_pair_list.push(element);
                    }
                }
            }
        }
    }

    /** For a2 */
    let a2_decide_list = [];
    trust_table.forEach(e => {
        if (e.a2 == e.result) {
            a2_decide_list.push(e);
        }
    });

    let a2_pair_list = [];
    for (let i = 0; i < a2_decide_list.length; i++) {
        for (let j = 0; j < a2_decide_list.length; j++) {
            if (i != j) {

                if ((a2_decide_list[i].a1 == a2_decide_list[j].a1)
                    && (a2_decide_list[i].a3 == a2_decide_list[j].a3)
                    && (a2_decide_list[i].a4 == a2_decide_list[j].a4)
                    && (a2_decide_list[i].a5 == a2_decide_list[j].a5)
                    && (a2_decide_list[i].a6 == a2_decide_list[j].a6)) {
                    let need_insert = true;
                    if (!a2_pair_list.length) {
                        need_insert = true;
                    }
                    else {
                        a2_pair_list.forEach(p => {
                            if ((p[0].row == a2_decide_list[i].row)
                                || (p[0].row == a2_decide_list[j].row)
                                || (p[1].row == a2_decide_list[i].row)
                                || (p[1].row == a2_decide_list[j].row)) {
                                need_insert = false;
                            }
                        })
                    }
                    if (need_insert) {
                        let element = [];
                        element.push({ row: a2_decide_list[i].row })
                        element.push({ row: a2_decide_list[j].row });
                        a2_pair_list.push(element);
                    }
                }
            }
        }
    }
    /** For a3 */
    let a3_decide_list = [];
    trust_table.forEach(e => {
        if (e.a3 == e.result) {
            a3_decide_list.push(e);
        }
    });

    let a3_pair_list = [];
    for (let i = 0; i < a3_decide_list.length; i++) {
        for (let j = 0; j < a3_decide_list.length; j++) {
            if (i != j) {

                if ((a3_decide_list[i].a1 == a3_decide_list[j].a1)
                    && (a3_decide_list[i].a2 == a3_decide_list[j].a2)
                    && (a3_decide_list[i].a4 == a3_decide_list[j].a4)
                    && (a3_decide_list[i].a5 == a3_decide_list[j].a5)
                    && (a3_decide_list[i].a6 == a3_decide_list[j].a6)) {
                    let need_insert = true;
                    if (!a3_pair_list.length) {
                        need_insert = true;
                    }
                    else {
                        a3_pair_list.forEach(p => {
                            if ((p[0].row == a3_decide_list[i].row)
                                || (p[0].row == a3_decide_list[j].row)
                                || (p[1].row == a3_decide_list[i].row)
                                || (p[1].row == a3_decide_list[j].row)) {
                                need_insert = false;
                            }
                        })
                    }
                    if (need_insert) {
                        let element = [];
                        element.push({ row: a3_decide_list[i].row })
                        element.push({ row: a3_decide_list[j].row });
                        a3_pair_list.push(element);
                    }
                }
            }
        }
    }
    /** For a4 */
    let a4_decide_list = [];
    trust_table.forEach(e => {
        if (e.a4 == e.result) {
            a4_decide_list.push(e);
        }
    });

    let a4_pair_list = [];
    for (let i = 0; i < a4_decide_list.length; i++) {
        for (let j = 0; j < a4_decide_list.length; j++) {
            if (i != j) {

                if ((a4_decide_list[i].a1 == a4_decide_list[j].a1)
                    && (a4_decide_list[i].a2 == a4_decide_list[j].a2)
                    && (a4_decide_list[i].a3 == a4_decide_list[j].a3)
                    && (a4_decide_list[i].a5 == a4_decide_list[j].a5)
                    && (a4_decide_list[i].a6 == a4_decide_list[j].a6)) {
                    let need_insert = true;
                    if (!a4_pair_list.length) {
                        need_insert = true;
                    }
                    else {
                        a4_pair_list.forEach(p => {
                            if ((p[0].row == a4_decide_list[i].row)
                                || (p[0].row == a4_decide_list[j].row)
                                || (p[1].row == a4_decide_list[i].row)
                                || (p[1].row == a4_decide_list[j].row)) {
                                need_insert = false;
                            }
                        })
                    }
                    if (need_insert) {
                        let element = [];
                        element.push({ row: a4_decide_list[i].row })
                        element.push({ row: a4_decide_list[j].row });
                        a4_pair_list.push(element);
                    }
                }
            }
        }
    }
    /** For a5 */
    let a5_decide_list = [];
    trust_table.forEach(e => {
        if (e.a5 == e.result) {
            a5_decide_list.push(e);
        }
    });

    let a5_pair_list = [];
    for (let i = 0; i < a5_decide_list.length; i++) {
        for (let j = 0; j < a5_decide_list.length; j++) {
            if (i != j) {

                if ((a5_decide_list[i].a1 == a5_decide_list[j].a1)
                    && (a5_decide_list[i].a2 == a5_decide_list[j].a2)
                    && (a5_decide_list[i].a3 == a5_decide_list[j].a3)
                    && (a5_decide_list[i].a4 == a5_decide_list[j].a4)
                    && (a5_decide_list[i].a6 == a5_decide_list[j].a6)) {
                    let need_insert = true;
                    if (!a5_pair_list.length) {
                        need_insert = true;
                    }
                    else {
                        a5_pair_list.forEach(p => {
                            if ((p[0].row == a5_decide_list[i].row)
                                || (p[0].row == a5_decide_list[j].row)
                                || (p[1].row == a5_decide_list[i].row)
                                || (p[1].row == a5_decide_list[j].row)) {
                                need_insert = false;
                            }
                        })
                    }
                    if (need_insert) {
                        let element = [];
                        element.push({ row: a5_decide_list[i].row })
                        element.push({ row: a5_decide_list[j].row });
                        a5_pair_list.push(element);
                    }
                }
            }
        }
    }
    /** For a6 */
    let a6_decide_list = [];
    trust_table.forEach(e => {
        if (e.a6 == e.result) {
            a6_decide_list.push(e);
        }
    });

    let a6_pair_list = [];
    for (let i = 0; i < a6_decide_list.length; i++) {
        for (let j = 0; j < a6_decide_list.length; j++) {
            if (i != j) {

                if ((a6_decide_list[i].a1 == a6_decide_list[j].a1)
                    && (a6_decide_list[i].a2 == a6_decide_list[j].a2)
                    && (a6_decide_list[i].a3 == a6_decide_list[j].a3)
                    && (a6_decide_list[i].a4 == a6_decide_list[j].a4)
                    && (a6_decide_list[i].a5 == a6_decide_list[j].a5)) {
                    let need_insert = true;
                    if (!a6_pair_list.length) {
                        need_insert = true;
                    }
                    else {
                        a6_pair_list.forEach(p => {
                            if ((p[0].row == a6_decide_list[i].row)
                                || (p[0].row == a6_decide_list[j].row)
                                || (p[1].row == a6_decide_list[i].row)
                                || (p[1].row == a6_decide_list[j].row)) {
                                need_insert = false;
                            }
                        })
                    }
                    if (need_insert) {
                        let element = [];
                        element.push({ row: a6_decide_list[i].row })
                        element.push({ row: a6_decide_list[j].row });
                        a6_pair_list.push(element);
                    }
                }
            }
        }
    }

    return {
        a1_pair_list,
        a2_pair_list,
        a3_pair_list,
        a4_pair_list,
        a5_pair_list,
        a6_pair_list
    };
}