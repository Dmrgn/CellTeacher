const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
const captchas = require('../utils/captchas');
const users = require('../utils/users');


router.post('/users/login', async (req, res) => {
    const captcha = captchas.validate(req.body.captcha.text, req.body.captcha.id);
    if (!captcha.valid) {
        return res.status(422).send("Captcha Failed");
    }
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(402).send("Could Not Find User");
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const session = sessions.createSession(req.body.name);
            res.cookie("name", session.name, {overwrite: true});
            res.cookie("token", session.token, {overwrite: true});
            return res.status(200).send("Logged in successfully");
        }
        return res.status(403).send("Password Mismatch");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
});

router.post('/users/register', async (req, res) => {
    const captcha = captchas.validate(req.body.captcha.text, req.body.captcha.id);
    if (!captcha.valid) {
        return res.status(422).send("Captcha Failed");
    }
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
            const type = (req.body.type == "teacher") ? "teacher" : "student";
            users.push({
                name: req.body.name,
                password: hashedPassword,
                type: type,
            })
            fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
            res.status(201).send("User created succesfully.");
        } else {
            res.status(409).send("A user with that name already exists.");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
});

router.get('/users/login', (req, res) => {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (isSessionValid.valid) {
        return res.status(201).send("Already logged in.");
    } else {
        const captcha = captchas.createCaptcha();
        res.status(200).json({captcha:captcha.data,captchaId:captcha.id});
    }
});

router.get('/users/register', (req, res) => {
    const captcha = captchas.createCaptcha();
    res.json({captcha:captcha.data,captchaId:captcha.id});
});

router.delete('/users/delete', async (req, res) => {
    try {
        const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
        if (isSessionValid.valid) {
            // checks if user exists
            const exists = getUserI(req.cookies.name);
            if (exists != false) {
                users.splice(1,exists);
                fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
                return res.status(200).send("User deleted.");
            } else {
                return res.status(404).send("User doesn't exist.");
            }
        } else {
            return res.status(401).send("Please login first.");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error.");
    }
});

router.get('/users/manage', (req, res) => {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (isSessionValid.valid) {
        const user = getUser(req.cookies.name);
        if (!user)
            return res.status(404).send("User not found.");
        res.json({name:user.name, type:user.type, classes:user.classes});
    } else {
        return res.status(401).send("Please login first.");
    }
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