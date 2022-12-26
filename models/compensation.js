const mongoose = require('mongoose');

const compensation = new mongoose.Schema({
  age_range: [{ type: Number }],
  industry: { type: String },
  title: { type: String },
  salary: { type: Number },
  currency_main: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  experience_range: [{ type: Number }],
  title_description: { type: String },
  currency_other: { type: String },
  timestamp: { type: Date }
}, {
  versionKey: false
});
compensation.index({ salary: 1 });

const Compensation = mongoose.model('Compensation', compensation);
module.exports = Compensation;