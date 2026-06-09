const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const authorize = require(
  "../middleware/roleMiddleware"
);

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.use(authMiddleware);

router.get(
  "/",
  authorize("Admin"),
  getUsers
);

router.get(
  "/:id",
  authorize("Admin"),
  getUserById
);

router.post(
  "/",
  authorize("Admin"),
  createUser
);

router.put(
  "/:id",
  authorize("Admin"),
  updateUser
);

router.delete(
  "/:id",
  authorize("Admin"),
  deleteUser
);

module.exports = router;