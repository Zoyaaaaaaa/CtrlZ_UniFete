const mongoose = require("mongoose");

const sampleCommittees = require("./data");

const sampleEvents = [
  {
    committee_id: sampleCommittees[0]._id,
    name: "Annual Charity Gala",
    description: "The Annual Charity Gala is a prestigious event aimed at raising funds for local charities through a series of captivating activities and experiences. Join us for an unforgettable evening filled with live performances, silent auctions, and gourmet dining, all for a noble cause.",
    date: new Date("2024-03-15"),
    approval_status: "Pending",
    occupancy: 100,
    roomtype: "Conference",
    image: "https://www.mastersofevents.com/img/middle-event-min.jpg"
  },
  {
    committee_id: sampleCommittees[0]._id,
    name: "Career Symposium",
    description: "The Career Symposium is an exclusive event designed to connect students with leading industry professionals and potential employers. Gain insights into various career paths, attend informative workshops, and network with recruiters to explore job opportunities.",
    date: new Date("2024-04-20"),
    approval_status: "Approved",
    occupancy: 200,
    roomtype: "Auditorium",
    image: "https://www.mastersofevents.com/img/middle-event-min.jpg"
  },
  {
    committee_id: sampleCommittees[1]._id,
    name: "Intercollegiate Sports Tournament",
    description: "Join us for the Intercollegiate Sports Tournament, where students from different institutions come together to compete in a variety of sports. Experience the thrill of victory and the camaraderie of sportsmanship as teams battle it out for glory.",
    date: new Date("2024-05-10"),
    approval_status: "Pending",
    occupancy: 300,
    roomtype: "Labs",
    image: "https://www.mastersofevents.com/img/middle-event-min.jpg"
  },
  {
    committee_id: sampleCommittees[1]._id,
    name: "Tech Innovation Summit",
    description: "The Tech Innovation Summit is a groundbreaking event that showcases the latest technological advancements and disruptive innovations. Immerse yourself in the world of emerging technologies, attend thought-provoking sessions, and witness groundbreaking demos that are shaping the future.",
    date: new Date("2024-06-25"),
    approval_status: "Approved",
    occupancy: 150,
    roomtype: "Other",
    image: "https://www.mastersofevents.com/img/middle-event-min.jpg"
  },
  {
    committee_id: sampleCommittees[2]._id,
    name: "Advanced Data Science Workshop",
    description: "The Advanced Data Science Workshop is an intensive program designed for data enthusiasts seeking to deepen their understanding of data science concepts and techniques. Through hands-on exercises and real-world case studies, participants will gain practical insights into data analysis, machine learning, and predictive modeling.",
    date: new Date("2024-07-15"),
    approval_status: "Pending",
    occupancy: 50,
    roomtype: "Other",
    image: "https://www.mastersofevents.com/img/middle-event-min.jpg"
  },
  {
    committee_id: sampleCommittees[2]._id,
    name: "Innovate-athon: A Hackathon Event",
    description: "Innovate-athon is not just a hackathon; it's a platform for innovation and collaboration. Join us as we bring together the brightest minds to solve real-world challenges using technology. Whether you're a developer, designer, or entrepreneur, this is your chance to make a difference and create something extraordinary.",
    date: new Date("2024-08-20"),
    approval_status: "Approved",
    occupancy: 100,
    roomtype: "Auditorium",
    image: "https://www.mastersofevents.com/img/middle-event-min.jpg"
  }
];

  module.exports = { data: sampleEvents};
