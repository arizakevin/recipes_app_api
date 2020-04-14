require('dotenv').config()
const fetch = require("node-fetch");
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;

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