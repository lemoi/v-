const fs = require ('fs');
const jsonfile = require('jsonfile');
const path = require('path');

//typescript file directory
const tsBaseDirectory = path.join(__dirname, '../src/compiler');
const tsExt = ['.ts', '.tsx'];

const tsCompilerOptions = {
    "target": "ES5",
    "module": "CommonJS",
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedParameters": true
}

const tsFiles = [];
const tsConfig = {
    "compilerOptions": tsCompilerOptions,
    "files": tsFiles
}

function findTS(file) {
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
        fs.readdirSync(file).forEach(cdir => findTS(path.join(file, cdir)));
    } else {
        if (tsExt.indexOf(path.extname(file)) !== -1) {
            tsFiles.push(path.relative(path.join(__dirname, '../'), file));
        }
    }
}
findTS(tsBaseDirectory);

const target = path.join(__dirname, '../tsconfig.json');
jsonfile.writeFileSync(target, tsConfig, { spaces: 4 });
