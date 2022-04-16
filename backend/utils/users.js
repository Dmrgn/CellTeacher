const fs = require('fs');
const path = require('path');

let users = JSON.parse(fs.readFileSync(path.resolve('data/users.json')));

module.exports = users;