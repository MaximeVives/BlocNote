let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require("mongoose");
require('dotenv').config()

let authRouter = require('./routes/auth');
let notesRouter = require('./routes/notes');

let app = express();

let connection = process.env.DB_HOST

mongoose.connect(connection, { useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// mongoose.connection.collections.notes.dropIndex("email_1").then(() => {
//     console.log("Index dropped")
// }).catch(() => {
//     console.log("Index not dropped")
// })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/notes', notesRouter);

module.exports = app;
