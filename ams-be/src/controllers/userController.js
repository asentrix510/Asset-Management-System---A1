const bcrypt = require("bcryptjs");
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
      message: "User deleted",
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