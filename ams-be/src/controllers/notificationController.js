const db = require("../config/db");

exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE notification_id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM notifications
      WHERE notification_id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};