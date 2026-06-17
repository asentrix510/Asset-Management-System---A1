const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  getMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require(
  "../controllers/maintenanceController"
);

router.get(
  "/",
  authMiddleware,
  getMaintenanceRecords
);

router.get(
  "/:id",
  authMiddleware,
  getMaintenanceById
);

router.post(
  "/",
  authMiddleware,
  createMaintenance
);

router.put(
  "/:id",
  authMiddleware,
  updateMaintenance
);

router.delete(
  "/:id",
  authMiddleware,
  deleteMaintenance
);

module.exports =
  router;