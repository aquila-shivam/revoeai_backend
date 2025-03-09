const Table = require("../models/tables");

exports.createTable = async (req, res) => {
  try {
    const { columns } = req.body;
    const newTable = new Table({
      user: req.user.userId, // From JWT auth middleware
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
    res.status(500).json({ error: "Error creating table" });
  }
};

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ user: req.user.userId });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tables" });
  }
};

exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findOne({
      _id: req.params.tableId,
      user: req.user.userId
    });
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Error fetching table" });
  }
};

exports.addRow = async (req, res) => {
  try {
    const { data } = req.body;
    const table = await Table.findOne({
      _id: req.params.tableId,
      user: req.user.userId
    });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    table.rows.push({ data });
    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Error adding row" });
  }
};

exports.updateRow = async (req, res) => {
  try {
    const { rowId, data } = req.body;
    const table = await Table.findOneAndUpdate(
      {
        _id: req.params.tableId,
        user: req.user.userId,
        "rows._id": rowId
      },
      {
        $set: { "rows.$.data": data }
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ error: "Table or row not found" });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Error updating row" });
  }
};

exports.deleteRow = async (req, res) => {
  try {
    const { rowId } = req.params;
    const table = await Table.findOneAndUpdate(
      {
        _id: req.params.tableId,
        user: req.user.userId
      },
      {
        $pull: { rows: { _id: rowId } }
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ error: "Table or row not found" });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ error: "Error deleting row" });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({
      _id: req.params.tableId,
      user: req.user.userId
    });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting table" });
  }
}; 