const express = require('express');
const measureController = require('../controllers/measureController');

const router = express.Router();

router
  .route('/')
  .get(measureController.getAllMeasures)
  .post(measureController.createMeasure)



module.exports = router;
