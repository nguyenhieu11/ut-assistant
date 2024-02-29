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

    #if (AAAA == CCC)
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


function mapDirectivesToLines(directives) {
    const stack = [];
    const map = [];
    console.log(directives);
    console.log("=====================================");
    directives.forEach((directive, i) => {
        if (directive.type === '#if' || directive.type === '#ifdef') {
            stack.push({ directive, startLine: directive.line + 1 });
        } else if (directive.type === '#elif' || directive.type === '#else') {
            const lastDirective = stack.pop();

            if (lastDirective) {
                const endLine = directive.line - 1;

                map.push({
                    directive: lastDirective.directive.content,
                    condition: lastDirective.directive.condition,
                    controlledLines: `${lastDirective.startLine} to ${endLine}`
                });
            }

            stack.push({ directive, startLine: directive.line + 1 });
        } else if (directive.type === '#endif') {
            const lastDirective = stack.pop();

            if (lastDirective) {
                const endLine = directive.line - 1;

                map.push({
                    directive: lastDirective.directive.content,
                    condition: lastDirective.directive.condition,
                    controlledLines: `${lastDirective.startLine} to ${endLine}`
                });
            }
        }
    });

    return map;
}

export function parsePreprocessorDirectives(code) {
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
}

const directives = parsePreprocessorDirectives(code);
console.log(directives);

