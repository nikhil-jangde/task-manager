const express = require('express');
const router = express.Router();
const { createSubTask, getAllSubTasks, updateSubTask, deleteSubTask } = require('../controllers/subtaskController');

router.post('/createSubTask/:task_id',createSubTask);
router.get('/getAllSubTasks/:task_id',getAllSubTasks);
router.put('/updateSubTask/:task_id',updateSubTask);
router.delete('/deleteSubTask/:task_id',deleteSubTask);

module.exports = router;
