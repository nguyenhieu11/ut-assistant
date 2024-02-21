
// Helper function to escape special characters in regular expression
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function getTextBetweenTokens(inputText, startToken, endToken) {
    const regex = new RegExp(`${escapeRegExp(startToken)}(.*?)${escapeRegExp(endToken)}`, 'g');
    const results = [];
    let match;

    while ((match = regex.exec(inputText)) !== null) {
        results.push(match[1]);
    }

    return results;
}

const data = getTextBetweenTokens("undefined reference to `abch' more text ..... undefined reference to `hhhhh'", "undefined reference to `", "'");
console.log(data)