const code = `
uint32_t getThreadId() {
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

    #ifdef AAAA
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

    directives.forEach((directive, i) => {
        if (directive.type === '#if' || directive.type === '#ifdef') {
            stack.push({ directive, startLine: directive.line + 1 });
        } else if (directive.type === '#elif' || directive.type === '#else') {
            const lastDirective = stack.pop();

            if (lastDirective) {
                const endLine = directive.line - 1;

                map.push({
                    directive: lastDirective.directive.content,
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
        console.log(line)

        let preproc = {}
        let is_preproc = true;
        if (line.startsWith('#if 0')) {
            preproc.type = "#if"
            preproc.line = i + 1
            preproc.content = line
            preproc.condition = "0"
        }
        else if (line.startsWith('#if 1')) {
            preproc.type = "#if"
            preproc.line = i + 1
            preproc.content = line
            preproc.condition = "1"
        }
        else if (line.startsWith('#if(')) {
            preproc.type = "#if"
            preproc.line = i + 1
            preproc.content = line
            preproc.condition = line.substring(("#if(").length - 1)
        }
        else if (line.startsWith('#ifdef ') || line.startsWith('#elif ')
            || line.startsWith('#endif')
            || line.startsWith('#else')) {
            const parts = line.split(' ');
            preproc.type = parts[0]
            preproc.line = i + 1
            preproc.content = line
            preproc.condition = parts[1] || null
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

