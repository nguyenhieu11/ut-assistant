import fs from 'fs'


export async function insertToTestFile(folder_path, module_name, test_case_str, extern_func_str, extern_global_var_str, stub_func_str) {
    try {
        /**===== Start insert .cpp file =====*/
        let cpp_file_str = fs.readFileSync(`${folder_path}/test_${module_name}/test_${module_name}.cpp`, 'utf8');
        // Find the position to insert the text
        const beginMarker_TC_STRING = '//=================BEGIN_AUTO_GEN_TC=================//';
        const endMarker_TC_STRING = '//==================END_AUTO_GEN_TC==================//';

        const beginIndex_TC_STRING = cpp_file_str.indexOf(beginMarker_TC_STRING);
        const endIndex_TC_STRING = cpp_file_str.indexOf(endMarker_TC_STRING, beginIndex_TC_STRING + beginMarker_TC_STRING.length);

        if (beginIndex_TC_STRING === -1 || endIndex_TC_STRING === -1) {
            console.error('Markers TC_STRING not found in the file');
            return '';
        }
        // Delete the text between markers and insert the new text
        let modifiedContent = cpp_file_str.slice(0, beginIndex_TC_STRING + beginMarker_TC_STRING.length) + test_case_str + '\n\t' + cpp_file_str.slice(endIndex_TC_STRING);

        /** Insert extern function string */
        const beginMarker_EXTERN_FUNC = '//==================BEGIN_AUTO_EXTERN_FUNCTION==================//';
        const endMarker_EXTERN_FUNC = '//==================END_AUTO_EXTERN_FUNCTION==================//';

        const beginIndex_EXTERN_FUNC = modifiedContent.indexOf(beginMarker_EXTERN_FUNC);
        const endIndex_EXTERN_FUNC = modifiedContent.indexOf(endMarker_EXTERN_FUNC, beginIndex_EXTERN_FUNC + beginMarker_EXTERN_FUNC.length);

        if (beginIndex_EXTERN_FUNC === -1 || endIndex_EXTERN_FUNC === -1) {
            console.error('Markers EXTERN_FUNCTION not found in the file');
            return '';
        }
        // Delete the text between markers and insert the new text
        modifiedContent = modifiedContent.slice(0, beginIndex_EXTERN_FUNC + beginMarker_EXTERN_FUNC.length) + extern_func_str + '\n' + modifiedContent.slice(endIndex_EXTERN_FUNC);
        // Write the modified content back to the file

        /** Insert extern function string */
        const beginMarker_EXTERN_VARIABLE = '//==================BEGIN_AUTO_EXTERN_VARIABLE==================//';
        const endMarker_EXTERN_VARIABLE = '//==================END_AUTO_EXTERN_VARIABLE==================//';

        const beginIndex_EXTERN_VARIABLE = modifiedContent.indexOf(beginMarker_EXTERN_VARIABLE);
        const endIndex_EXTERN_VARIABLE = modifiedContent.indexOf(endMarker_EXTERN_VARIABLE, beginIndex_EXTERN_VARIABLE + beginMarker_EXTERN_VARIABLE.length);

        if (beginIndex_EXTERN_VARIABLE === -1 || endIndex_EXTERN_VARIABLE === -1) {
            console.error('Markers EXTERN_VARIABLETION not found in the file');
            return '';
        }
        // Delete the text between markers and insert the new text
        modifiedContent = modifiedContent.slice(0, beginIndex_EXTERN_VARIABLE + beginMarker_EXTERN_VARIABLE.length) + extern_global_var_str + '\n' + modifiedContent.slice(endIndex_EXTERN_VARIABLE);
        // Write the modified content back to the file

        /** Insert extern stub func string */
        const beginMarker_EXTERN_STUB_FUNCTION = '//==================BEGIN_AUTO_EXTERN_STUB_FUNCTION==================//';
        const endMarker_EXTERN_STUB_FUNCTION = '//==================END_AUTO_EXTERN_STUB_FUNCTION==================//';

        const beginIndex_EXTERN_STUB_FUNCTION = modifiedContent.indexOf(beginMarker_EXTERN_STUB_FUNCTION);
        const endIndex_EXTERN_STUB_FUNCTION = modifiedContent.indexOf(endMarker_EXTERN_STUB_FUNCTION, beginIndex_EXTERN_STUB_FUNCTION + beginMarker_EXTERN_STUB_FUNCTION.length);

        if (beginIndex_EXTERN_STUB_FUNCTION === -1 || endIndex_EXTERN_STUB_FUNCTION === -1) {
            console.error('Markers EXTERN_VARIABLETION not found in the file');
            return '';
        }
        // Delete the text between markers and insert the new text
        modifiedContent = modifiedContent.slice(0, beginIndex_EXTERN_STUB_FUNCTION + beginMarker_EXTERN_STUB_FUNCTION.length) + stub_func_str.extern_str + '\n' + modifiedContent.slice(endIndex_EXTERN_STUB_FUNCTION);
        // Write the modified content back to the file


        /** Insert MOCK stub func string */
        const beginMarker_MOCK_STUB_FUNCTION = '//==================BEGIN_AUTO_MOCK_STUB_FUNCTION==================//';
        const endMarker_MOCK_STUB_FUNCTION = '//==================END_AUTO_MOCK_STUB_FUNCTION==================//';

        const beginIndex_MOCK_STUB_FUNCTION = modifiedContent.indexOf(beginMarker_MOCK_STUB_FUNCTION);
        const endIndex_MOCK_STUB_FUNCTION = modifiedContent.indexOf(endMarker_MOCK_STUB_FUNCTION, beginIndex_MOCK_STUB_FUNCTION + beginMarker_MOCK_STUB_FUNCTION.length);

        if (beginIndex_MOCK_STUB_FUNCTION === -1 || endIndex_MOCK_STUB_FUNCTION === -1) {
            console.error('Markers EXTERN_VARIABLETION not found in the file');
            return '';
        }
        // Delete the text between markers and insert the new text
        modifiedContent = modifiedContent.slice(0, beginIndex_MOCK_STUB_FUNCTION + beginMarker_MOCK_STUB_FUNCTION.length) + stub_func_str.mock_str + '\n' + modifiedContent.slice(endIndex_MOCK_STUB_FUNCTION);
        // Write the modified content back to the file

        /** Insert MOCK stub func string */
        const beginMarker_DEFINE_STUB_FUNCTION = '//==================BEGIN_AUTO_DEFINE_STUB_FUNCTION==================//';
        const endMarker_DEFINE_STUB_FUNCTION = '//==================END_AUTO_DEFINE_STUB_FUNCTION==================//';

        const beginIndex_DEFINE_STUB_FUNCTION = modifiedContent.indexOf(beginMarker_DEFINE_STUB_FUNCTION);
        const endIndex_DEFINE_STUB_FUNCTION = modifiedContent.indexOf(endMarker_DEFINE_STUB_FUNCTION, beginIndex_DEFINE_STUB_FUNCTION + beginMarker_DEFINE_STUB_FUNCTION.length);

        if (beginIndex_DEFINE_STUB_FUNCTION === -1 || endIndex_DEFINE_STUB_FUNCTION === -1) {
            console.error('Markers EXTERN_VARIABLETION not found in the file');
            return '';
        }
        // Delete the text between markers and insert the new text
        modifiedContent = modifiedContent.slice(0, beginIndex_DEFINE_STUB_FUNCTION + beginMarker_DEFINE_STUB_FUNCTION.length) + stub_func_str.define_str + '\n' + modifiedContent.slice(endIndex_DEFINE_STUB_FUNCTION);
        // Write the modified content back to the file

        // fs.writeFileSync(`${folder_path}/test_${module_name}/test_${module_name}.cpp`, modifiedContent, 'utf8');
        return modifiedContent
    } catch (error) {
        throw error;
    }
}
