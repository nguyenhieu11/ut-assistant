import lodash from 'lodash';

export function getFuncReturnType(func_node) {
    const func_def = func_node.children[0];
    let func_return_type = "";
    for (let i = 0; i < func_def.children.length; i++) {
        if (func_def.children[i].type == "primitive_type") {
            // console.log("found func_return_type");
            func_return_type = func_def.children[i].text;
            return func_return_type;
        }
    }
    // console.log("NOT found func_return_type");
    return "";
}

export function getFuncIdentifier(func_node) {
    const func_def = func_node.children[0];
    let func_decl = {};
    for (let i = 0; i < func_def.children.length; i++) {
        if (func_def.children[i].type == "function_declarator") {
            // console.log("found func_decl");
            func_decl = func_def.children[i];
            break;
        }
    }
    if (!func_decl.children?.length) {
        // console.log("func_decl is empty");
        return func_decl;
    }

    let func_id = "";
    for (let i = 0; i < func_decl.children.length; i++) {
        if (func_decl.children[i].type == "identifier") {
            // console.log("found func_id");
            func_id = func_decl.children[i].text;
            return func_id;
        }
    }
    // console.log("NOT found func_id");
    return "";
}

export function getFuncParamList(func_node) {
    const func_def = func_node.children[0];
    let func_decl = {};
    for (let i = 0; i < func_def.children.length; i++) {
        if (func_def.children[i].type == "function_declarator") {
            // console.log("found func_decl");
            func_decl = func_def.children[i];
            break;
        }
    }

    if (!func_decl.children?.length) {
        // console.log("func_decl is empty");
        return [];
    }
    let func_param_list = {};
    for (let i = 0; i < func_decl.children.length; i++) {
        if (func_decl.children[i].type == "parameter_list") {
            // console.log("found func_param_list");
            func_param_list = func_decl.children[i];
        }
    }

    if (!func_param_list.namedChildren?.length) {
        // console.log("func_param_list is empty");
        return [];
    }
    let return_param_list = [];
    // console.log("func_param_list.namedChildren.length: ")
    // console.log(func_param_list.namedChildren.length)
    for (let i = 0; i < func_param_list.namedChildren.length; i++) {
        const param = func_param_list.namedChildren[i];
        if (!param?.children.length) {
            // console.log("param is empty");
        }
        else {
            let param_prop = {};
            for (let j = 0; j < param.children.length; j++) {
                if (param.children[j].type == "primitive_type") {
                    param_prop.type = param.children[j].text;
                } else if (param.children[j].type == "identifier") {
                    param_prop.identifier = param.children[j].text;
                }
            }
            return_param_list.push(lodash.clone(param_prop))
        }
    }

    return return_param_list;
}

export function getFuncLocalVarList(func_node) {
    const func_def = func_node.children[0];
    let func_compound_statement = {};
    for (let i = 0; i < func_def.children.length; i++) {
        if (func_def.children[i].type == "compound_statement") {
            console.log("found func_compound_statement");
            func_compound_statement = func_def.children[i];
            break;
        }
    }

    if (!func_compound_statement.children?.length) {
        console.log("func_compound_statement is empty");
        return [];
    }
    let declaration_list = [];
    for (let i = 0; i < func_compound_statement.children.length; i++) {
        if (func_compound_statement.children[i].type == "declaration") {
            declaration_list.push(lodash.clone(func_compound_statement.children[i]));
        }
    }
    if (!declaration_list.length) {
        console.log("declaration_list is empty")
    }
    let func_local_var_list = []
    console.log(declaration_list)

    declaration_list.forEach(decl => {
        let var_prop = {}
        for (let i = 0; i < decl.children.length; i++) {
            if (decl.children[i].type == "primitive_type") {
                var_prop.type = decl.children[i].text;
            }
            else if (decl.children[i].type == "identifier") {
                var_prop.identifier = decl.children[i].text;
            }
            else if (decl.children[i].type == "init_declarator") {
                const var_init_node = decl.children[i];
                for (let j = 0; j < var_init_node.children.length; j++) {
                    if (var_init_node.children[j].type == "identifier") {
                        console.log("here: ");
                        console.log(var_init_node.children[j].text);
                        var_prop.identifier = var_init_node.children[j].text;
                    }
                    else if (var_init_node.children[j].type == "number_literal") {
                        var_prop.init_value = {};
                        var_prop.init_value.type = "number";
                        var_prop.init_value.value = var_init_node.children[j].text;
                    }
                }
            }
        }
        func_local_var_list.push(lodash.clone(var_prop));
    })

    return func_local_var_list;
}


export function getIfStatement(node, path = '') {
    if (node.children.length) {
        // console.log(node.children.length);
        for (let i = 0; i < node.children.length; i++) {
            console.log('........ i: ', i);
            path = path + i;
            if (node.children[i].type == "if_statement") {
                console.log("if...")
                // console.log(node.children[i].text);
                // console.log('\n')

                console.log(path);
            }
            getIfStatement(node.children[i], path);
        }
    }
}
export function getFuncIfStatement(func_node) {
    // Get all path to if statement

}


