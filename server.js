const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-node');
const cors = require('cors');
const knex = require('knex');


const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'VTMNKCMT2real',
    database : 'face_reco_db'
  }
});


const app = express();
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json(database.users)
})


// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });



app.post('/signin', (req, res) => {
	
})


app.get('/profile/:id', (req, res) =>{
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
})

app.put('/image', (req, res) =>{
	const {id} = req.body
	db('users')
	  .where('id', '=', id)
	  .increment('entries', 1)
	  .then(entries => {
	  	res.json(entries)
	  })
	  .catch(err => {res.status(400).json('Error getting entries')})
})

app.post('/register', (req, res) =>{
	const {name, email, password} = req.body
	db.transaction(trx => {
		trx.insert({
			email: email,
			hash: password
		}).into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				name: loginEmail[0],
				email: email,
				joined: new Date()
			}).then(user => res.json(user[0]))
				.catch(err => res.json('Unable to register'));
		})
		.then(trx.commit)
		.catch(err => res.json('Error registering'))
	})
})


app.listen(3000, ()=>{
	console.log('Ahoy! Do code!')
})