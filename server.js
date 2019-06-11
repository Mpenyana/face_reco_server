const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-node');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


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

// home/test route
app.get('/', (req, res) => {
	res.json(database.users)
})

// application's routes
app.post('/signin', (req, res) => { signin.signinHandler(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.registerHandler(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.profileHandler(req, res, db)});
app.put('/image', (req, res) => {image.imageHandler(req, res, db)})
app.post('APIHandler', (req, res) => {API.APIHandler(req, res)})

// setting port number
app.listen(3000, ()=>{
	console.log('Ahoy! Do code!')
})