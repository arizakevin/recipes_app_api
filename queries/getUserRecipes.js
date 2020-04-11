const getUserRecipes = (request, response, pool) => {
	const { user_id } = request.body
	pool.query(
		"SELECT title, img_url, calories, url, ingredients FROM recipes WHERE user_id = $1 ORDER BY title ASC",
		[user_id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

module.exports = {
  getUserRecipes
}