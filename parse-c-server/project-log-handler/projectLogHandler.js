import fs from "fs";

async function readTextBetweenTokens() {
    try {
        const data = "undefined reference to " + "`" + "abch" + "'"
            + "more text ....." + "undefined reference to " + "`" + "hhhhh" + "'"
        const regex = /undefined reference to `(.*?)'/g; // Corrected regular expression
        const results = [];
        let match;

        while ((match = regex.exec(data)) !== null) {
            results.push(match[1]);
        }

        return results;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

// readTextBetweenTokens().then(results => console.log(results));

