const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostsSchema = new Schema({
  date: Date,
  content: String,
  author: {
    type: ObjectId,
    ref: 'users',
  },
}, {
  timestamps: true,
});

mongoose.model('posts', PostsSchema);

const PostsModel = mongoose.model('posts');

module.exports = PostsModel;
