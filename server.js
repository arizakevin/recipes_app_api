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

//let connectionString = process.env.DATABASE_URL;
/*
const db = knex({
  client: 'pg',
  connection: {
    connectionString: connectionString, 
    ssl: true
  }
});
*/

var db = knex({
  client: 'pg',
  connection: {
    host : 'ec2-23-20-129-146.compute-1.amazonaws.com',
    user : 'topkqmieailzpv',
    password : 'f23047b2cac545630728ce3303bfefe3f0805fdee55a199e111a2e117cf2b023',
    database : 'd9hte6sosniih'
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

const app = express()

app.use(express.json())
app.use(cors())

app.get('/db', (request, response) => {
  db.select('*').from('users')
    .then(data => {
      console.log(data);
      response.json('Connected to database. Users: ', data)
    })
    .catch(error => response.status(400).json("Couldn't connect to database. Error:", error))
})

app.get('/', (request, response) => {
  response.json('The server is working!')
})

app.post('/signin', (request, response) => { handleSignin(request, response, db, bcrypt) })
app.post('/register', (request, response) => { handleRegister(request, response, db, bcrypt) })
app.post('/recipes', (request, response) => { getRecipes(request, response) })
app.post('/saverecipes', (request, response) => { saveUserRecipes(request, response, db) })
app.post('/checkrecipe', (request, response) => { checkIfRecipeExists(request, response, db) })
app.post('/userrecipes', (request, response) => { handleUserRecipes(request, response, db) })
//app.get('/users', (req, res) => { getUsers(req, res, pool) })
//app.get('/users/:id', (req, res) => { getUserById(req, res, pool) })
//app.put('/users/:id', (req, res) => { updateUser(req, res, pool) })
//app.delete('/users/:id', (req, res) => { deleteUser(req, res, pool) })

app.listen(process.env.PORT || 3000, ()=> { 
	console.log(`app is running on port ${process.env.PORT || 3000}`); 
})

