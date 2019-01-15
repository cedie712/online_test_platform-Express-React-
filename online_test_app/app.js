const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const validator = require('express-validator');
const fingerprint = require('express-fingerprint')

// Routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user')

const app = express();

// db_connection
mongoose.connect('mongodb://localhost:27017/otp_db', { useNewUrlParser: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

app.use((request, response, next) => {
  response.locals.secret_key = '@#-fk#$0fer#$#AWCe#Eff-34F-3ckaSc#_3$cc#^ddc3';
  response.locals.secret_key_refresh = '#$%ge^54f$#gdd%^g_45fg-__$5+45krlg$%04vf4';
  next()
});

app.use(fingerprint({
  parameters:[
      // Defaults
      fingerprint.useragent,
      fingerprint.acceptHeaders,
      fingerprint.geoip,
  ]
}))

app.use('/api/user', userRouter);
app.use('/api', indexRouter);


module.exports = app;
