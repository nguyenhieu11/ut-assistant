import glob from 'glob';
import path from 'path';

const directoryPath = '/database';  // Replace with your directory path

glob(directoryPath + '/**/module_name.h', {}, (err, files) => {
    if (err) {
        console.log('Error', err);
    } else {
        if (files.length > 0) {
            console.log('File path is: ' + files[0]);
        } else {
            console.log('module_name.h not found');
        }
    }
});