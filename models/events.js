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
  description: {
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
  occupancy: {
    type: Number,
    required: true
  },
  roomtype: {
    type: String,
    enum: ['Conference', 'Auditorium', 'Labs', 'Other'],
    default: 'Other'
  },
  image: {
    // type: String, // Store the file path here
    url:String,
    filename:String, 
    
  },
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
