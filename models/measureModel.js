const mongoose = require('mongoose');

const measureSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'La medición debe tener un valor']
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  },
});

const Measure = mongoose.model('Measure', measureSchema);
module.exports = Measure;