
const registerHandler = (req, res, db, bcrypt) =>{
	const {name, email, password} = req.body
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			email: email,
			hash: hash
		}).into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			}).then(user => res.json(user[0]))
				.catch(err => res.json('Unable to register'));
		})
		.then(trx.commit)
		.catch(err => res.json('Error registering'))
	})
}


module.exports = {
	registerHandler
};