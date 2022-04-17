const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const router = express.Router();
const sessions = require('../utils/sessions');
let users = require("../utils/users");
let levels = require("../utils/levels");
let classes = require("../utils/classes");

// join a class with the specified join code
router.post('/classes/join/:code', function(req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
    const cs = [];
    for (const cn in user.classes) {
        for (const c in classes) {
            if (classes[c].id == user.classes[cn]) {
                cs.push(classes[c]);
            }
        }
    }
    // locate class with specified join code
    let toJoin = false;
    for (const c of classes) {
        if (c.code == req.params.code) {
            toJoin = c;
        }
    }
    if (toJoin == false)
        return res.status(404).send("Class not found.");
    // check to see if user is already in that class
    let found = false;
    for (const c of cs) {
        if (c.id == toJoin.id) {
            return res.status(404).send("User already in specified class.");
        }
    }
    // add user to specified class
    user.classes.push(toJoin.id);
    toJoin.students.push(user.name);
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
    return res.status(200).json(toJoin);
})

// list all classes the user is in
router.post('/classes', function (req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
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

// list data of specified class that the student or teacher is in
router.post('/classes/:c', function (req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
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

// assign level to class as a teacher
router.post('/classes/:c/levels/:level', function (req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
    if (user.type == "student")
        return res.status(402).send("Students don't have access to this!");
    if (!userInClass(user, req.params.c))
        return res.status(402).send("You are not part of that class.");
    let found = getClass(req.params.c);
    if (!found)
        return res.status(404).send("Class not found.");
    // check if specified level exists
    const level = levels.getLevel(Number(req.params.level));
    if (!level)
        return res.status(404).send("Level not found.");
    // check if level is already assigned
    let foundLevel = false;
    for (const l of found.assignments) {
        if (l.id == level.id) {
            foundLevel = true;
        }
    }
    if (foundLevel)
        return res.status(404).send("Level already assigned.");
    // check if due date provided
    if (!req.body.due || isNaN(Number(req.body.due)))
        return res.status(400).send("Please attach a due date.");
    found.assignments.push({
        "id":Number(level.id),
        "due":Number(req.body.due),
        "finished":[]
    });
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    return res.json(found);
});

// submit level as a student
router.put('/classes/:c/levels/:level', function (req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
    if (user.type == "teacher")
        return res.status(402).send("Teacher's can't submit assignments.");
    if (!userInClass(user, req.params.c))
        return res.status(402).send("You are not part of that class.");
    let found = getClass(req.params.c);
    if (!found)
        return res.status(404).send("Class not found.");
    // check if specified level exists
    const level = levels.getLevel(Number(req.params.level));
    if (!level)
        return res.status(404).send("Level not found.");
    // check if level is assigned
    let foundLevel = false;
    for (const l in found.assignments) {
        if (found.assignments[l].id == level.id) {
            foundLevel = l;
        }
    }
    if (foundLevel === false)
        return res.status(400).send("Level not assigned");
    // check if user already completed assignment
    if (found.assignments[foundLevel].finished.indexOf(user.name) >= 0)
        return res.status(400).send("Already submitted that assignment.");
    found.assignments[foundLevel].finished.push(user.name);
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    return res.json(found);
});

// delete student from class as a teacher
router.delete('/classes/:c/student/:username', function(req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
    if (user.type == "student")
        return res.status(402).send("Students don't have access to this!");
    if (!userInClass(user, req.params.c))
        return res.status(402).send("You are not part of that class.");
    let found = getClass(req.params.c);
    if (!found)
        return res.status(404).send("Class not found.");
    // check if student to be deleted is in the class
    let studentFound = false;
    for (const s of found.students) {
        if (s == req.params.username) {
            studentFound = s;
        }
    }
    if (studentFound === false)
        return res.status(404).send("Student not found.");
    // remove class from student
    const student = getUser(studentFound);
    if (!student)
        return res.status(404).send("Student not found.");
    if (student.classes.indexOf(Number(req.params.c)) >= 0)
        student.classes = student.classes.splice(student.classes.indexOf(req.params.c), 1);
    if (found.students.indexOf(req.params.username) >= 0)
        found.students = found.students.splice(found.students.indexOf(req.params.username), 1);
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
    return res.status(200).send("Student removed.");
});

// create a class as a teacher
router.post('/classes/create', function (req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
    if (user.type == "student")
        return res.status(402).send("Students cannot create classes.");
    if (!req.body.newName)
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
        name:req.body.newName,
        code:code,
        students:[],
        teachers:[req.body.name],
        assignments:[]
    });
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
    return res.status(200).json(classes[classes.length - 1]);
});

// delete a class as a teacher
router.delete('/classes/delete', function (req, res) {
    const isSessionValid = sessions.validate(req.body.name, req.body.token);
    if (!isSessionValid.valid)
        return res.status(401).send("Please login first.");
    const user = getUser(req.body.name);
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
    classes = classes.splice(index, 1);
    fs.writeFileSync(path.join("data/classes.json"), JSON.stringify(classes));
    fs.writeFileSync(path.join("data/users.json"), JSON.stringify(users));
    return res.status(200).send("Class deleted.");
});

function userInClass(user, classId) {
    let isInClass = false;
    for (let i = 0; i < user.classes.length; i++) {
        if (user.classes[i] == classId)
            isInClass = true;
    }
    return isInClass;
}

function getClass(classId) {
    let found = false;
    for (const c of classes) {
        if (c.id == classId) {
            found = c;
        }
    }
    return found;
}

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