const Asset = require("../models/Asset");

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

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};