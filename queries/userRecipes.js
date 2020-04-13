const handleUserRecipes = (request, response, db) => {
	const { user_id } = request.body
	return db.select('title', 'img_url', 'calories', 'url', 'ingredients').from('recipes')
		.where('user_id', '=', user_id)
		.orderBy('title')
		.then(results => {
			console.log(`Recipes of User #${user_id} : ${results}`)
			response.status(200).json(results)
		})
		.catch(err => response.status(400).json('Unable to get the recipes from database'))
}

module.exports = {
  handleUserRecipes
}

