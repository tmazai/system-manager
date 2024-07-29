const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  stakeholders: [{ type: String }],
  sites: [{ type: String }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;