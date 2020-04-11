const recipeSaved = (request, response, pool) => {
	const { user_id, title } = request.body

	pool.query('SELECT EXISTS (SELECT * FROM recipes WHERE (title = $1 AND user_id = $2))', 
		[title, user_id], (error, results) => {
		if (error) {
			throw error
		} 
		response.json(results.rows[0].exists)
	})	
}

module.exports = {
  recipeSaved
}