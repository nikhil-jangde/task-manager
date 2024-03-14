const SubTask = require('../models/SubTask');
const Task = require('../models/Task');

exports.createSubTask = async (req, res) => {
  try {
    // Extract data from request body
    const { task_id } = req.params;
    // Create sub task
    const subTask = await SubTask.create({ task_id });
    // Return success response
    res.status(201).json({ status: 'success', data: subTask });
  } catch (error) {
    // Return error response
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.getAllSubTasks = async (req, res) => {
    try {
      // Extract task_id from request parameters
      const { task_id } = req.params;
      // Fetch sub tasks for the specified task_id
      const subTasks = await SubTask.find({ task_id });
      // Return sub tasks
      res.status(200).json({ status: 'success', data: subTasks });
    } catch (error) {
      // Return error response
      res.status(400).json({ status: 'error', message: error.message });
    }
  };

// Controller function to update a subtask and update the corresponding task status
exports.updateSubTask = async (req, res) => {
  try {
    // Extract task_id from request parameters
    const { task_id } = req.params;
    // Update subtasks with the given task_id
    const updatedSubTasks = await SubTask.updateMany({ task_id },{$set:{ status: req.body.status}});
    
    // Update corresponding task status based on subtask statuses
    await updateTaskStatus(task_id);
    
    // Return updated subtasks
    res.status(200).json({ status: 'success', data: updatedSubTasks });
  } catch (error) {
    // Return error response
    res.status(400).json({ status: 'error', message: error.message });
  }
};


async function updateTaskStatus(task_id) {
  const task = await Task.findById(task_id);
  const subtasks = await SubTask.find({ task_id });

  // Check if any subtask is complete
  const isComplete = subtasks.some(subtask => subtask.status === 1);

  // Update task status based on subtask statuses
  if (subtasks.length === 1 && isComplete) {
    task.status = 'DONE';
  } else if (subtasks.length === 1 && !isComplete) {
    task.status = 'TODO';
  } else if (subtasks.length > 1 && isComplete) {
    task.status = 'IN_PROGRESS';
  }

  await task.save();
}


  
  exports.deleteSubTask = async (req, res) => {
    try {
      // Extract task_id from request parameters
      const { task_id } = req.params;
      // Soft delete sub task
      await SubTask.updateMany({ task_id: task_id }, { $set: { deleted_at: new Date() } });
      // Return success response
      res.status(200).json({ status: 'success', message: 'Sub task deleted successfully' });
    } catch (error) {
      // Return error response
      res.status(400).json({ status: 'error', message: error.message });
    }
  };
  

  module.exports = {
    createSubTask: exports.createSubTask,
    getAllSubTasks: exports.getAllSubTasks,
    updateSubTask: exports.updateSubTask,
    deleteSubTask: exports.deleteSubTask
  };