const express = require('express');

const router = express.Router();

const api = require('../../api/users');
const isUndefined = require('lodash').isUndefined;
const ObjectId = require('mongoose').Types.ObjectId;

// router.post('/:userId/:friendId', (req, res, next) => {
//   const userId = req.params.userId;
//   const friendId = req.params.friendId;

//   api.addFriend(userId, friendId)
//     .then(() => {
//       return res.sendStatus(200).end();
//     })
//     .catch((err) => {
//       return res.status(500).send(err).end();
//     })
// });

/* eslint-disable consistent-return*/
router.get('/search', (req, res) => {
  const query = req.query.q;
  if (isUndefined(query)) {
    return res.status(400).end();
  }
  const ultimoId = req.query.l;
  api.search(query, ultimoId)
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err).end());
});
/* eslint-enable */

/* eslint-disable consistent-return*/
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).end();
  }
  api.get(userId)
    .then(user => res.json(user))
    .catch(err => res.status(500).send(err).end());
});
/* eslint-enable */

/* eslint-disable consistent-return*/
router.get('/:userId/friends', (req, res) => {
  const userId = req.params.userId;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).end();
  }
  api.friends(userId)
    .then(friends => res.json(friends))
    .catch(err => res.status(500).send(err).end());
});
/* eslint-enable */

router.get('/:userId/timeline/:skip/:limit', (req, res) => {
  api.timeline(req.params.userId, req.params.skip, req.params.limit)
    .then(timeline => {
      res.setHeader('count', timeline.length);
      // res.sendStatus(200);
      return res.json(timeline);
    })
    .catch(err => {
      console.error(err);
      return res.send(err).status(500).end();
    });
});

// router.post('/categorias', (req, res, next) => {
//   api.list()
//     .then(users => {
//       let total = users.length;
//       const config = {
//         exceptional: {
//           count: parseInt(total * 0.01, 10),
//           min: parseInt(parseInt(total * 0.45, 10), 10),
//           max: parseInt(parseInt(total * 0.50, 10), 10)
//         },
//         large: {
//           count: parseInt(total * 0.05, 10),
//           min: parseInt(parseInt(total * 0.35, 10), 10),
//           max: parseInt(parseInt(total * 0.40, 10), 10)
//         },
//         power: {
//           count: parseInt(total * 0.14, 10),
//           min: parseInt(parseInt(total * 0.10, 10), 10),
//           max: parseInt(parseInt(total * 0.25, 10), 10)
//         },
//         avg: {
//           count: parseInt(total * 0.70, 10),
//           min: parseInt(parseInt(total * 0.05, 10), 10),
//           max: parseInt(parseInt(total * 0.10, 10), 10)
//         },
//         low: {
//           count: parseInt(total * 0.10, 10),
//           min: parseInt(parseInt(total * 0.01, 10), 10),
//           max: parseInt(parseInt(total * 0.03, 10), 10)
//         }
//       }

//       let i = 0;
//       const updates = [];
//       for (var key in config) {
//         let {
//             count,
//             min,
//             max
//           } = config[key];
//         for (let x = 0; x < count; x++) {
//           const user = users[i];
//           updates.push(api.updateCategory(user._id, key));
//           i++;
//         }
//       }
//       return Promise.all(updates);
//     })
//     .then(() => {
//       return res.sendStatus(200).end();
//     })
//     .catch(err => {
//       console.error(err);
//       return res.status(500).send(err).end();
//     })
// })

// router.post('/', (req, res, next) => {
//   // postclient('57a763391348fd30825bbe58', 1, 1);
//   // return res.sendStatus(200);
//   const key = req.params.key;
//   api.list()
//     .then((users) => {
//       let total = users.length;

//       const config = {
//         exceptional: {
//           count: parseInt(total * 0.01, 10),
//           min: parseInt(parseInt(total * 0.45, 10), 10),
//           max: parseInt(parseInt(total * 0.50, 10), 10)
//         },
//         large: {
//           count: parseInt(total * 0.05, 10),
//           min: parseInt(parseInt(total * 0.35, 10), 10),
//           max: parseInt(parseInt(total * 0.40, 10), 10)
//         },
//         power: {
//           count: parseInt(total * 0.14, 10),
//           min: parseInt(parseInt(total * 0.10, 10), 10),
//           max: parseInt(parseInt(total * 0.25, 10), 10)
//         },
//         avg: {
//           count: parseInt(total * 0.70, 10),
//           min: parseInt(parseInt(total * 0.05, 10), 10),
//           max: parseInt(parseInt(total * 0.10, 10), 10)
//         },
//         low: {
//           count: parseInt(total * 0.10, 10),
//           min: parseInt(parseInt(total * 0.01, 10), 10),
//           max: parseInt(parseInt(total * 0.03, 10), 10)
//         }
//       }

//       const ps = [];
//       for (let i = 0; i < total; i++) {
//         const user = users[i];
//         let {
//             count,
//             min,
//             max
//           } = config[user.category];
//         ps.push(api.addFriends(user._id, Math.floor(Math.random() * max) + min))
//       }

//       return Promise.all(ps);
//     })
//     .then(() => {
//       return res.sendStatus(200);
//     })
//     .catch(err => {
//       console.error(err);
//       return res.status(500).send(err).end();
//     })
// });

// function pseries(list) {
//   const p = Promise.resolve();
//   return list.reduce((pacc, fn) => {
//     return pacc = pacc.then(fn)
//   }, p);
// }

// function factory(p) {
//   return p;
// }

module.exports = router;
