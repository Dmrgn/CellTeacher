const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
const captchas = require('../utils/captchas');

const classes = JSON.parse(fs.readFileSync(path.resolve('data/classes.json')));

router.get('/classes', function (req, res) {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (!isSessionValid.valid) {
        return res.redirect("/users/login");
    }
    res.render('classes', {classes:});
});

module.exports = router;