import Parser from 'tree-sitter';
import C from 'tree-sitter-c';

import { cloneArrayTreeWithMark, getParentNode } from '../tree-algorithms/treeHelper.js';

import {
    preorderTraversal,
    // findIfCondition,
    // getIfInfo,
    findBinaryExpression,
    findIdentifier,
    checkPreorder,
    markNumPreorderTree
} from '../preorder-traversal.js'
import { findAllIdentifier } from '../identifier-handle.js';

const code = `
uint32_t getThreadId() {
    #if  (FFFF) 
        ffffff;
    #endif
    #if(CCCCC)
        ccccc;
        func_line5();
        #ifdef EEEEE
            eeeee;
            func_line8();
        #endif
    #else
        dddd;
        func_line11();
    #endif

    func_line15();

    #if (AAAA == GGG)
        aaaa;
        return (uint32_t)id;
    #elif BBBBB
        #if 0
            test_line_22();
        #endif
        bbbbb;
        return pthread_self();
    #endif
}`;

const preprocDef = [
    // ...... NEED CHECK IF MISSING ANY PREPROC DEF......
    // { name: 'FFFF', value: '0' },
    // { name: 'CCCCC', value: '1' },
    { name: 'EEEEE', value: '10' },
    { name: 'AAAA', value: '1' },
    { name: 'BBBBB', value: '1' },
    { name: 'GGG', value: '0' }
];

function mapDirectivesToLines(directives) {
    const stack = [];
    const map = [];
    // console.log(directives);
    // console.log("=====================================");
    directives.forEach((directive, i) => {
        if (directive.type === '#if' || directive.type === '#ifdef') {
            stack.push({ directive, startLine: directive.line + 1 });
        } else if (directive.type === '#elif' || directive.type === '#else') {
            const lastDirective = stack.pop();

            if (lastDirective) {
                const endLine = directive.line - 1;

                map.push({
                    type: lastDirective.directive.type,
                    directive: lastDirective.directive.content,
                    condition: lastDirective.directive.condition,
                    startLine: lastDirective.startLine,
                    endLine: endLine,
                    controlledLines: `${lastDirective.startLine} to ${endLine}`
                });
            }

            stack.push({ directive, startLine: directive.line + 1 });
        } else if (directive.type === '#endif') {
            const lastDirective = stack.pop();

            if (lastDirective) {
                const endLine = directive.line - 1;

                map.push({
                    type: lastDirective.directive.type,
                    directive: lastDirective.directive.content,
                    condition: lastDirective.directive.condition,
                    startLine: lastDirective.startLine,
                    endLine: endLine,
                    controlledLines: `${lastDirective.startLine} to ${endLine}`
                });
            }
        }
    });

    return map;
}

export async function parsePreprocDirectives(code) {
    try {
        const preproc_list = [];
        const lines = code.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // console.log(line)

            let preproc = {}
            let is_preproc = true;
            // Need to replace by regex
            if ((/^\s*#ifdef/).test(line)) {
                preproc.type = "#ifdef"
                preproc.line = i + 1
                preproc.content = line
                preproc.condition = line.substring(line.match(/^\s*#ifdef\s*/)[0].length)
            }
            /** Note that check #ifdef before check #if */
            else if ((/^\s*#if/).test(line)) {
                preproc.type = "#if"
                preproc.line = i + 1
                preproc.content = line
                preproc.condition = line.substring(line.match(/^\s*#if\s*/)[0].length)
            }
            else if ((/^\s*#elif/).test(line)) {
                preproc.type = "#elif"
                preproc.line = i + 1
                preproc.content = line
                preproc.condition = line.substring(line.match(/^\s*#elif/)[0].length)
            }
            else if ((/^\s*#else/).test(line)) {
                preproc.type = "#else"
                preproc.line = i + 1
                preproc.content = line
                preproc.condition = line.substring(line.match(/^\s*#else/)[0].length)
            }
            else if ((/^\s*#endif/).test(line)) {
                preproc.type = "#endif"
                preproc.line = i + 1
                preproc.content = line
                preproc.condition = line.substring(line.match(/^\s*#endif/)[0].length)
            }
            else {
                is_preproc = false
            }

            if (is_preproc) {
                preproc_list.push(preproc)
            }
        }
        const directives = mapDirectivesToLines(preproc_list);
        return directives;
    } catch (error) { throw error }

}


export async function decideCondition(directMap, preprocDef) {
    try {
        /** replace preproc by value */
        directMap.forEach(dr => {
            let condition = dr.condition;
            preprocDef.forEach(def => {
                if (condition.includes(def.name)) {
                    condition = condition.replace(def.name, def.value);
                }
            });
            dr.replace_condition = condition;
        });
        /** Get remaining identifiers that have not been defined */
        /** Using tree-sitter */
        let temp_str = ""
        directMap.forEach(dr => {
            temp_str += dr.type + ' ' + dr.replace_condition
            temp_str += "\n"
            temp_str += "#endif\n"
        })

        const parser = new Parser();
        parser.setLanguage(C);

        const temp_tree = parser.parse(temp_str);
        const cloned_temp_tree = await cloneArrayTreeWithMark(temp_tree.rootNode);
        const temp_root = await markNumPreorderTree(cloned_temp_tree, 1);

        /** Find all identifiers in temp_root */
        const identifier_list = await findAllIdentifier(temp_root);

        /** Push the identifier_list to preprocDef */
        identifier_list.forEach(id => {
            let isDefined = false;
            preprocDef.forEach(def => {
                if (id === def.name) {
                    isDefined = true;
                }
            });
            if (!isDefined) {
                preprocDef.push({ name: id, value: '0' });
            }
        })
        /** Update replace_condition */
        directMap.forEach(dr => {
            let condition = dr.condition;
            preprocDef.forEach(def => {
                if (condition.includes(def.name)) {
                    condition = condition.replace(def.name, def.value);
                }
            });
            dr.replace_condition = condition;
        });
        /** using eval to decide  */
        directMap.forEach(dr => {
            if (dr.type == "ifdef") {
                let isDefined = false;
                preprocDef.forEach(def => {
                    if (dr.condition.includes(def.name)) {
                        isDefined = true;
                    }
                });
                dr.isOpen = isDefined ? true : false;
            }
            else {
                try {
                    dr.isOpen = !!eval(dr.replace_condition);
                } catch (error) {
                    dr.isOpen = false;
                }
            }
        });
        return directMap;
    } catch (error) {
        throw (error)
    }

}

export async function test_function() {
    const directives = await parsePreprocDirectives(code);
    const data = await decideCondition(directives, preprocDef);
    return data;
}


const replacePreproc = async (str, target, replace_with) => {
    const spaceSurrounded = new RegExp(`\\s+${target}\\s+`, 'g');
    const parenSurrounded = new RegExp(`\\(\\s*${target}\\s*\\)`, 'g');
    const specialCharSurrounded = new RegExp(`(?<=\\s|\\(|\\&|\\||\\!)${target}(?=\\s|\\)|\\&|\\||\\!|=)`, 'g');

    str = str.replace(spaceSurrounded, replace_with)
        .replace(parenSurrounded, replace_with)
        .replace(specialCharSurrounded, replace_with);
    console.log(str);
};

function removeUnusedBlocks(code, unusedArr) {
    let lines = code.split('\n');
    unusedArr.forEach(block => {
        for (let i = block.startLine; i <= block.endLine; i++) {
            if (lines[i - 1] !== undefined) {
                lines[i - 1] = '';
            }
        }
    });
    return lines.join('\n');
}

