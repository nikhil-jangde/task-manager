const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const twilioClient = require('./twilioClient'); // Assuming you have a Twilio client setup

// Define cron job schedule (e.g., run every hour)
cron.schedule('0 * * * *', async () => {
  try {
    // Get tasks that have passed their due date
    const overdueTasks = await Task.find({ due_date: { $lte: new Date() } }).populate('user');

    // Group tasks by user priority
    const tasksByPriority = {};
    for (const task of overdueTasks) {
      const priority = task.user.priority;
      if (!tasksByPriority[priority]) {
        tasksByPriority[priority] = [];
      }
      tasksByPriority[priority].push(task);
    }

    // Iterate through tasks by priority and make Twilio calls
    const priorities = Object.keys(tasksByPriority).sort((a, b) => a - b); // Sort priorities in ascending order
    for (const priority of priorities) {
      const tasks = tasksByPriority[priority];
      for (const task of tasks) {
        const user = task.user;
        // Make Twilio call here based on user information
        const callResult = await twilioClient.makeCall(user.phone_number);
        // Handle call result
        if (callResult.success) {
          console.log(`Call successful to user ${user.phone_number}`);
          // Update task status or any other actions as needed
        } else {
          console.log(`Call failed to user ${user.phone_number}: ${callResult.error}`);
          // Retry or handle failure as needed
        }
      }
    }

    console.log('Voice calling cron job completed.');
  } catch (error) {
    console.error('Error in voice calling cron job:', error);
  }
});
