const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex');

const { handleSignin } = require('./queries/signin')
const { handleRegister } = require('./queries/register')
const { getRecipes } = require('./queries/getRecipes')
const { saveUserRecipes } = require('./queries/saveUserRecipes')
const { checkIfRecipeExists } = require('./queries/recipeSaved')
const { handleUserRecipes } = require('./queries/userRecipes')

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, 
    ssl: true
  },
  pool: {
    min: 0,
    max: 7,
    afterCreate: function (conn, done) {
      // in this example we use pg driver's connection API
      conn.query('SET timezone="UTC";', function (err) {
        if (err) {
          // first query failed, return error and don't try to make next query
          done(err, conn);
        } else {
          // do the second query...
          conn.query('SELECT set_limit(0.01);', function (err) {
            // if err is not falsy, connection is discarded from pool
            // if connection aquire was triggered by a query the error is passed to query promise
            if (err) {
              console.log(err)
            }
            done(err, conn);
          });
        }
      });
    }
  },
  acquireConnectionTimeout: 10000
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
  db.select('*').from('users')
    .then(data => {
      console.log(data);
      res.json('Connected to database. Users: ', data)
    })
    .catch(error => res.json("Couldn't connect to database. Error:", error))
})

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.post('/recipes', (req, res) => { getRecipes(req, res) })
app.post('/saverecipes', (req, res) => { saveUserRecipes(req, res, db) })
app.post('/checkrecipe', (req, res) => { checkIfRecipeExists(req, res, db) })
app.post('/userrecipes', (req, res) => { handleUserRecipes(req, res, db) })
//app.get('/users', (req, res) => { getUsers(req, res, pool) })
//app.get('/users/:id', (req, res) => { getUserById(req, res, pool) })
//app.put('/users/:id', (req, res) => { updateUser(req, res, pool) })
//app.delete('/users/:id', (req, res) => { deleteUser(req, res, pool) })

app.listen(process.env.PORT || 3000, ()=> { 
	console.log(`app is running on port ${process.env.PORT || 3000}`); 
})

