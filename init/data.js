// const sampleCommittees = [
//   { 
//     name: 'CODECELL', 
//     type: 'technical', 
//     description: 'CODECELL is a technical committee dedicated to fostering a passion for coding and technology among students. Through interactive workshops, coding competitions, and hands-on projects, it aims to equip students with practical skills and knowledge in software development, web development, and other technical domains. CODECELL also serves as a platform for networking and collaboration among aspiring programmers, providing opportunities to explore emerging technologies and engage with industry experts.' 
//   },
//   { 
//     name: 'IETE', 
//     type: 'cultural', 
//     description: 'IETE is a cultural committee that celebrates diversity and creativity through a wide range of cultural events and activities. From traditional dance performances and music concerts to art exhibitions and culinary festivals, IETE offers a vibrant and inclusive environment where students can express their cultural identities and showcase their talents. Through its events, IETE aims to promote cultural exchange, foster intercultural understanding, and create memorable experiences that enrich the campus community.' 
//   },
//   { 
//     name: 'CSI', 
//     type: 'technical', 
//     description: 'CSI is a technical committee committed to promoting computer science education and fostering a culture of innovation and collaboration. With a focus on hands-on learning and skill development, CSI organizes coding competitions, technical workshops, and seminars on emerging technologies. It also provides opportunities for networking and professional development through industry partnerships and guest lectures. By empowering students with the latest tools and knowledge in computer science, CSI aims to inspire creativity, drive innovation, and prepare future leaders in technology.' 
//   },
//   { 
//     name: 'CODESTORM', 
//     type: 'cultural', 
//     description: 'CODESTORM is a cultural committee that seeks to ignite creativity and imagination through a diverse array of cultural activities and events. From theatrical performances and literary evenings to film screenings and art installations, CODESTORM offers a platform for students to express themselves creatively and explore different forms of artistic expression. With a focus on promoting cultural exchange and fostering a sense of community, CODESTORM aims to inspire, entertain, and enrich the cultural fabric of the campus.' 
//   },
//   { 
//     name: 'CODETANTRA', 
//     type: 'technical', 
//     description: 'CODETANTRA is a technical committee dedicated to exploring the limitless possibilities of technology and innovation. Through hackathons, coding marathons, and tech-talk sessions, CODETANTRA provides a platform for students to learn, experiment, and collaborate on cutting-edge projects. It also fosters a culture of entrepreneurship and problem-solving, encouraging students to think critically and creatively to address real-world challenges. By fostering a passion for technology and innovation, CODETANTRA aims to empower students to become leaders in the digital age.' 
//   }
// ];

// module.exports = { data: sampleCommittees };

  
const mongoose = require("mongoose");

const sampleCommittees = [
  { 
    _id:new mongoose.Types.ObjectId("65d9af4fcd04c37880c941de"),
    name: 'CODECELL', 
    type: 'technical', 
    description: 'CODECELL is a technical committee dedicated to fostering a passion for coding and technology among students. Through interactive workshops, coding competitions, and hands-on projects, it aims to equip students with practical skills and knowledge in software development, web development, and other technical domains. CODECELL also serves as a platform for networking and collaboration among aspiring programmers, providing opportunities to explore emerging technologies and engage with industry experts.' 
  },
  { 
    _id: new mongoose.Types.ObjectId("65d9af4fcd04c37880c941df"),
    name: 'IETE', 
    type: 'cultural', 
    description: 'IETE is a cultural committee that celebrates diversity and creativity through a wide range of cultural events and activities. From traditional dance performances and music concerts to art exhibitions and culinary festivals, IETE offers a vibrant and inclusive environment where students can express their cultural identities and showcase their talents. Through its events, IETE aims to promote cultural exchange, foster intercultural understanding, and create memorable experiences that enrich the campus community.' 
  },
  { 
    _id:new  mongoose.Types.ObjectId("65d9af4fcd04c37880c941e0"),
    name: 'CSI', 
    type: 'technical', 
    description: 'CSI is a technical committee committed to promoting computer science education and fostering a culture of innovation and collaboration. With a focus on hands-on learning and skill development, CSI organizes coding competitions, technical workshops, and seminars on emerging technologies. It also provides opportunities for networking and professional development through industry partnerships and guest lectures. By empowering students with the latest tools and knowledge in computer science, CSI aims to inspire creativity, drive innovation, and prepare future leaders in technology.' 
  },
  // Add more committees as needed
];

module.exports = sampleCommittees;
