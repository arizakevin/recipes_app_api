const signin = (request, response, pool, bcrypt) => {
	const { email, password } = request.body
	if (!email || !password ) {
		return response.status(400).json('Incorrect form submission')
	}

	pool.query('SELECT email, hash FROM login WHERE email = $1', [email], (error, results) => {
		if (error) {
			response.status(400).json('Wrong credentials')
		}
		const isValid = bcrypt.compareSync(password, results.rows[0].hash)
		if (isValid) {
			pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
				if (error) {
					response.status(400).json('Unable to get user')
				}
				console.log(results.rows[0])
				response.json(results.rows[0])
			})
		} else {
			response.status(400).json('Wrong credentials')
		}
	})
}

module.exports = {
  signin
}