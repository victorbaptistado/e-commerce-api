var express = require('express');
var usersRouter = express.Router();
const db = require('../db')


usersRouter.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
});

usersRouter.get('/', (req, res, next) => {
  db.query('SELECT * FROM users')
    .then(result => res.json(result.rows))
    .catch(err => console.error("err"));
});

usersRouter.post('/register', (req, res) => {
  const { first_name, last_name, email, phone, password, street, city, state, postcode, country } = req.body;

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

usersRouter.put('/:id', (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, phone, password, email, street, city, state, postcode, country } = req.body;
  const updates = [];
  const params = [];

  if (first_name) {
    updates.push('first_name = $1');
    params.push(first_name);
  }
  if (last_name) {
    updates.push('last_name = $2');
    params.push(last_name);
  }
  if (phone) {
    updates.push('phone = $3');
    params.push(phone);
  }
  if (password) {
    updates.push('password = $4');
    params.push(password);
  }
  if (email) {
    updates.push('email = $5');
    params.push(email);
  }
  if (street) {
    updates.push('street = $6');
    params.push(street);
  }
  if (city) {
    updates.push('city = $7');
    params.push(city);
  }
  if (state) {
    updates.push('state = $8');
    params.push(state);
  }
  if (postcode) {
    updates.push('postcode = $9');
    params.push(postcode);
  }
  if (country) {
    updates.push('country = $10');
    params.push(country);
  }

  if (updates.length === 0) {
    return res.status(400).send('No updates provided');
  }

  params.push(id);

  db.query(`UPDATE users u SET ${updates.join(',')} FROM addresses a WHERE u.id = $${params.length} AND a.id = u.addresses_id`, params)
  .then(() => {
    res.status(200).send(`Successfully updated user ${id}.`)
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error on updating users.');
  })
});

usersRouter.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM users WHERE id = $1', [id])
  .then(() => {
    res.status(204).send(`User ${id} deleted.`);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error on deleting user.');
  })
});


module.exports = usersRouter;





