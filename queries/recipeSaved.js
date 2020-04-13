const checkIfRecipeExists = (request, response, db) => {
	const { user_id, title } = request.body
	db.select('*').from('recipes')
		.where('user_id', '=', user_id)
		.andWhere('title', '=', title)
		.then(userRecipesList => {
			if (userRecipesList.length === 0) {
				return response.json(false)
			} else {
				return response.json(true)
			}
		})
		.catch(err => response.status(400).json('Unable to connect to database'))
}

module.exports = {
  checkIfRecipeExists
}