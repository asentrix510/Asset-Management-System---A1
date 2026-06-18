const db = require("../config/db");
const Asset = require("../models/Asset");
const { logAudit } = require("../services/auditService");
const { calculateDepreciation } = require("../services/depreciationService");

const getAssets = async (req, res) => {
  try {
    const assets = await Asset.getAll();

    res.json({
      success: true,
      assets,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.getById(
      req.params.id
    );

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createAsset = async (req, res) => {
  try {
    await Asset.create(req.body);

    await logAudit({
      user_id: req.user.userId,
      action: "ASSET_CREATE",
      module_name: "ASSETS",
      record_id: null,
      description: `Created asset ${req.body.asset_name}`,
    });

    res.status(201).json({
      success: true,
      message: "Asset created",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateAsset = async (req, res) => {
  try {
    await Asset.update(
      req.params.id,
      req.body
    );

    await logAudit({
      user_id: req.user.userId,
      action: "ASSET_UPDATE",
      module_name: "ASSETS",
      record_id: req.params.id,
      description: `Updated asset ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Asset updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteAsset = async (req, res) => {
  try {
    await Asset.delete(req.params.id);

    await logAudit({
      user_id: req.user.userId,
      action: "ASSET_DELETE",
      module_name: "ASSETS",
      record_id: req.params.id,
      description: `Deleted asset ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Asset deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const checkWarrantyExpiry = async (req, res) => {
  try {
    const [expiringAssets] = await db.query(`
      SELECT *
      FROM assets
      WHERE warranty_expiry <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    for (const asset of expiringAssets) {
      await db.query(
        `
        INSERT INTO notifications
        (
          title,
          message,
          type
        )
        VALUES (?, ?, ?)
        `,
        [
          "Warranty Expiry Alert",
          `${asset.asset_name} warranty expires soon`,
          "Warranty",
        ]
      );
    }

    res.json({
      success: true,
      message: "Warranty check complete",
      count: expiringAssets.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAssetDepreciation = async (req, res) => {
  try {
    const asset = await Asset.getById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const depreciation = calculateDepreciation(asset);

    res.json({
      success: true,
      asset_id: asset.asset_id,
      asset_name: asset.asset_name,
      asset_code: asset.asset_code,
      category: asset.category,
      depreciation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllDepreciation = async (req, res) => {
  try {
    const assets = await Asset.getAll();

    const report = assets.map((asset) => ({
      asset_id: asset.asset_id,
      asset_name: asset.asset_name,
      asset_code: asset.asset_code,
      category: asset.category,
      status: asset.status,
      purchase_date: asset.purchase_date,
      depreciation: calculateDepreciation(asset),
    }));

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  checkWarrantyExpiry,
  getAssetDepreciation,
  getAllDepreciation,
};