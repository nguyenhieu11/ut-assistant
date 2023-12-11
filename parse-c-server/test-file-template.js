
import lodash from 'lodash';
import { markNumPreorderTree, checkPreorder } from './preorder-traversal.js';
import { findIdentifier } from './identifier-handle.js';

export async function generateTestCaseString(test_case_list, test_func_list, global_var_list) {
    try {
        let insert_str = ''
        for (const tc_group of test_case_list) {
            tc_group.forEach(tc => {
                let assing_str = ''
                tc.assign_list.forEach(as => {
                    if (as.value == 'NOT_NULL_PTR') {
                        let type_of_var = ''
                        /** Need check type of var to create map_data[1] */
                        let get_type_ok = false;
                        /** First: check with global variable */
                        for (const g_var of global_var_list) {
                            if (g_var.identifier && g_var.identifier == as.identifier) {
                                if (g_var.primitive_type) {
                                    type_of_var = g_var.primitive_type
                                    get_type_ok = true;
                                } else if (g_var.type_identifier) {
                                    type_of_var = g_var.type_identifier
                                    get_type_ok = true;
                                }


                            }
                        }
                        /** check with parameter_list */
                        if (!get_type_ok) {
                            test_func_list.forEach(func => {
                                if (tc.startPosition.row >= func.startPosition.row && tc.endPosition.row <= func.endPosition.row) {
                                    for (const decl of func.declarator_list) {
                                        if (decl.identifier && decl.identifier == as.identifier) {
                                            if (decl.primitive_type) {
                                                type_of_var = decl.primitive_type
                                                get_type_ok = true;
                                            } else if (decl.type_identifier) {
                                                type_of_var = decl.type_identifier
                                                get_type_ok = true;
                                            }
                                        } else if (decl.pointer_declarator.replace('*', '').replace(' ', '') == as.identifier) {
                                            if (decl.primitive_type) {
                                                type_of_var = decl.primitive_type
                                                get_type_ok = true;
                                            } else if (decl.type_identifier) {
                                                type_of_var = decl.type_identifier
                                                get_type_ok = true;
                                            }
                                        }
                                    }
                                }
                            })
                        }
                        if (!get_type_ok) {
                            console.log(`Cannot get type of ${as.identifier} with global_var and parameter_list`)
                        }
                        assing_str += `\n\t\t ${type_of_var} map_data[1]; \n\t\t${as.identifier} = map_data;`
                    }
                    else {
                        assing_str += `\n\t\t${as.identifier} = ${as.value};`
                    }
                })

                let expected_global_var_list = []
                tc.assign_list.forEach(as => {
                    for (const g_var of global_var_list) {
                        if (g_var.identifier && g_var.identifier == as.identifier) {
                            let expected_global_var = {}
                            expected_global_var.identifier = as.identifier;
                            expected_global_var.value = as.value
                            console.log('as');
                            console.log(as)
                            console.log('expected_global_var')
                            console.log(expected_global_var)
                            expected_global_var_list.push(expected_global_var);
                        }
                    }
                })
                let expected_global_var_str = ''
                expected_global_var_list.forEach(exp_g_var => {
                    console.log('exp_g_var')
                    console.log(exp_g_var)
                    expected_global_var_str += `EXPECTED_EQ(${exp_g_var.identifier}, ${exp_g_var.value});\n\t\t`
                })


                let func_call_str = ''
                // tc.inside_func_call_list.forEach(ifc => {
                //     func_call_str += `\n\t\tEXPECT_CALL(stubObj, ${ifc.func_name}())\n\t\t\t.willRepeatly(Return());`
                // })
                // tc.outside_func_call_list.forEach(ofc => {
                //     func_call_str += `\n\t\tEXPECT_CALL(stubObj, ${ofc.func_name}())\n\t\t\t.willRepeatly(Return());`
                // })

                let func_name_str = ''
                let declaration_of_func_str = ''
                let param_of_func_str = ''
                let expected_return_of_func = {}
                test_func_list.forEach(func => {
                    if (tc.startPosition.row >= func.startPosition.row && tc.endPosition.row <= func.endPosition.row) {
                        func_name_str = func.identifier;
                        /** Get expected info of function */
                        if (func.primitive_type && func.primitive_type !== 'void') {
                            expected_return_of_func.declaration_str = `${func.primitive_type} expected_returnValue;`
                            expected_return_of_func.return_str = 'expected_returnValue = ';
                            expected_return_of_func.check_eq_str = 'EXPETED_EQ(expected_returnValue, 0);'
                        } else if (func.type_identifier) {
                            expected_return_of_func.declaration_str = `${func.type_identifier} expected_returnValue;`
                            expected_return_of_func.return_str = 'expected_returnValue = ';
                            expected_return_of_func.check_eq_str = 'EXPETED_EQ(expected_returnValue, 0);'
                        } else {
                            expected_return_of_func.declaration_str = ''
                            expected_return_of_func.return_str = ''
                            expected_return_of_func.check_eq_str = ''
                        }

                        for (const decl of func.declarator_list) {
                            if (decl.primitive_type) {
                                if (decl.identifier) {
                                    declaration_of_func_str += `${decl.primitive_type} ${decl.identifier};`
                                    param_of_func_str += `${decl.identifier},`
                                } else if (decl.pointer_declarator) {
                                    declaration_of_func_str += `${decl.primitive_type} ${decl.pointer_declarator};`
                                    param_of_func_str += `${decl.pointer_declarator.replace('*', '')},`
                                }
                            } else if (decl.type_identifier) {
                                if (decl.identifier) {
                                    declaration_of_func_str += `${decl.type_identifier} ${decl.identifier};`
                                    param_of_func_str += `${decl.identifier},`
                                } else if (decl.pointer_declarator) {
                                    declaration_of_func_str += `${decl.type_identifier} ${decl.pointer_declarator};`
                                    param_of_func_str += `${decl.pointer_declarator.replace('*', '')},`
                                }
                            }
                        }
                    }
                })
                param_of_func_str = param_of_func_str.slice(0, -1);

                let tc_str = `
                /** 
                 * Check coverage case ${tc.case_in_text} = ${tc.condition_result ? 'T' : 'F'} of condition:
                 *      ${tc.condition}
                */
                TEST_F(ClassUnitTest, ${func_name_str}_TC${tc.ts_number}){
    
                    /* Test case declaration */
                    Stub stubObj;
                    ${declaration_of_func_str}
                    ${expected_return_of_func.declaration_str}
                
                    /* Set value */${assing_str}
    
                    /* Call Stub function */${func_call_str}
    
                    /* Call SUT */
                    ${expected_return_of_func.return_str} ${func_name_str}(${param_of_func_str});

                    /* Test case check for variables */
                    ${expected_return_of_func.check_eq_str}
                    ${expected_global_var_str}
                }
                    `
                insert_str += tc_str
            })
        }


        return insert_str;


    } catch (error) {
        throw error;
    }
}
