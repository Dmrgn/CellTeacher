const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
const captchas = require('../utils/captchas');

const users = JSON.parse(fs.readFileSync(path.resolve('data/users.json')));

router.post('/users/login', async (req, res) => {
    const captcha = captchas.validate(req.body.captcha.text, req.body.captcha.id);
    if (!captcha.valid) {
        return res.status(422).send("/error?message=Captcha Failed");
    }
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
        return res.status(500).send("Server Error");
    }
});

router.post('/users/register', async (req, res) => {
    const captcha = captchas.validate(req.body.captcha.text, req.body.captcha.id);
    if (!captcha.valid) {
        return res.status(422).send("/error?message=Captcha Failed");
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
        res.status(500).redirect("Server Error");
    }
});

router.get('/users/login', (req, res) => {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (isSessionValid.valid) {
        res.redirect("/index");
    } else {
        const captcha = captchas.createCaptcha();
        res.status(200).render("login", {captcha:captcha.data,captchaId:captcha.id});
    }
});

router.get('/users/register', (req, res) => {
    const captcha = captchas.createCaptcha();
    res.render("register", {captcha:captcha.data,captchaId:captcha.id});
});

router.get('/users/delete', async (req, res) => {
    try {
        const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
        if (isSessionValid.valid) {
            // checks if user exists
            const exists = getUserI(req.cookies.name);
            if (exists != false) {
                users.splice(1,exists);
                fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
                res.status(200).redirect("/users/login");
            } else {
                res.status(404).redirect("/error?message=User does not exist.");
            }
        } else {
            res.status(401).redirect("/users/login");
        }
    } catch (err) {
        console.log(err);
        res.status(500).redirect("/error?message=Could not delete user.");
    }
});

router.get('/users/manage', (req, res) => {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (isSessionValid.valid) {
        const user = getUser(req.cookies.name);
        if (!user)
            return res.status(403).redirect("/error?message=User not found");
        res.render("manage", {name:user.name, type:user.type});
    } else {
        res.status(401).redirect("/users/login");
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