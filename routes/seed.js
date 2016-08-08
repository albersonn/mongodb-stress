const express = require('express');
const router = express.Router();
const api = require('../api/users');
var seedController = require('../controllers/seed-controller');

router.post('/users', (req, res, next) => {
	seedController.addUsers()
		.then(() => {
			res.render('seed/success')
		})
		.catch(err => {
			res.render('error', {
		      message: 'Ocorreu um erro',
		      error: err
		    });
		})
})

router.post('/friends', (req, res, next) => {
	seedController.matchFriends()
		.then(() => {
			res.render('seed/success')
		})
		.catch(err => {
			res.render('error', {
		      message: 'Ocorreu um erro',
		      error: err
		    });
		})
})

router.get('/', (req, res, next) => {
	res.render('seed/index')
})

module.exports = router;