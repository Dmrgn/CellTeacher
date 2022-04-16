const svgCaptcha = require('svg-captcha');

const captchas = {};
const captchaList = {};

const MAX_CAPTCHAS = 1000;

captchas.createCaptcha = () => {
    const captcha = svgCaptcha.create();
    const captchaId = Object.keys(captchaList).length;
    captchaList[captchaId] = captcha.text;
    // restrict length of captcha list to < MAX_CAPTCHAS
    while (captchaList.length > MAX_CAPTCHAS) {
        delete captchaList[Object.keys(captchaList)[0]];
    }
    return {
        text: captcha.text,
        data: captcha.data,
        id: captchaId
    };
}

captchas.validate = (guess, id) => {
    if (captchaList.hasOwnProperty(id)) {
        if (captchaList[id] === guess) {
            delete captchaList[id];
            return {
                valid: true,
                message: 'Captcha validated.'
            }
        } else {
            delete captchaList[id];
            return {
                valid: false,
                message: 'Captcha failed, please try again.'
            }
        }
    } else {
        return {
            valid: false,
            message: 'Captcha ID not found, please try again.'
        }
    }
}

module.exports = captchas;