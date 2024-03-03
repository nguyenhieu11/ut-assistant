
const code = `
/** 
 * Test structure
 *  #ifdef 0
 *      #if 1
 *      #elif 1 
 *      #elif 1
 *      #else
 *      #endif    
 * #else 
 *      #if 0
 *      #elif 0 
 *      #elif 1
 *      #else
 *      #endif 
 *  #endif
 */`;

function createPreprocArray(code) {
    const regex = /#(ifdef|if|elif|else|endif)\s*(\d)?/g;
    const preprocArr = [];
    let match;

    while ((match = regex.exec(code)) !== null) {
        preprocArr.push({
            type: '#' + match[1],
            value: match[2] || null
        });
    }

    return preprocArr;
}


const preproc_arr = createPreprocArray(code);
// console.log(preproc_arr);

function processPreprocArray(preprocArr) {
    let ifdefStack = [];
    let ifStack = [];

    preprocArr.forEach((dr, index) => {
        switch (dr.type) {
            case '#ifdef':
            case '#if':
                dr.is_open = dr.value === '1';
                if (dr.type === '#ifdef') {
                    ifdefStack.push({ is_open: dr.is_open, index });
                } else {
                    ifStack.push({ is_open: dr.is_open, index });
                }
                break;
            case '#else':
                if (ifdefStack.length > 0 && ifdefStack[ifdefStack.length - 1].index < index) {
                    dr.is_open = !ifdefStack[ifdefStack.length - 1].is_open;
                    ifdefStack[ifdefStack.length - 1].is_open = dr.is_open;
                } else if (ifStack.length > 0 && ifStack[ifStack.length - 1].index < index) {
                    dr.is_open = !ifStack[ifStack.length - 1].is_open;
                    ifStack[ifStack.length - 1].is_open = dr.is_open;
                }
                break;
            case '#elif':
                if (ifStack.length > 0) {
                    dr.is_open = !ifStack[ifStack.length - 1].is_open && dr.value === '1';
                    if (dr.is_open) {
                        ifStack[ifStack.length - 1].is_open = true;
                    }
                }
                break;
            case '#endif':
                if (ifdefStack.length > 0 && ifdefStack[ifdefStack.length - 1].index < index) {
                    ifdefStack.pop();
                } else if (ifStack.length > 0 && ifStack[ifStack.length - 1].index < index) {
                    ifStack.pop();
                }
                break;
        }
    });

    return preprocArr;
}

const processedPreprocArr = processPreprocArray(preproc_arr);
console.log(processedPreprocArr);
