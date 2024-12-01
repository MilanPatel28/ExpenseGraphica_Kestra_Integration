const cors = require('cors');
const express = require('express');
const connectDB = require('./db/connection');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware 
app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
    // origin: "https://expense-graphica-deployment.vercel.app", // Allow your frontend domain
    origin: `${process.env.FRONTEND_URL}`, // Allow your frontend domain
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

// Routes
app.use('/user', userRoutes);
app.use(expenseRoutes);

// Start server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));