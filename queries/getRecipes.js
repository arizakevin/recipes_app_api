const fetch = require("node-fetch");
require('dotenv').config({ path: '../.env' })
const APP_ID = 'cba9219b';
const APP_KEY = '7e92be1e8a26b78e9edd5ed297fc36ab';

const getRecipes = (request, response) => {
      fetch(`https://api.edamam.com/search?q=${request.body.query}&app_id=${APP_ID}&app_key=${APP_KEY}`)  
          .then(res => res.json())
          .then(data => {
          	response.status(200).json(data.hits)
          })
          .catch(error => response.status(400).json('Unable to get the recipes'))  
}

module.exports = {
  getRecipes
}