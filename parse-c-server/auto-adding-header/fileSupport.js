import fs from 'fs';
import util from 'util';
import path from 'path';

const readdir = util.promisify(fs.readdir);
const directoryPath = '/database';  // Replace with your directory path

async function findModuleFile() {
    try {
        const files = await readdir(directoryPath);

        // Filter out module_name.h file
        let moduleFile = files.filter(file => file === 'module_name.h');

        if (moduleFile.length > 0) {
            console.log('File path is: ' + path.join(directoryPath, moduleFile[0]));
        } else {
            console.log('module_name.h not found');
        }
    } catch (err) {
        console.log('Unable to scan directory: ' + err);
    }
}

findModuleFile();