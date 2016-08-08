const moment = require('moment');
const Post = require('../models').Post;

const api = {};

api.list = () => {
	return Post.find().lean().exec();
}

api.add = (author, content, date) => {
	if ('undefined' === typeof(date))
		date = moment();
	if ('null' === typeof(date))
		date = moment();

	var newPost = new Post({
		date,
		content,
		author
	});
	return newPost.save();
}

module.exports = api;