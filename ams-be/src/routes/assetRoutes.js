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
  getAssetDepreciation,
  getAllDepreciation,
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

router.get(
  "/depreciation",
  authorize("Admin"),
  getAllDepreciation
);

router.get(
  "/:id/depreciation",
  authorize("Admin"),
  getAssetDepreciation
);

module.exports = router;