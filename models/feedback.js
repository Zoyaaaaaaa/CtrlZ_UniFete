const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  venueRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  eventExperienceRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  description: {
    type: String,
    required: true
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
