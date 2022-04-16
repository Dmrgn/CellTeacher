const fs = require('fs');
const path = require('path');

let classes = JSON.parse(fs.readFileSync(path.resolve('data/classes.json')));

module.exports = classes;