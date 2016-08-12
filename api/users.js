/* eslint-disable no-underscore-dangle */

const User = require('../models').User;
const Post = require('../models').Post;
const ObjectId = require('mongoose').Types.ObjectId;
const Promise = require('bluebird');

const opt = {
  friends: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

const sample = (count, userId) =>
  User.aggregate({
    $match: {
      _id: {
        $ne: userId,
      },
    },
  }, {
    $sample: {
      size: count,
    },
  }, {
    $sort: {
      _id: 1,
    },
  }, {
    $project: {
      _id: '$_id',
    },
  });

const api = {
  list: () =>
    User.find({}).lean().exec(),
  exceptional: () =>
    User.find({
      category: 'exceptional',
    }).lean().exec(),
  large: () =>
    User.find({
      category: 'large',
    }).lean().exec(),
  power: () =>
    User.find({
      category: 'power',
    }).lean().exec(),
  avg: () =>
    User.find({
      category: 'avg',
    }).lean().exec(),
  low: () =>
    User.find({
      category: 'low',
    }).lean().exec(),
  updateCategory: (userId, category) =>
    User.findOneAndUpdate({
      _id: userId,
    }, {
      category,
    }).exec(),
  get: (userId) =>
    User.findOne({
      _id: userId,
    }, opt).lean().exec(),
  getByName: (userName) =>
    User.findOne({
      name: {
        $eq: userName,
      },
    }).lean().exec(),
  search: (query, ultimoId) => {
    if (typeof (ultimoId) === 'undefined') {
      return User.aggregate({
        $match: {
          name: {
            $regex: query,
          },
        },
      }, {
        $project: {
          name: '$name',
          friends: {
            $size: '$friends',
          },
          category: '$category',
        },
      }, {
        $limit: 10,
      });
    }
    return User.aggregate({
      $match: {
        name: {
          $regex: query,
        },
        _id: {
          $gt: ObjectId(ultimoId),
        },
      },
    }, {
      $project: {
        name: '$name',
        friends: {
          $size: '$friends',
        },
        category: '$category',
      },
    }, {
      $limit: 10,
    });

    // return User.find(, opt).limit(10).lean().exec();
  },
  add: (user) => {
    const newUser = new User(user);
    console.log(`adding user ${newUser.name}`);
    return newUser.save();
  },
  addAll: (users, callback) =>
    User.insertMany(users, callback),
  update: (user) =>
    User.findOneAndUpdate(user._id, user).exec(),
  delete: (user) =>
    User.findOneAndDelete(user._id).exec(),
  friends: (userId) =>
    User.findById(userId, {
      _id: 0,
      friends: 1,
    }).exec(),
  addFriendships: (objUser, friendsNames) =>
    Promise.all([
      User.findOne(objUser._id).exec(),
      User.find({
        name: {
          $in: friendsNames,
        },
      }).exec(),
    ])
    .then((values) => {
      values[0].friends.push(...values[1]);
      return values[0].save();
    }),
  addFriend: (userId, friendId) =>
    Promise.all([
      User.findById(userId).exec(),
      User.findById(friendId).exec(),
    ])
    .then((values) => {
      if (!values[0]) {
        return new Promise((resolve, reject) => {
          reject('Usuario não encontrado');
        });
      }
      if (!values[1]) {
        return new Promise((resolve, reject) => {
          reject('Amigo não encontrado');
        });
      }
      values[0].friends.push(values[1]);
      return values[0].save();
    }),
  addFriends: (userId, count) =>
    sample(count, userId)
    .then(friends =>
      User.findOneAndUpdate({
        _id: userId,
      }, {
        friends,
      })
      .exec()
    ),
  timeline: (userId, pSkip, pLimit) => {
    let skip = pSkip;
    let limit = pLimit;
    if (typeof (skip) === 'undefined') {
      skip = 0;
    }

    if (typeof (limit) === 'undefined') {
      limit = 20;
    }

    if (typeof (skip) === 'string') {
      skip = parseInt(skip, 10);
    }

    if (typeof (limit) === 'string') {
      limit = parseInt(limit, 10);
    }

    return User.findById(userId).lean()
      .then(user => {
        const q = Post.find({
          author: {
            $in: user.friends,
          },
        }).skip(skip);
        if (limit >= 0) {
          q.limit(limit);
        }
        return q.lean().exec();
      });
  },
};

api.sample = sample;

module.exports = api;
