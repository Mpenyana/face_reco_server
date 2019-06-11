

const profileHandler = (req, res, db) =>{
	const {id} = req.params
	db.select('*').from('users').where({id})
	.then(user => {
		if(user.length > 0){
			res.json(user[0])
		}
		else{
			res.status(404).json('User profile not found')
		}
	})
	.catch(err => console.log('Error fetching user profile'))
}


module.exports = {
	profileHandler
}