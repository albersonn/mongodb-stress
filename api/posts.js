const moment = require('moment');
const Post = require('../models').Post;

const api = {};

const start = moment().add(-3, 'y').toDate();
const end = moment().toDate();

function randomDate() {
  return new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())));
}

api.list = () => Post.find().lean().exec();

api.add = (author, content, pDate) => {
  let date = pDate;
  if (typeof (date) === 'undefined') {
    date = randomDate();
  }
  if (!date) {
    date = randomDate();
  }

  const newPost = new Post({
    date,
    content,
    author,
  });
  return newPost.save();
};

module.exports = api;
