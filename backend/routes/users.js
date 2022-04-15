const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');

const users = JSON.parse(fs.readFileSync(path.resolve('data/users.json')));

router.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(401).send("Could Not Find User");
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const session = sessions.createSession(req.body.name);
            res.cookie("name", session.name, {overwrite: true});
            res.cookie("token", session.token, {overwrite: true});
            return res.status(200).send("Logged in successfully");
        }
        return res.status(401).send("Password Mismatch");
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

router.get('/users/login', (req, res) => {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (isSessionValid.valid) {
        res.redirect("/index");
    } else {
        res.status(200).render("login");
    }
});

router.get('/users/register', (req, res) => {
    res.render("register");
});

router.post('/users/register', async (req, res) => {
    try {
        // check if user already exists
        let exists = false;
        users.forEach(user => {
            if (user.name == req.body.name) {
                exists = true;
            }
        })
        if (!exists) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            users.push({
                name: req.body.name,
                password: hashedPassword
            })
            fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
            res.status(201).send("User created succesfully.");
        } else {
            res.status(409).send("A user with that name already exists.");
        }
    } catch (err) {
        console.log(err);
        res.status(500).redirect("/error");
    }
});

module.exports = router;