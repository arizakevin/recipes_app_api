const register = (request, response, pool, bcrypt) => {
	const { name, email, password } = request.body
	const hash = bcrypt.hashSync(password);
	if ( !name || !email || !password ) {
		return response.status(400).json('Incorrect form submission')
	}
	pool.query('SELECT EXISTS (SELECT * FROM users WHERE email = $1)', [email], (error, results) => {
		if (error) {
			throw error
		} 
		if (results.rows[0].exists) {
			response.json('Email already registered')
		} else {
			pool.query('BEGIN')
			pool.query('INSERT INTO login (hash, email) VALUES ($1, $2)', [hash, email], (error) => {
				if (error) {
					pool.query('ROLLBACK')
					throw error
				} else {
					pool.query('INSERT INTO users (email, name, joined) VALUES ($1, $2, $3)', [email, name, new Date()], (error) => {
						if (error) {
							pool.query('ROLLBACK')
							throw error
						} else {
							pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {  
								if (error) {
									pool.query('ROLLBACK')
									throw error
								}	
								pool.query('COMMIT')
								response.status(200).json(results.rows[0])
							})
						} 
					})	
				}	
			})
		}
	})
	
}

module.exports = {
  register
}