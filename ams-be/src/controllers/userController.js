const bcrypt = require("bcryptjs");
const db = require("../config/db");
const User = require("../models/User");
const { logAudit } = require("../services/auditService");

const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.getById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      department,
      designation,
      phone,
      email,
      password,
      role,
    } = req.body;

    // Guard: Only SuperAdmin can create Admin or SuperAdmin accounts
    if (req.user.role !== "SuperAdmin" && (role === "Admin" || role === "SuperAdmin")) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to create administrative accounts.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.create({
      name,
      department,
      designation,
      phone,
      email,
      password: hashedPassword,
      plain_password: password,
      role,
    });

    await logAudit({
      user_id: req.user.userId,
      action: "USER_CREATE",
      module_name: "USERS",
      record_id: null,
      description: `Created user ${name}`,
    });

    res.status(201).json({
      success: true,
      message: "User created",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };

    const targetUser = await User.getById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Guard: Only SuperAdmin can modify administrative accounts or elevate roles
    if (req.user.role !== "SuperAdmin") {
      if (targetUser.role === "Admin" || targetUser.role === "SuperAdmin") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to modify administrative accounts.",
        });
      }
      if (data.role && data.role !== "User") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to assign administrative roles.",
        });
      }
    }

    if (data.password) {
      data.plain_password = data.password;
      data.password = await bcrypt.hash(data.password, 10);
    }

    await User.update(
      req.params.id,
      data
    );

    await logAudit({
      user_id: req.user.userId,
      action: "USER_UPDATE",
      module_name: "USERS",
      record_id: req.params.id,
      description: `Updated user ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "User updated",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // ── Guard: cannot delete yourself ──
    if (String(req.user.userId) === String(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account while logged in",
      });
    }

    // ── Guard: cannot delete another Admin ──
    const targetUser = await User.getById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (targetUser.role === "SuperAdmin") {
      return res.status(403).json({
        success: false,
        message: "SuperAdmin accounts cannot be deleted",
      });
    }
    // Regular Admin cannot delete other Admin accounts
    if (targetUser.role === "Admin" && req.user.role !== "SuperAdmin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts can only be deleted by a SuperAdmin",
      });
    }

    // ── 1. Return any currently-assigned assets back to 'Available' ──
    //    so they can be reassigned to someone else later
    await db.query(
      `UPDATE assets
       SET status = 'Available'
       WHERE asset_id IN (
         SELECT asset_id FROM asset_assignments
         WHERE user_id = ? AND status = 'Assigned'
       )`,
      [req.params.id]
    );

    // ── 2. Remove all assignment records for this user ──
    //    (user_id is NOT NULL, so we must delete rather than nullify)
    await db.query(
      `DELETE FROM asset_assignments WHERE user_id = ?`,
      [req.params.id]
    );

    // ── 3. Now safe to delete the user ──
    await User.delete(req.params.id);

    await logAudit({
      user_id: req.user.userId,
      action: "USER_DELETE",
      module_name: "USERS",
      record_id: req.params.id,
      description: `Deleted user ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};