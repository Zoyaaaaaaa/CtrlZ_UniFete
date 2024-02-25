const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
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
  role:{type:String,enum:['student','committee','faculty']}
});
userSchema.plugin(passportLocalMongoose); 
const User = mongoose.model('User', userSchema);

module.exports = User;