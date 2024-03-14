const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./src/routes/taskRoutes');
const subTaskRoutes = require('./src/routes/subTaskRoutes');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://nikhiljangde:ZTECounk3c9ODfjc@cluster0.jspkds3.mongodb.net/TaskManager')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subTaskRoutes);
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
