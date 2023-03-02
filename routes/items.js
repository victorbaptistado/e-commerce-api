var express = require('express');
var itemsRouter = express.Router();
const db = require('../db')


itemsRouter.get('/', (req, res, next) => {
    db.query('SELECT * FROM items')
      .then(result => 
        res.json(result.rows))
      .catch(err => console.error("err"));
});
  
itemsRouter.post('/new', (req, res, next) => {
  const { name, description, quantity, price} = req.body;
  db.query('INSERT INTO items (name, description, quantity, price) VALUES ($1, $2, $3, $4)', [name, description, quantity, price]), (error, result) => {
    if(error){
      res.status(500).send('An error occurred while creating the item')
    }
    else{
      res.status(201).send('Item added successfully.');
    }
  }
});

/*
 
  pool.query('INSERT INTO items (name, description, price) VALUES ($1, $2, $3)', [name, description, price], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred while creating the item');
    } else {
      res.status(201).send('Item created successfully');
    }
  });
});
*/

module.exports = itemsRouter;
