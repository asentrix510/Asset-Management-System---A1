const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const authorize = require(
  "../middleware/roleMiddleware"
);

const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} = require(
  "../controllers/assetController"
);

router.use(authMiddleware);

router.get(
  "/",
  authorize("Admin"),
  getAssets
);

router.get(
  "/:id",
  authorize("Admin"),
  getAssetById
);

router.post(
  "/",
  authorize("Admin"),
  createAsset
);

router.put(
  "/:id",
  authorize("Admin"),
  updateAsset
);

router.delete(
  "/:id",
  authorize("Admin"),
  deleteAsset
);

module.exports = router;