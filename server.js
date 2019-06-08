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

app.post('/signin', (req, res) => {
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
	  .returning('entries')
	  .then(entries => {
	  	res.json(entries)
	  	console.log(entries[0])
	  })
	  .catch(err => {res.status(400).json('Error getting entries')})
})

app.post('/register', (req, res) =>{
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
})


app.listen(3000, ()=>{
	console.log('Ahoy! Do code!')
})