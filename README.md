**UniFete Event Management System**

Welcome to the UniFete Event Management System, a comprehensive platform designed to streamline event management processes for educational institutions. This README provides an overview of the system's architecture, features, and usage instructions.

**Table of Contents**

Introduction

Features

Technologies Used

Setup Instructions

**Introduction**

UniFete Event Management System is built to facilitate efficient event planning and execution within educational institutions. It caters to various user roles including students, faculty members, and committee administrators, providing tailored functionalities for each.

**Features**

**Student Dashboard**
Upcoming Events: Students can view and register for upcoming events.
Feedback System: Allows students to submit feedback on attended events.
Registration: Enables students to register for approved events.

**Committee Dashboard**
Event Management: Committees can manage events, including creation, approval, and scheduling.
Request System: Committees can submit new event requests for approval.
Venue Availability: Provides insights into venue availability for scheduling events.

**Faculty Dashboard**
Event Approval: Faculties can review and approve event requests submitted by committees.
Event Search: Faculties can search for specific events based on criteria.

**General Features**

**Authentication:** User authentication using Passport.js and local strategy.

**Session Management:** Utilizes Express session and MongoStore for session storage.

**Error Handling:** Custom error handling middleware for graceful error responses.

**Email Notifications:** Sends email notifications for event registrations and approvals using Nodemailer.

**Database Integration:** MongoDB integration for storing user, event, and feedback data.

**Responsive Design:** Frontend templates built with EJS and styled using CSS for responsiveness.

**Technologies Used**

**Backend:** Node.js, Express.js

**Database:** MongoDB

**Authentication:** Passport.js (Local Strategy)

**Template Engine:** EJS (Embedded JavaScript)

**Session Storage:** MongoDB (with connect-mongo)

**Email Service:** Nodemailer

**File Upload:** Multer

**Frontend:** HTML, CSS


Video Link:https://www.youtube.com/watch?v=LXQkMhHjCoQ
