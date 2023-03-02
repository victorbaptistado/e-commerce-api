var express = require('express');
var usersRouter = express.Router();
const db = require('../db')

/*
usersRouter.post('/register', (req, res) => {
  const { first_name, email, password } = req.body;
  const query = "WITH new_address AS (INSERT INTO addresses (street, city, state, postcode, country) VALUES ('24 Main St', 'Somewhere', 'Manchester', 'SE12142', 'USA') RETURNING id) INSERT INTO users (first_name, last_name, phone, addresses_id, password, email) VALUES ('liam', 'Gallagher', 71417157, (SELECT id FROM new_address), 1234, 'gallagher@gmail.com');"
  const values = [street, city, state, postcode, country, first_name, last_name, phone, addresses_id, password, email];
  */

  
usersRouter.post('/register', (req, res) => {
  const { 
          first_name, 
          last_name, 
          email,
          phone,
          password, 
          street, 
          city, 
          state, 
          postcode, 
          country 
        } = req.body;

  db.query('INSERT INTO addresses (street, city, state, postcode, country) VALUES ($1, $2, $3, $4, $5) RETURNING id', [street, city, state, postcode, country])
    .then(result => {
      const addressId = result.rows[0].id;
      return db.query('INSERT INTO users (first_name, last_name, email, phone, password, addresses_id) VALUES ($1, $2, $3, $4, $5, $6)', [first_name, last_name, email, phone, password, addressId]);
    })
    .then(() => {
      res.status(201).send('User registered successfully');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('An error occurred while registering user');
    });
});

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
    .then(result => res.json(result.rows))
    .catch(err => console.error("err"));
});

module.exports = usersRouter;





