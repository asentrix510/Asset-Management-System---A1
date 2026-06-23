const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getMyAssets,
  getMyMaintenance,
} = require("../controllers/userPortalController");

// All portal routes require a valid token (any role)
router.use(authMiddleware);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.get("/my-assets", getMyAssets);
router.get("/my-maintenance", getMyMaintenance);

module.exports = router;
