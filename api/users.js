const User = require('../models').User;
const Post = require('../models').Post;
const Promise = require('bluebird');
const _ = require('lodash');

function _addFriendship(user, friendsName) {
  return User.find({
      name: {
        $eq: friendsName
      }
    }).exec()
    .then((friend) => {
      user.friends.push(friend);
      return user.save()
    });
};

const sample = (count, userId) => {
    return User.aggregate(
        {
          $match: {
            _id: {
              $ne: userId
            }
          }
        },
        {
          $sample:{
            size: count
          }
        },
        {
          $sort: {
            _id: 1
          }
        },
        {
          $project: {
            _id: '$_id'
          }
        }
      );
  };

const api = {
  list: () => {
    return User.find({}).lean().exec();
  },
  exceptional: () => {
    return User.find({category: 'exceptional'}).lean().exec();
  },
  large: () => {
    return User.find({category: 'large'}).lean().exec();
  },
  power: () => {
    return User.find({category: 'power'}).lean().exec();
  },
  avg: () => {
    return User.find({category: 'avg'}).lean().exec();
  },
  low: () => {
    return User.find({category: 'low'}).lean().exec();
  },
  updateCategory: (userId, category) => {
    return User.findOneAndUpdate({_id : userId}, { category }).exec();
  },
  get: (userId) => {
    return User.findOne({
      _id: userId
    }).lean().exec();
  },
  getByName: (userName) => {
    return User.findOne({
      name: {
        $eq: userName
      }
    }).lean().exec();
  },
  add: (user) => {
    const newUser = new User(user);
    console.log(`adding user ${newUser.name}`)
    return newUser.save();
  },
  addAll: (users, callback) => {
    return User.insertMany(users, callback);
  },
  update: (user) => {
    return User.findOneAndUpdate(user._id, user).exec();
  },
  delete: (user) => {
    return User.findOneAndDelete(user._id).exec();
  },
  friends: (user) => {
    return User.find(user)
  },
  addFriendships: (objUser, friendsNames) => {
    return Promise.all([
        User.findOne(objUser._id).exec(),
        User.find({
          name: {
            $in: friendsNames
          }
        }).exec()
      ])
      .then((values) => {
        values[0].friends.push(...values[1]);
        return values[0].save()
      })
  },
  addFriend: (userId, friendId) => {
    return Promise.all([
        User.findById(userId).exec(),
        User.findById(friendId).exec()
      ])
      .then((values) => {
        if (!values[0])
          return new Promise((resolve, reject) => {
            reject('Usuario não encontrado')
          })
        if (!values[1])
          return new Promise((resolve, reject) => {
            reject('Amigo não encontrado')
          })
        values[0].friends.push(values[1]);
        return values[0].save();
      })
  },
  addFriends: (userId, count) => {
    return sample(count, userId)
      .then(friends => {
        return User.findOneAndUpdate({_id: userId}, { friends })
          .exec();
      });
  },
  timeline: (userId, skip, limit) => {
    if ('undefined' === typeof(skip))
      skip = 0

    if ('undefined' === typeof(limit))
      limit = 20

    if ('string' === typeof(skip))
      skip = parseInt(skip, 10)

    if ('string' === typeof(limit))
          limit = parseInt(limit, 10)

    return User.findById(userId).lean()
      .then(user => {
        const q = Post.find({
          'author': {
            $in: user.friends
          }
        }).skip(skip);
        if (limit >= 0)
          q.limit(limit);
        return q.lean().exec();
      })
  }
}

api.sample = sample;

module.exports = api;