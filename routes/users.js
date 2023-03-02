var express = require('express');
var usersRouter = express.Router();
const db = require('../db')
/*
usersRouter.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
})*/

usersRouter.get('/', (req, res, next) => {
  db.query('SELECT * FROM users')
    .then(result => console.log(result.rows))
    .catch(err => console.error("err"));
});



module.exports = usersRouter;





