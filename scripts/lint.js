const tslint = require('tslint');
const configuration = require('../tslint.json');
const tsFiles = require('../tsconfig.json').files;
const read = require('fs').readFile;
const path = require('path');

const options = {
    formatter: "codeFrame",
    fix: false
};

function lint() {
    const linter = new tslint.Linter(options);
    const failedFileSets = {};
    tsFiles.forEach(function (file) {
        read(file, 'utf8', function (err, source) {
            linter.lint(file, source, configuration);
            const result = linter.getResult();
            if (result.failureCount > 0) {
                if (!failedFileSets.hasOwnProperty(result.fileName)) {
                    failedFileSets[result.fileName] = '';
                    console.log(result.output);
                }
            }
        });
    });
}

lint();
