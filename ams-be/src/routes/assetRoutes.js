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
  "/depreciation",
  authorize("Admin"),
  getAllDepreciation
);

router.get(
  "/:id",
  authorize("Admin"),
  getAssetById
);

const upload = require("../middleware/uploadMiddleware");

router.post(
  "/",
  authorize("Admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "invoice", maxCount: 1 },
  ]),
  createAsset
);

router.put(
  "/:id",
  authorize("Admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "invoice", maxCount: 1 },
  ]),
  updateAsset
);

router.delete(
  "/:id",
  authorize("Admin"),
  deleteAsset
);

router.get(
  "/:id/depreciation",
  authorize("Admin"),
  getAssetDepreciation
);

module.exports = router;