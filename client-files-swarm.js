let { execFile } = require('child_process');
let num = 3;
for (let i = 0; i < num; i++) {
    let child = execFile('node', ['client-files.js', 'D:\\SaNyA\\BSTU\\PSCA\\cwp-03\\client-files'], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
    });
}