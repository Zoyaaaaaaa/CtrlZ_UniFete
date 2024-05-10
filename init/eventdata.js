// const mongoose=require("mongoose");
// const sampleEvents = [
//     {
//       committee_id: mongoose.Types.ObjectId("65d9af4fcd04c37880c941de"),
//       name: "Annual Charity Fundraiser",
//       description: "Raise funds for local charities through various activities.",
//       date: new Date("2024-03-15"),
//       approval_status: "Pending"
//     },
//     {
//       committee_id: mongoose.Types.ObjectId("65d9af4fcd04c37880c941de"),
//       name: "Career Fair",
//       description: "Connect students with potential employers for job opportunities.",
//       date: new Date("2024-04-20"),
//       approval_status: "Approved"
//     },
//     {
//       committee_id: mongoose.Types.ObjectId("65d9af4fcd04c37880c941df"),
//       name: "Annual Sports Day",
//       description: "Organize various sports competitions for students.",
//       date: new Date("2024-05-10"),
//       approval_status: "Pending"
//     },
//     {
//       committee_id: mongoose.Types.ObjectId("65d9af4fcd04c37880c941df"),
//       name: "Tech Expo",
//       description: "Showcase the latest technological innovations and projects.",
//       date: new Date("2024-06-25"),
//       approval_status: "Approved"
//     },
//     // {
//     //   committee_id: "65d9af4fcd04c37880c941de",
//     //   name: "Guest Lecture Series",
//     //   description: "Invite industry experts to deliver lectures on trending topics.",
//     //   date: new Date("2024-07-15"),
//     //   approval_status: "Pending"
//     // },{
//     //     committee_id: "65d9af4fcd04c37880c941e",
//     //     name: "AI/ML Seminar",
//     //     description: "Invite industry experts to deliver lectures on the topic which is the future of world and is there to transform the tach industry i.e AI/ML",
//     //     date: new Date("2024-07-15"),
//     //     approval_status: "Pending"
//     // }
//   ];
  

  
 

const mongoose = require("mongoose");
const sampleCommittees = require("./data");

const sampleEvents = [
    {
      committee_id: sampleCommittees[0]._id,
      name: "Annual Charity Fundraiser",
      description: "Raise funds for local charities through various activities.",
      date: new Date("2024-03-15"),
      approval_status: "Pending",
      occupancy: 100, // Example occupancy value
      roomtype: "Conference" // Example roomtype value
    },
    {
      committee_id: sampleCommittees[0]._id,
      name: "Career Fair",
      description: "Connect students with potential employers for job opportunities.",
      date: new Date("2024-04-20"),
      approval_status: "Approved",
      occupancy: 200, // Example occupancy value
      roomtype: "Auditorium" // Example roomtype value
    },
    {
      committee_id: sampleCommittees[1]._id,
      name: "Annual Sports Day",
      description: "Organize various sports competitions for students.",
      date: new Date("2024-05-10"),
      approval_status: "Pending",
      occupancy: 300, // Example occupancy value
      roomtype: "Labs" // Example roomtype value
    },
    {
      committee_id: sampleCommittees[1]._id,
      name: "Tech Expo",
      description: "Showcase the latest technological innovations and projects.",
      date: new Date("2024-06-25"),
      approval_status: "Approved",
      occupancy: 150, // Example occupancy value
      roomtype: "Other" // Example roomtype value
    },
    // Add more events as needed
];



  module.exports = { data: sampleEvents};
