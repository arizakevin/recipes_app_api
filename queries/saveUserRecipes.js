const saveUserRecipes = (request, response, pool) => {
	const { user_id, title, img_url, calories, ingredients, url } = request.body
	console.log(request.body.ingredients)
	pool.query('SELECT EXISTS (SELECT * FROM recipes WHERE (title = $1 AND user_id = $2))', 
		[title, user_id], (error, results) => {
		if (error) {
			throw error
		} 
		if (results.rows[0].exists) {
			console.log('Recipe already saved')
			pool.query('DELETE FROM recipes WHERE (title = $1 AND user_id = $2)',
				[title, user_id], (error, results) => {
				if (error) {
					throw error
				}
				console.log('Recipe deleted successfully')
				return response.json('deleted')
			})
		} else {
			pool.query(
				'INSERT INTO recipes (user_id, title, img_url, calories, ingredients, url ) VALUES ($1, $2, $3, $4, $5, $6)',
				 [user_id, title, img_url, calories, ingredients, url], (error, results) => {
				if (error) {
					throw error
				}
				console.log('Recipe saved successfully')
				console.log(results)
				response.status(200).json('saved')
			})
		}
	})	
}

module.exports = {
  saveUserRecipes
}