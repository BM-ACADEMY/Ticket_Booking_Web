const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportsController');

router.post('/create-report', reportController.createReport);
router.get('/fetch-all-report', reportController.getAllReports);
router.get('/fetch-by-report-id/:id', reportController.getReportById);
router.put('/update-report/:id', reportController.updateReport);
router.delete('/delete-report/:id', reportController.deleteReport);

module.exports = router;
