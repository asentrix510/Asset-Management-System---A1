const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const authorize = require(
  "../middleware/roleMiddleware"
);

const {
  getAssignments,
  assignAsset,
  returnAsset,
} = require(
  "../controllers/assignmentController"
);

router.use(authMiddleware);

router.get(
  "/",
  authorize("Admin"),
  getAssignments
);

router.post(
  "/",
  authorize("Admin"),
  assignAsset
);

router.put(
  "/:id/return",
  authorize("Admin"),
  returnAsset
);

module.exports = router;