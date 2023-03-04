var express = require('express');
var itemsRouter = express.Router();
const db = require('../db')


itemsRouter.get('/:itemid', (req, res, next) => {
  db.query('SELECT * FROM items WHERE id = $1', [req.params.itemid], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
});

itemsRouter.get('/', (req, res, next) => {
    db.query('SELECT * FROM items')
      .then(result => res.json(result.rows))
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

itemsRouter.put('/:itemid', (req, res) => {
  const itemId = req.params.itemid;
  const { name, description, quantity } = req.body;

  db.query( 'UPDATE items SET name=COALESCE($1, name), description=COALESCE($2, description) , quantity=COALESCE($3, quantity) WHERE id = $4 RETURNING *', [ name, description, quantity, itemId])
  .then(() => {
    res.status(200).send(`Item ${itemId} updated successfully.`)
  }).catch((err) => {
    console.log(err);
    res.status(500).send(`An error occurred while updating the item.`)
  })
})

itemsRouter.delete('/:itemid', (req, res) => {
  const itemId = req.params.itemid;

  db.query('DELETE FROM items WHERE id = $1', [itemId])
  .then(() => {
    res.status(204).send(`Item ${itemId} deleted successfully.`)
  }).catch((err) => {
    console.log(err);
    res.status(500).send(`Error on deleting item.`)
  })
})

module.exports = itemsRouter;
