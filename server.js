const express = require('express'); // ✅ Importing express
const bodyParser = require('body-parser'); // ✅ Importing body-parser
const cors = require('cors'); // ✅ Importing cors
const cookieParser = require('cookie-parser');
require('dotenv').config(); // ✅ Importing dotenv


// Import Routes
const authRoutes = require('./routes/auth'); // ✅ New Auth Routes
const ticketRoutes = require('./routes/ticket'); // ✅ New Ticket Routes
const hospitalRoutes = require('./routes/hospital'); // ✅ New Hospital Routes
const serviceRoutes = require('./routes/service'); // ✅ New Service Routes
const appointmentRoutes = require('./routes/appointments');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // or your frontend URL
    credentials: true,              // ✅ allow cookies
}));
  
app.use(bodyParser.json());
app.use(cookieParser()); 

// Routes
app.use('/api/auth', authRoutes); // ✅ Mounting Auth APIs
app.use('/api/ticket', ticketRoutes); // ✅ Mounting Ticket APIs
app.use('/api/hospitals', hospitalRoutes); // ✅ Mounting Hospital APIs
app.use('/api/services', serviceRoutes); // ✅ Mounting Service APIs
app.use('/api', appointmentRoutes); // ✅ Mounting Appointment APIs


app.use('/api',require('./routes/authRoutes'))

// Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// const port = process.env.PORT
// dbConnect()
// server.listen(port, () => console.log(`Server is running on port ${port}`))
