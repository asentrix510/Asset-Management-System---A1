-- ============================================================
-- Asset Upload Columns Migration
-- Run this SQL on your ams_db database to add support for 
-- asset photos and invoice documents.
-- ============================================================

ALTER TABLE `assets`
  ADD COLUMN `image_path` varchar(500) DEFAULT NULL AFTER `description`,
  ADD COLUMN `invoice_path` varchar(500) DEFAULT NULL AFTER `image_path`;
