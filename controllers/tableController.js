const Table = require("../models/tables");

// Create Table
exports.createTable = async (req, res) => {
  try {
    const { columns } = req.body;

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      return res.status(400).json({ error: "Columns are required and must be an array" });
    }

    const newTable = new Table({
      user: req.user._id, // Use _id consistently
      columns: columns.map((col, index) => ({
        name: col.name,
        dataType: col.dataType,
        order: index
      })),
      rows: []
    });

    await newTable.save();
    res.status(201).json(newTable);
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: "Error creating table", details: error.message });
  }
};

// Get all tables for a user
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ user: req.user._id });
    res.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Error fetching tables", details: error.message });
  }
};

// Get a single table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findOne({
      _id: req.params.tableId,
      user: req.user._id
    });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    res.json(table);
  } catch (error) {
    console.error("Error fetching table:", error);
    res.status(500).json({ error: "Error fetching table", details: error.message });
  }
};

// Add a new row to a table
exports.addRow = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Row data must be an array" });
    }

    const table = await Table.findOne({ _id: req.params.tableId, user: req.user._id });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    table.rows.push({ data });
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    console.error("Error adding row:", error);
    res.status(500).json({ error: "Error adding row", details: error.message });
  }
};

// Update a row in a table
exports.updateRow = async (req, res) => {
  try {
    const { rowId, data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Updated row data must be an array" });
    }

    const table = await Table.findOne({ _id: req.params.tableId, user: req.user._id });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const row = table.rows.id(rowId);
    if (!row) {
      return res.status(404).json({ error: "Row not found" });
    }

    row.data = data;
    await table.save();
    res.json(table);
  } catch (error) {
    console.error("Error updating row:", error);
    res.status(500).json({ error: "Error updating row", details: error.message });
  }
};

// Delete a row from a table
exports.deleteRow = async (req, res) => {
  try {
    const { rowId } = req.params;

    const table = await Table.findOne({ _id: req.params.tableId, user: req.user._id });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const rowIndex = table.rows.findIndex(row => row._id.toString() === rowId);
    if (rowIndex === -1) {
      return res.status(404).json({ error: "Row not found" });
    }

    table.rows.splice(rowIndex, 1);
    await table.save();

    res.json({ message: "Row deleted successfully", table });
  } catch (error) {
    console.error("Error deleting row:", error);
    res.status(500).json({ error: "Error deleting row", details: error.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({ _id: req.params.tableId, user: req.user._id });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ error: "Error deleting table", details: error.message });
  }
};
