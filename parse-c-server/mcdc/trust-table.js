import lodash from 'lodash';

function calc(a1, a2, a3, a4, a5, a6) {
    return (a1 || (a2 && a3) || (a2 && a4) || a5 || a6);
}

export function getTrustTable() {
    let trust_table = [];
    for (let i = 0; i < Math.pow(2, 6); i++) {
        let element = {}
        let a1 = (i & 0B100000) ? 1 : 0;
        let a2 = (i & 0B010000) ? 1 : 0;
        let a3 = (i & 0B001000) ? 1 : 0;
        let a4 = (i & 0B000100) ? 1 : 0;
        let a5 = (i & 0B000010) ? 1 : 0;
        let a6 = (i & 0B000001) ? 1 : 0;
        let result = calc(a1, a2, a3, a4, a5, a6);
        element = {
            row: i + 1,
            a1, a2, a3, a4, a5, a6,
            result
        }
        trust_table.push(lodash.clone(element));
    }
    return trust_table;
}