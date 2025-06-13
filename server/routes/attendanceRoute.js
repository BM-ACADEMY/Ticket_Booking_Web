const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// ✅ Unique & Specific Routes First
router.put('/mark-attendance', attendanceController.markAttendance); // renamed for clarity
router.get('/fetch-attendance-by-user-show/:user_id/:show_id', attendanceController.getAttendance); // renamed

// ✅ Generic Routes After
router.post('/', attendanceController.createAttendance);
router.get('/fetch-all-attendance', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/update-attendance/:id', attendanceController.updateAttendance);
router.delete('/delete-attendance/:id', attendanceController.deleteAttendance);

module.exports = router;
