const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');

router.get('/', (req, res) => {
    res.redirect("/index");
});

router.get('/index', (req, res) => {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (isSessionValid.valid) {
        res.status(200).render('index', {name:req.cookies.name});
    } else {
        res.status(200).render('index', {name:"User"});
    }
});

module.exports = router;