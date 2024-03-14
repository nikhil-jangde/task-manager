const Task = require('../models/Task');
const SubTask = require('../models/SubTask');
const { verifyToken } = require('../middleware/auth');

// Function to create a task
exports.createTask = async (req, res) => {
  try {
      // Extract data from request body
      const { title, description, due_date, priority, token } = req.body;
      
      // Verify JWT token
      const user_id = await verifyToken(token);
console.log(user_id);
      // Create task
      const task = await Task.create({ title, description, due_date, priority, user_id });
      
      // Return success response
      res.status(201).json({ status: 'success', data: task });
  } catch (error) {
      // Return error response
      res.status(403).json({ status: 'error', message: error });
  }
};


// Controller function to fetch all tasks with filters and pagination
exports.getAllUsersTasks = async (req, res) => {
  try {
    // Extract filtering and pagination parameters from query string
    const { priority, due_date, page, limit } = req.query;

    // Build query object based on provided filters
    const query = {};
    if (priority) query.priority = priority;
    if (due_date) query.due_date = due_date;
    // Exclude soft deleted tasks
    query.deleted_at = null;

    // Perform database query with pagination options
    const tasks = await Task.find(query)
      .sort({ due_date: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Return tasks as response
    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    // Return error response
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.updateTask = async (req, res) => {
    try {
      // Extract task_id from request parameters
      const { task_id } = req.params;
      // Update task details
      const updatedTask = await Task.findByIdAndUpdate(task_id, req.body, { new: true });
      // Return updated task
      res.status(200).json({ status: 'success', data: updatedTask });
    } catch (error) {
      // Return error response
      res.status(400).json({ status: 'error', message: error.message });
    }
  };

// Soft delete task and update corresponding subtasks
exports.deleteTask = async (req, res) => {
  try {
    // Extract task_id from request parameters
    const { task_id } = req.params;
    
    // Soft delete task
    await Task.findByIdAndUpdate(task_id, { deleted_at: new Date() });

    // Soft delete corresponding subtasks
    await SubTask.updateMany({ task_id: task_id }, { deleted_at: new Date() });

    // Return success response
    res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (error) {
    // Return error response
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Export both functions
module.exports = {
  createTask: exports.createTask,
  getAllUsersTasks: exports.getAllUsersTasks,
  updateTask: exports.updateTask,
  deleteTask: exports.deleteTask
};
