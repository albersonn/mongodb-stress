const Promise = require('bluebird');
const UserApi = require('../api/users');
const _ = require('lodash');

function adicionarAmizades() {
	return new Promise((resolve, reject) => {
		// friendship
		UserApi.list()
			.then((users) => {
				const total = users.length;

				const capacity = 1;

				const config = {
					exceptional: {
						count: parseInt(total * 0.01, 10),
						friendMin: parseInt(parseInt(total * 0.45, 10) * capacity, 10),
						friendMax: parseInt(parseInt(total * 0.50, 10) * capacity, 10)
					},
					large: {
						count: parseInt(total * 0.05, 10),
						friendMin: parseInt(parseInt(total * 0.35, 10) * capacity, 10),
						friendMax: parseInt(parseInt(total * 0.40, 10) * capacity, 10)
					},
					power: {
						count: parseInt(total * 0.14, 10),
						friendMin: parseInt(parseInt(total * 0.10, 10) * capacity, 10),
						friendMax: parseInt(parseInt(total * 0.25, 10) * capacity, 10)
					},
					avg: {
						count: parseInt(total * 0.70, 10),
						friendMin: parseInt(parseInt(total * 0.05, 10) * capacity, 10),
						friendMax: parseInt(parseInt(total * 0.10, 10) * capacity, 10)
					},
					low: {
						count: parseInt(total * 0.10, 10),
						friendMin: parseInt(parseInt(total * 0.01, 10) * capacity, 10),
						friendMax: parseInt(parseInt(total * 0.03, 10) * capacity, 10)
					}
				}

				const friendships = [];

				let i = 0;
				for (var key in config) {
					let x = 0;

					const currentConfig = config[key];
					const friendMin = currentConfig.friendMin;
					const friendMax = currentConfig.friendMax;
					const configCount = currentConfig.count;

					console.log('calculating friendship for group ' + key);
					console.log(`total users in this group: ${configCount}`);
					console.log(`min friends: ${friendMin}`)
					console.log(`max friends: ${friendMax}`)

					while (x < configCount) {
						console.log(`adding friendship for user ${x + 1} of ${configCount}; user ${users[i].name}`);
						addFriends(users[i], config[key].friendMin, config[key].friendMax, total);
						x++;
						i++;
					}
				}
				resolve();
			})
		})
}

function addFriends(user, qtyMin, qtyMax, qtyUsers) {
	const userName = user.name;
	const friendCount = Math.floor(Math.random() * qtyMax) + qtyMin;

	for(let i = 0; i < friendCount; i ++) {
		let rnd = Math.floor(Math.random() * qtyUsers) + 1
		while (`user ${rnd}` === userName) {
			rnd = Math.floor(Math.random() * qtyUsers) + 1
		}
		UserApi.addFriendship(user, `user ${rnd}`)
			.then(() => {
				console.log('Amizades adicionadas ao usuario ' + userName)
			})
			.catch(() => {
				console.error('Erro ao adicionar amizades do usuario ' + userName)
			})
	}
}

function generateUsers(start, count) {
	const usersObjs = [];
	for (let i = start; i < count; i++) {
		const user = {
			name: `user ${i + 1}`
		};
		usersObjs.push(user);
	}
	return usersObjs;
}

const controller = {
	addUsers: () => new Promise((resolve, reject) => {
	// insert users
	UserApi.addAll(generateUsers(0, 10000))
		.then(() => resolve())
		.catch(err => {
			reject(err);
		});
	}),
	matchFriends: () => adicionarAmizades()
}

module.exports = controller