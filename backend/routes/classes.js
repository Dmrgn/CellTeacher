const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
let users = require("../utils/users");
let classes = require("../utils/classes");


router.get('/classes', function (req, res) {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (!isSessionValid.valid)
    return res.status(401).send("Please login first.");
    const user = getUser(req.cookies.name);
    const cs = [];
    for (const cn in user.classes) {
        for (const c in classes) {
            if (classes[c].id == user.classes[cn]) {
                cs.push(classes[c]);
            }
        }
    }
    return res.status(200).json({
        classes: cs,
        type: user.type
    });
});

router.get('/classes/:c', function (req, res) {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (!isSessionValid.valid)
    return res.status(401).send("Please login first.");
    const user = getUser(req.cookies.name);
    let isInClass = false;
    for (let i = 0; i < user.classes.length; i++) {
        if (user.classes[i] ==req.params.c)
            isInClass = true;
    }
    if (!isInClass)
        return res.status(402).send("You are not part of that class.");
    let found = false;
    for (const c of classes) {
        if (req.params.c == c.id) {
            found = c;
        }
    }
    if (!found)
        return res.status(404).send("Class not found.");
    return res.json(found);
});

router.post('/classes/create', function (req, res) {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.cookies.name);
    if (user.type == "student")
        return res.status(402).send("Students cannot create classes.");
    if (!req.body.name)
        return res.status(400).send("Please specify a class name.");
    let code = "";
    const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y","Z","1", "2", "3", "4", "5", "6","7", "8", "9", "0"];
    let codeExists = true;
    while (codeExists) {
        code = "";
        for (let i = 0; i < 8 ; i++) {
            code += chars[Math.floor(Math.random()*chars.length)];
        }
        codeExists = false;
        for (const c in classes) {
            if (c.code == code) {
                codeExists = true;
                break;
            }
        }
    }
    classes.push({
        id:classes.length > 0 ? classes[classes.length - 1].id+1 : 0,
        name:req.body.name,
        code:code,
        students:[],
        teachers:[req.cookies.name],
        assignments:[]
    });
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
    return res.status(200).json(classes[classes.length - 1]);
});

router.delete('/classes/delete', function (req, res) {
    const isSessionValid = sessions.validate(req.cookies.name, req.cookies.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.cookies.name);
    if (user.type == "student")
        return res.status(402).send("Students cannot delete classes.");
    if (req.body.id && req.body.id != 0)
        return res.status(400).send("Please specify a class id.");
    let index = false;
    for (const c in classes) {
        if (classes[c].id == req.body.id) {
            for (const t in classes[c].teachers) {
                console.log(classes[c].teachers[t]);
                if (classes[c].teachers[t] == user.name) {
                    console.log("here");
                    index = c;
                    break;
                }
            }
            if (index != false) break;
        }
    }
    console.log(index);
    if (index === false)
        return res.status(400).send("You don't have permission to delete that class.");
    for (const s of classes[index].students) {
        for (const ss of users) {
            if (ss.name == s) {
                if (ss.classes.indexOf(classes[index].id) != -1) {
                    ss.classes.splice(ss.classes.indexOf(classes[index].id), 1);
                }
            }
        }
    }
    for (const t of classes[index].teachers) {
        for (const ss of users) {
            if (ss.name == t) {
                if (ss.classes.indexOf(classes[index].id) != -1) {
                    ss.classes.splice(ss.classes.indexOf(classes[index].id), 1);
                }
            }
        }
    }
    console.log(index);
    console.log(classes.splice(index, 1));
    classes = classes.splice(index, 1);
    console.log(classes);
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
    return res.status(200).send("Class deleted.");
});

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function getUserClasses(user) {
    const cs = [];
    for (const cn in user.classes) {
        for (const c in classes) {
            if (classes[c].id == user.classes[cn]) {
                cs.push(classes[c]);
            }
        }
    }
    return cs;
} 

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