const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true  // Index for performance
  },
  columns: [{
    name: { type: String, required: true },
    dataType: { type: String, required: true },
    order: { type: Number, required: true }
  }],
  rows: [{
    data: [{
      value: { type: mongoose.Schema.Types.Mixed, required: true },
      columnId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Table.columns' }
    }],
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Table", tableSchema);
