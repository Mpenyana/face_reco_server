
const signinHandler = (req, res, db, bcrypt) => {
	db.select('*').from('login')
	.where('email', '=', req.body.email)
	.then(user => {
		const isValid = bcrypt.compareSync(req.body.password, user[0].hash); // true
		if(isValid){
			return db.select('*').from('users').where('email', '=', req.body.email)
		}
		else{
			res.json('Incorrect details entered.')
		}
	})
	.then(userInfo => {
		res.json(userInfo[0])
	})
};

module.exports = {
	signinHandler
}