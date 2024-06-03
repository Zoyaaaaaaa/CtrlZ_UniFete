const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Committee = require('./commitees');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role:{type:String,enum:['student','committee','faculty']},
  committeeName: {
    type: Schema.Types.ObjectId,
    ref: "Committee"
  }
});
userSchema.plugin(passportLocalMongoose); 
const User = mongoose.model('User', userSchema);

module.exports = User;