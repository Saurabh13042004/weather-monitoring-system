const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router.get('/current', weatherController.getCurrentWeather);
router.get('/historical/:city', weatherController.getHistoricalWeather);
router.get('/daily-summary/:city', weatherController.getDailySummary);
router.get('/alerts', weatherController.getAlerts);
router.get('/config', weatherController.getConfig);
router.post('/config', weatherController.updateConfig);
router.get('/alert-config', weatherController.getAlertConfig);
router.post('/alert-config', weatherController.updateAlertConfig);

module.exports = router;