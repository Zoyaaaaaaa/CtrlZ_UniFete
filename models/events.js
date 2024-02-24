const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  committee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Committee',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },

  approval_status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;