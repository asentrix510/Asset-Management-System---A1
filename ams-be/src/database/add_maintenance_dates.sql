-- ============================================================
-- Maintenance Handover and Return Dates Migration
-- Run this SQL on your database to add handover_date and
-- return_date fields to the maintenance table.
-- ============================================================

ALTER TABLE `maintenance`
  ADD COLUMN `handover_date` date DEFAULT NULL AFTER `maintenance_date`,
  ADD COLUMN `return_date` date DEFAULT NULL AFTER `handover_date`;
