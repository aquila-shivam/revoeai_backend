const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  columns: [{
    name: { type: String, required: true },
    dataType: { type: String, required: true },
    order: { type: Number, required: true }
  }],
  rows: [{
    data: [{
      value: { type: mongoose.Schema.Types.Mixed },
      columnId: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Table", tableSchema); 