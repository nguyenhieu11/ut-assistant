const inputString = "hhafkd shfa sd FUNC( aaa,bbb) adsjh asjfasdf jasdf FUNC(ccc, dddd) adsf";
const regex = /FUNC\s*\(\s*(\w+)\s*,\s*\w+\s*\)/g;
const modifiedString = inputString.replace(regex, '$1');

console.log(modifiedString);


function removeComments(code) {
    // Remove all multi-line comments
    let noComments = code.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove all single-line comments
    noComments = noComments.replace(/\/\/.*/g, '');
    return noComments;
}
