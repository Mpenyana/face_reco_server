const imageHandler = (req, res, db) =>{
	const {id} = req.body
	db('users')
	  .where('id', '=', id)
	  .increment('entries', 1)
	  .returning('entries')
	  .then(entries => {
	  	res.json(entries[0])
	  	console.log(entries[0])
	  })
	  .catch(err => {res.status(400).json('Error getting entries')})
}

module.exports = {
	imageHandler
}