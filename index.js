const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')

const { signin } = require('./queries/signin')
const { register } = require('./queries/register')
const { getRecipes } = require('./queries/getRecipes')
const { saveUserRecipes } = require('./queries/saveUserRecipes')
const { recipeSaved } = require('./queries/recipeSaved')
const { getUserRecipes } = require('./queries/getUserRecipes')
//const { getUsers } = require('./queries/getUsers')
//const { getUserById } = require('./queries/getUserById')
//const { updateUser } = require('./queries/updateUser')
//const { deleteUser } = require('./queries/deleteUser')

let pg = require('pg')

/*if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
}*/
 
const { Pool } = require('pg')

const connString = process.env.DATABASE_URL;



const pool = new Pool({
  client: 'pg',
  connection: {
  	connectionString : connString,
  	ssl: true
  }
});

pool
  .connect()
  .then(client => {
    console.log('connected')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))
  .then(() => pool.end())

console.log('connString: ', connString)

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json('Node.js, Express, and Postgres API')
})
app.post('/signin', (req, res) => { signin(req, res, pool, bcrypt) })
app.post('/register', (req, res) => { register(req, res, pool, bcrypt) })
app.post('/recipes', (req, res) => { getRecipes(req, res) })
app.post('/saverecipes', (req, res) => { saveUserRecipes(req, res, pool) })
app.post('/checkrecipe', (req, res) => { recipeSaved(req, res, pool) })
app.post('/userrecipes', (req, res) => { getUserRecipes(req, res, pool) })
//app.get('/users', (req, res) => { getUsers(req, res, pool) })
//app.get('/users/:id', (req, res) => { getUserById(req, res, pool) })
//app.put('/users/:id', (req, res) => { updateUser(req, res, pool) })
//app.delete('/users/:id', (req, res) => { deleteUser(req, res, pool) })

app.listen(process.env.PORT || 3000, ()=> { 
	console.log(`app is running on port ${process.env.PORT || 3000}`); 
})






/*
Replace this:

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

for this:

app.use(express.urlencoded({extended: false}));
app.use(express.json());
_________________________________________________ 
Just a heads up that in the next lecture I am 
using req.header inside of a console.log to 
retrieve the header data in a GET route. Depending
on which version of express.js you use, (a more 
recent version has changed the syntax) it now is
req.headers. req.header will only return the 
function declaration.

*/
