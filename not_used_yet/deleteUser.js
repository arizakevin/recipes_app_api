const deleteUser = (request, response, pool) => {
	const id = parseInt(request.params.id)

	pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`User deleted with ID: ${id}`)
	})
}

module.exports = {
  deleteUser
}