var express = require('express');
var ordersRouter = express.Router();
const db = require('../db')


ordersRouter.get('/:orderid', (req, res, next) => {
  db.query('SELECT * FROM orders WHERE id = $1', [req.params.orderid], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
});

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

ordersRouter.put('/:orderid', (req, res) => {
  const orderId = req.params.orderid;
  const {date, total_price} = req.body;

  db.query('UPDATE orders SET date = COALESCE($1, date), total_price = COALESCE($2, total_price) WHERE id = $3', [date, total_price, orderId])
  .then(() => {
    res.status(200).send(`Order ${orderId} updated successfully`);
  })
  .catch((err) => {
    console.log(err)
    res.status(500).send(`An error occurred while updating order`);
  })
})


ordersRouter.delete('/:orderid', (req, res) => {
  const orderId = req.params.orderid;

  db.query('DELETE FROM orders WHERE id = $1', [orderId])
  .then(() => {
    res.status(204).send(`Order ${orderId} deleted successfully.`)
  }).catch((err) => {
    console.log(err);
    res.status(500).send(`Error on deleting item.`)
  })
})


  module.exports = ordersRouter;
  
  