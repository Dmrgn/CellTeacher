const scriptElm = document.querySelector("textarea");
const scriptNameElm = document.querySelector("#scriptName");
const descElm = document.querySelector("#description");
let scriptFocused = false;
let scripts = [];

scriptElm.addEventListener("input", () => {
    // const tokens = tokenize(scriptElm.value);
    // console.log(tokens.slice(0, tokens.length));
    // const tsa = ast(tokens);
    // console.log(tsa);
    scripts[currCell] = scriptElm.value;
});

scriptElm.addEventListener("blur", function() {
    scriptFocused = false;
});
scriptElm.addEventListener("focus", function() {
    scriptFocused = true;
});

function updateUI() {
    
    scriptElm.innerText = scripts[currCell];

    scriptNameElm.innerText = types[currCell];
    console.log(`color: rgb(${red(cols[currCell])},${green(cols[currCell])},${blue(cols[currCell])});`);
    scriptNameElm.style = `color: rgb(${red(cols[currCell])},${green(cols[currCell])},${blue(cols[currCell])}); text-shadow: 2px 2px 10px #ffffff;`;
    console.log(scriptNameElm.style.color);
    descElm.innerText = "This is a cool cell.";
}

// function isWhiteSpace(char) {
//     return char == " " || char == "\n";
// }

// function ast(tokens) {
//     let stack = [];
//     let objs = [];
//     while (tokens.length > 0) {
//         const token = tokens.shift();
//         let branch = {};
//         switch (true) {
//             case token.type == "id":
//                 if (stack?.[stack.length - 1]?.type == "equals" || stack?.[stack.length - 1]?.type == "notequals") {
//                     branch.type = "expression";
//                     branch.value = stack.pop();
//                     branch.op1 = stack.pop();
//                     branch.op2 = token;
//                     break;
//                 }
//                 stack.push(token);
//                 break;
//             case token.type == "equals":
//                 stack.push(token);
//                 break;
//             case token.type == "conditional":
//                 branch.type = "conditional";
//                 // get in between if and start statements
//                 let untilStart = [];
//                 if (tokens.length == 0) break;
//                 let cur;
//                 do {
//                     cur = tokens.shift();
//                     console.log(cur);
//                     untilStart.push(cur);
//                 } while(cur.type != "start" && tokens.length > 0);
//                 untilStart.pop();
//                 console.log("untilStart");
//                 console.log(untilStart.slice(0, untilStart.length));
//                 branch.value = ast(untilStart);
//                 // get in between start and end/else statements
//                 let untilEnd = [];
//                 if (tokens.length == 0) break;
//                 do {
//                     cur = tokens.shift();
//                     untilEnd.push(cur);
//                 } while(cur.type != "end" && cur.type != "else" && tokens.length > 0);
//                 branch.contents = ast(untilEnd);
//                 if (cur.type == "else") {
//                     // get in between else and end statements
//                     untilEnd = [];
//                     if (tokens.length == 0) break;
//                     do {
//                         cur = tokens.shift();
//                         untilEnd.push(cur);
//                     } while(cur.type != "end" && tokens.length > 0)
//                     branch.else = ast(untilEnd);
//                 }
//                 branch.contents = ast(untilStart);
//                 break;
//             default:
//                 branch.type = "id";
//                 branch.value = token;
//                 break;
//         }
//         if (Object.keys(branch).length > 0)
//             objs.push(branch);
//     }
//     return objs;
// }

// function tokenize(str) {
//     let index = 0;
//     const tokens = [];
//     while (index < str.length) {
//         let token = {};
//         switch (true) {
//             case str.substring(index, index + 2) == "if":
//                 token.type = "conditional";
//                 index+=1;
//                 break;
//             case str.substring(index, index + 3) == "var":
//                 token.type = "variable";
//                 index+=2;
//                 break;
//             case str.substring(index, index + 4) == "else":
//                 token.type = "else";
//                 index+=3;
//                 break;
//             case str.substring(index, index + 2) == "do":
//                 token.type = "do";
//                 index+=1;
//                 break;
//             case str.substring(index, index + 2) == "==":
//                 token.type = "equals";
//                 index+=1;
//                 break;
//             case str.substring(index, index + 2) == "!=":
//                 token.type = "notequals";
//                 index+=1;
//                 break;
//             case str.substring(index, index + 3) == "end":
//                 token.type = "end";
//                 index+=2;
//                 break;
//             case str.substring(index, index + 5) == "start":
//                 token.type = "start";
//                 index+=4;
//                 break;
//             default:
//                 if (isWhiteSpace(str[index]))
//                     break;
//                 token.type = "id";
//                 token.value = "";
//                 while(!isWhiteSpace(str[index]) && index < str.length) {
//                     token.value += str[index];
//                     index++;
//                 }
//                 index--;
//                 break;
//         }
//         index++;
//         if (Object.keys(token).length > 0) {
//             tokens.push(token);
//         }
//     }
//     return tokens;
// }