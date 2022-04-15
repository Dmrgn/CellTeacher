const path = require('path');
const randtoken = require('rand-token');

const SESSION_LENGTH = 30;
const current = [];
const sessions = {};

// valid a user's session token
sessions.validate = (name, token) => {
    // find user's session
    for (x in current) {
        const session = current[x];
        if (session.name === name) {
            if (session.token === token) {
                // check how much time session has left on it
                const served = (new Date()).getTime() - session.time;
                if (served/60/1000 < session.length) {
                    return {
                        valid: true,
                        message: "Session validated.",
                    };
                } else {
                    current.splice(x, 1);
                    return {
                        valid: false,
                        message: "Session has expired, please relogin."
                    };
                }
            } else {
                current.splice(x, 1);
                return {
                    valid: false,
                    message: "Session token was invalid, please relogin."
                };
            }
        }
    };
    return {
        valid: false,
        message: "No active sessions were found, please relogin."
    };
}

// create a session for the passed user and return it
sessions.createSession = (name) => {
    // remove existing sessions of this user
    current.forEach((session, x) => {
        if (session.name === name) {
            current.splice(x, 1);
        }
    });
    // create new session
    const session = {
        name: name,
        token: randtoken.uid(64),
        length: SESSION_LENGTH,
        time: (new Date).getTime()
    }
    current.push(session);
    return session;
};

module.exports = sessions;