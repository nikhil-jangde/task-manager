const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const twilio = require('twilio');

// Initialize Twilio client
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = twilio(accountSid, authToken);

// Define cron job schedule (e.g., run every day at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    // Get tasks with due dates
    const tasks = await Task.find({ due_date: { $lte: new Date() } }).populate('user');

    // Group tasks by user ID
    const tasksByUser = {};
    tasks.forEach(task => {
      const userId = task.user._id.toString();
      if (!tasksByUser[userId]) {
        tasksByUser[userId] = [];
      }
      tasksByUser[userId].push(task);
    });

    // Get users and sort them by priority
    const users = await User.find().sort('priority');

    // Iterate through users and initiate calls based on priority
    for (const user of users) {
      const userId = user._id.toString();
      if (tasksByUser[userId]) {
        const tasks = tasksByUser[userId];
        const callInitiated = await makeCall(user.phone_number, tasks);
        if (callInitiated) {
          console.log(`Call initiated for user ${userId} with priority ${user.priority}`);
          // If call is initiated, break the loop and proceed to next user
          break;
        }
      }
    }

    console.log('Twilio calling cron job completed.');
  } catch (error) {
    console.error('Error initiating calls:', error);
  }
});

// Function to initiate call using Twilio
async function makeCall(phoneNumber, tasks) {
  try {
    // Code to initiate call using Twilio
    // Replace 'from' with your Twilio phone number
    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: phoneNumber,
      from: 'your_twilio_phone_number'
    });
    
    return true; // Call successfully initiated
  } catch (error) {
    console.error('Error initiating call:', error);
    return false; // Call initiation failed
  }
}
