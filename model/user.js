const mongoose = require('mongoose');

//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    // required: true
  },
  last_name: {
    type: String,
    // required: true
  },

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;