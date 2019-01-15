const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

let access_tokens = {};
let refresh_tokens = {};

router.post('/sign_up', (request, response) => {
  let context = { message: [] };

  request.checkBody('username', 'Invalid Username').notEmpty();
  request.checkBody('email', 'Invalid Email').notEmpty();
  request.checkBody('password', 'Invalid Password').notEmpty();
  request.checkBody('confirm', 'Invalid Password').notEmpty();

  let validation_errors = request.validationErrors();

  if (validation_errors) {
    context.message.push('Complete the form input fields');
    return response.json(context);  
  }
  else {
    request.checkBody('email', 'Invalid Email').isEmail();
    let email_validation = request.validationErrors();
    if (email_validation) {
      context.message.push('Invalid Email');
      return response.json(context);  
    }

    if (request.body.username.length < 4) {
      context.message.push('Username\'s length cannot be less than 4');
      return response.json(context);
    }

    if (request.body.password.length < 8) {
      context.message.push('Password\'s length cannot be less than 8');
      return response.json(context);
    }
    if (request.body.password !== request.body.confirm) {
      context.message.push('Passwords didn\'t match');
      return response.json(context);
    }

    User.findOne({'username': request.body.username}, (error, docs) => {
      if (docs) {
        context.message.push('Username was already taken');
        return response.json(context);
      }
      else {
        let new_user = new User();
        new_user.username = request.body.username;
        new_user.email = request.body.email;
        new_user.user_type = request.body.user_type;
        new_user.password = new_user.encrypt_password(request.body.password);

        new_user.save((error, result) => {
          if (error) {
            console.log(error);
          }
          context.message = 'ok';
          return response.json(context);
        }); 
      }
    });
  }
});


router.post('/sign_in', (request, response) => {
  let context = { message: [] };

  request.checkBody('username', 'Invalid Username').notEmpty();
  request.checkBody('password', 'Invalid Password').notEmpty();
  let validation_errors = request.validationErrors();

  if (validation_errors) {
    context.message.push('Complete the form input fields');
    return response.json(context);
  }

  User.findOne({ 'username': request.body.username }, (error, user_object) => {
    if (error) {
      console.log(error);
    }
    if (user_object !== null) {
      let check_password = user_object.compare_password(request.body.password);
      if (check_password) {
        context.message = 'ok'
        context['token'] = jwt.sign({ user: user_object }, response.locals.secret_key, { expiresIn: 15 });
        access_tokens[context.token] = request.fingerprint.hash;
        context['refresh_token'] = jwt.sign({ user: user_object }, response.locals.secret_key_refresh, { expiresIn: '60d' });
        refresh_tokens[context.refresh_token] = user_object.username;
        return response.json(context);
      }
    }
    context.message.push('Incorrect username or password');
    return response.json(context);
  });

});

router.post('/token', (request, response) => {
  // console.log(request);
  let username = request.body.username;
  let old_access_token = request.body.authorization;
  let refresh_token = request.body.refresh_token;
  jwt.verify(refresh_token, response.locals.secret_key_refresh, (error, authData) => {
    if (error) {
      console.log('here baby');
      response.sendStatus(401);
    }
    else {
      if (((refresh_token in refresh_tokens) && (refresh_tokens[refresh_token] == username)) &&
       ((old_access_token in access_tokens) && (request.fingerprint.hash === access_tokens[old_access_token]))) {
        let access_token = jwt.sign({ user: username }, response.locals.secret_key, { expiresIn: 15 });
        access_tokens[access_token] = request.fingerprint.hash;
        response.json({ access_token });
      }
      else {
        response.sendStatus(401);
      }
    }
  });
});

router.get('/user_data', verify_token, (request, response, next) => {
  response.send('ok');
});


function verify_token(request, response, next) {
  // console.log(request.fingerprint);
  // console.log(access_tokens);
  let access_token = request.headers['authorization'];
  if (typeof access_token !== 'undefined') {

    jwt.verify(access_token, response.locals.secret_key, (error, authData) => {
      if (error) {
        response.sendStatus(403);
      }
      else {
        // verify fingerprint here
        if ((access_token in access_tokens) && (request.fingerprint.hash === access_tokens[access_token])) {
          next();
        }   
        else {
          response.sendStatus(403);
        }
      }
    });
  }
  else {
    response.sendStatus(403);
  }
}


module.exports = router, verify_token;


