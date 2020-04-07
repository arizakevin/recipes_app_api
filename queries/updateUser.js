const updateUser = (request, response, pool) => {
	const id = parseInt(request.params.id)
	const { name, email } = request.body

	pool.query(
		'UPDATE users SET name = $1, email = $2 WHERE id = $3',
		[name, email, id], 
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`User modified with ID: ${id}`)
		}
	)
}

module.exports = {
  updateUser
}