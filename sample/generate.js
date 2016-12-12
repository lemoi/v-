const pack = require('../packer')
const fs = require('fs')
fs.writeFile('./sample.vm', pack('sample.v'), 'utf8', function (err) {
    console.log('complete')
})