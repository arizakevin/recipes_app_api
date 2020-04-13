const saveUserRecipes = (request, response, db) => {
	const { user_id, title, img_url, calories, ingredients, url } = request.body
	console.log(request.body.ingredients)
	
	db.select('*').from('recipes')
		.where('user_id', '=', user_id)
		.andWhere('title', '=', title)
		.then(userRecipesList => {
			if (userRecipesList.length === 0) {
				return db('recipes')
					.returning('*')
					.insert({
						user_id: user_id,
						title: title,
						img_url: img_url,
						calories: calories,
						ingredients: ingredients,
						url: url
					})
					.then(recipe => {
						console.log('Recipe saved successfully: ', recipe)
						response.status(200).json('saved')
					})
					.catch(err => response.status(400).json('Unable to save the recipe'))
			} else {
				return db('recipes')
					.returning('*')
					.del()
					.then(resp => {
						console.log('Recipe already exists. Deleting the recipe...')
						response.status(200).json('deleted')
					})
					.catch(err => response.status(400).json('Unable to delete the recipe'))
			}
		})	
		.catch(err => response.status(400).json('Unable to connect to database'))
}

module.exports = {
  saveUserRecipes
}