const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} = require(
  "../controllers/vendorController"
);

router.get(
  "/",
  authMiddleware,
  getVendors
);

router.get(
  "/:id",
  authMiddleware,
  getVendorById
);

router.post(
  "/",
  authMiddleware,
  createVendor
);

router.put(
  "/:id",
  authMiddleware,
  updateVendor
);

router.delete(
  "/:id",
  authMiddleware,
  deleteVendor
);

module.exports = router;