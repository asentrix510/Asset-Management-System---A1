const AssetAssignment = require(
  "../models/AssetAssignment"
);
const { logAudit } = require("../services/auditService");

const getAssignments =
  async (req, res) => {
    try {
      const assignments =
        await AssetAssignment.getAll();

      res.json({
        success: true,
        assignments,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

const assignAsset =
  async (req, res) => {
    try {
      await AssetAssignment.create(
        req.body
      );

      await logAudit({
        user_id: req.user.userId,
        action: "ASSET_ASSIGNED",
        module_name: "ASSIGNMENTS",
        record_id: null,
        description: `Asset assigned`,
      });

      res.status(201).json({
        success: true,
        message: "Asset assigned",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

const returnAsset =
  async (req, res) => {
    try {
      await AssetAssignment.returnAsset(
        req.params.id
      );

      await logAudit({
        user_id: req.user.userId,
        action: "ASSET_RETURNED",
        module_name: "ASSIGNMENTS",
        record_id: req.params.id,
        description: `Asset returned`,
      });

      res.json({
        success: true,
        message: "Asset returned",
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
  getAssignments,
  assignAsset,
  returnAsset,
};