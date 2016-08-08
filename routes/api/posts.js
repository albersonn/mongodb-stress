const Promise = require('bluebird');
const loremIpsum = require('lorem-ipsum');

const express = require('express');
const router = express.Router();

const postsApi = require('../../api/posts');
const usersApi = require('../../api/users');

router.post('/new', (req, res, next) => {
	postsApi.add('57a7633b1348fd30825be1ba', loremIpsum())
		.then(post => {
			return res.json(post);
		})
		.catch(err => {
			console.error(err);
			return res.send(err).status(500).end();
		})
})

router.post('/populate/exceptional', (req, res, next) => {
	usersApi.exceptional()
		.then(users => {
			const ps = [];
			for(let i = 0; i < users.length; i++) {
				for(let x = 0; x < 100; x++) {
					ps.push(postsApi.add(users[i], loremIpsum()));
				}
			}
			return Promise.all(ps)
		})
		.then(() => {
			return res.sendStatus(200).end();
		})
		.catch(err => {
			console.error(err);
			return res.send(err).status(500).end();
		})
})

router.post('/populate', (req, res, next) => {
	usersApi.list()
		.then(users => {
			const ps = [];
			for(let i = 0; i < users.length; i++) {
				for(let x = 0; x < 10; x++) {
					ps.push(postsApi.add(users[i], loremIpsum()));
				}
			}
			return Promise.all(ps)
		})
		.then(() => {
			return res.sendStatus(200).end();
		})
		.catch(err => {
			console.error(err);
			return res.send(err).status(500).end();
		})
})

module.exports = router;