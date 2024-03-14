const cron = require('node-cron');
const Task = require('../models/Task');

// cron job schedule (run every day at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    // Get tasks with due dates
    const tasks = await Task.find({ due_date: { $lte: new Date() } });

    // Loop through tasks and update priorities based on due dates
    for (const task of tasks) {
      let priority = calculatePriority(task.due_date);
      task.priority = priority;
      await task.save();
    }

    console.log('Priority update cron job completed.');
  } catch (error) {
    console.error('Error updating priorities:', error);
  }
});

// Function to calculate priority based on due date
function calculatePriority(dueDate) {
  // Calculate the difference in days between today and the due date
  const timeDifference = dueDate.getTime() - new Date().getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Determine priority based on the rules mentioned in the description
  if (daysDifference === 0) {
    return 0; // Due date is today
  } else if (daysDifference <= 2) {
    return 1; // Due date is between tomorrow and day after tomorrow
  } else if (daysDifference <= 4) {
    return 2; // Due date is 3-4 days from today
  } else {
    return 3; // Due date is 5 or more days from today
  }
}
