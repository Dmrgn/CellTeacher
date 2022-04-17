const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
const levels = require('../utils/levels');

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

router.get('/levels/:id', (req, res) => {
    if (isNaN(Number(req.params.id)))
        return res.status(400).send("Please specify a level ID.");
    const level = levels.getLevel(Number(req.params.id));
    if (!level)
        return res.status(404).send("Level not found.");
    return res.status(200).json(level);
});

module.exports = router;