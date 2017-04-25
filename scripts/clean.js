const fs = require('fs');
const tsFiles = require('../tsconfig.json').files;

tsFiles.forEach(function (file) {
    file = file.replace(/(?:\.d)?\.ts$/, '.js');
    if (fs.existsSync(file)) {
        fs.unlink(file);
    }
});