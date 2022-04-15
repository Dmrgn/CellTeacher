const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fs = require('fs')
const app = express();

app.use(cors())

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const errorRouter = require("./routes/error");

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use('/users', express.static('public'));

app.get('/', indexRouter);
app.get('/index', indexRouter);
app.get('/error', errorRouter);

app.get('/users/register', usersRouter);
app.get('/users/login', usersRouter);

app.post('/users/register', usersRouter);
app.post('/users/login', usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port));