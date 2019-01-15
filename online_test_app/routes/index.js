const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
  response.json([
    {username: 'Cedrick', email: 'cedie712@gmail.com'},
    {username: 'Billy', email: 'bill@gmail.com'},
  ]);
});

module.exports = router;
