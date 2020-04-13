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
//const { getUsers } = require('./queries/getUsers')
//const { getUserById } = require('./queries/getUserById')
//const { updateUser } = require('./queries/updateUser')
//const { deleteUser } = require('./queries/deleteUser')
/*
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'me',
    password : 'password',
    database : 'recipes_app_db'
  }
});
*/
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL, 
    ssl: true,
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
});

//console.log('connString: ', connString)

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json('Node.js, Express, and Postgres API')
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

