const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
const users = require("../utils/users");
const classes = require("../utils/classes");


router.get('/classes', function (req, res) {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (!isSessionValid.valid)
        return res.redirect("/users/login");
    const user = getUser(req.cookies.name);
    const cs = [];
    console.log(cs);
    for (const cn in user.classes) {
        console.log(cn + "cn");
        for (const c in classes) {
            console.log(c + "c");
            if (classes[c].id == user.classes[cn]) {
                cs.push(classes[c]);
            }
        }
    }
    console.log(cs);
    return res.render('classes', {
        classes: cs,
        type: user.type
    });
});

function getUserI(name) {
    for (let i = 0 ; i < users.length; i++) {
        if (users[i].name == name) {
            return i;
        }
    }
    return false;
}

function getUser(name) {
    return users[getUserI(name)];
}

module.exports = router;