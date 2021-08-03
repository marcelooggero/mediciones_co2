const Measure = require('../models/measureModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const createMeasure = catchAsync(async (req, res, next) => {
  const newMeasure = await Measure.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      measure: newMeasure
    }
  });
});

const getAllMeasures = factory.getAll(Measure);

module.exports = {
  getAllMeasures,
  createMeasure
};
