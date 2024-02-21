const fs = require('fs');

async function readTextBetweenTokens(filePath) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const regex = /undefined reference to `"(.*?)"'/g; // Modify the regular expression here
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

