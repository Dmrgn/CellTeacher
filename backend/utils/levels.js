const fs = require('fs');
const path = require('path');

const levels = {
    data:JSON.parse(fs.readFileSync(path.resolve('data/levels.json'))),
};

levels.update = function() {
    for (const level of levels.data) {
        level.raw = JSON.parse(fs.readFileSync(path.resolve(`data/levels/${level.id}.json`)));
    }
}

levels.getLevel = function(id) {
    for (const level of levels.data) {
        if (level.id == id) {
            return level;
        }
    }
    return false;
}

levels.update();

module.exports = levels;