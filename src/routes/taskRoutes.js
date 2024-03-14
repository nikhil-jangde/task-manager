const express = require('express');
const router = express.Router();
const { createTask, getAllUsersTasks, updateTask, deleteTask} = require('../controllers/taskController');


router.post('/createTask', createTask);
router.get('/getAllUsersTasks', getAllUsersTasks);
router.put('/updateTask/:task_id', updateTask)
router.delete('/deleteTask/:task_id', deleteTask);

module.exports = router;
