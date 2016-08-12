const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  name: String,
  friends: [{
    type: ObjectId,
    ref: 'users',
  }],
  category: String,
}, {
  timestamps: true,
});

mongoose.model('users', UserSchema);

const UserModel = mongoose.model('users');

module.exports = UserModel;
