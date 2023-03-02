var express = require('express');
var ordersRouter = express.Router();
const db = require('../db')


ordersRouter.get('/', (req, res, next) => {
  db.query('SELECT * FROM orders')
    .then(result => res.json(result.rows))
    .catch(err => console.error("err"));
});


ordersRouter.post('/new', (req, res, next) => {
  const {user_id, date, total_price} = req.body;
  db.query('SELECT * FROM users WHERE id = $1', [user_id])
  .then(result => {
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return db.query('INSERT INTO orders (user_id, date, total_price) VALUES ($1, $2, $3) RETURNING *', [user_id, date, total_price]);
  })
  .then(result => {
    const order = result.rows[0];
    res.status(201).json(order);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('An error occurred while inserting the order');
  });
});


  module.exports = ordersRouter;
  
  