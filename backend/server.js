const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fs = require('fs')
const app = express();
const logger = require("./utils/logger");
const execs = require("./utils/execs");

app.use(cors())

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const indexRouter = require("./routes/index");

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use('/users', express.static('public'));

app.get('/', indexRouter);
app.get('/index', indexRouter);
app.get('/users', usersRouter);
app.post('/users/create', usersRouter);
app.delete('/users/delete', usersRouter);
app.post('/users/login', usersRouter);
app.get('/logger/getlog', loggerRouter);
app.get('/execs', execsRouter);
app.post('/execs/create', execsRouter);
app.delete('/execs/delete', execsRouter);
app.get('/data/images/:image', dataRouter);
app.get('/data/execs/:exec', dataRouter);
app.get('/data/execs', dataRouter);
app.post('/mail', mailRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port));