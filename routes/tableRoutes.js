const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTable,
  getTables,
  getTableById,
  addRow,
  updateRow,
  deleteRow,
  deleteTable
} = require("../controllers/tableController");

const router = express.Router();

// Apply auth middleware to all table routes
router.use(authMiddleware);

// Table routes
router.post("/", createTable);
router.get("/", getTables);
router.get("/:tableId", getTableById);
router.post("/:tableId/rows", addRow);
router.put("/:tableId/rows", updateRow);
router.delete("/:tableId/rows/:rowId", deleteRow);
router.delete("/:tableId", deleteTable);

module.exports = router; 