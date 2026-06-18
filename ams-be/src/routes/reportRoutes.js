const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAssetReport,
  getAssignmentReport,
  getMaintenanceReport,
  getVendorReport,
  getAuditReport,
} = require("../controllers/reportController");

router.get("/assets", authMiddleware, getAssetReport);

router.get("/assignments", authMiddleware, getAssignmentReport);

router.get("/maintenance", authMiddleware, getMaintenanceReport);

router.get("/vendors", authMiddleware, getVendorReport);

router.get("/audit", authMiddleware, getAuditReport);

module.exports = router;