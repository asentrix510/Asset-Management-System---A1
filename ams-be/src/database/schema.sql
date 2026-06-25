-- =============================================
-- Asset Management System (AMS) - Database Schema
-- Run this file once on any machine to set up the DB
-- =============================================

CREATE DATABASE IF NOT EXISTS ams_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE ams_db;

-- =============================================
-- 1. users
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
  `user_id`        char(36)      NOT NULL,
  `name`           varchar(100)  NOT NULL,
  `department`     varchar(100)  DEFAULT NULL,
  `designation`    varchar(100)  DEFAULT NULL,
  `phone`          varchar(20)   DEFAULT NULL,
  `email`          varchar(100)  NOT NULL,
  `password`       varchar(255)  NOT NULL,
  `plain_password` varchar(255)  DEFAULT NULL,
  `role`           enum('Admin','User') NOT NULL,
  `created_at`     timestamp     NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     timestamp     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 2. vendors
-- =============================================
CREATE TABLE IF NOT EXISTS `vendors` (
  `vendor_id`      int           NOT NULL AUTO_INCREMENT,
  `vendor_name`    varchar(255)  NOT NULL,
  `contact_person` varchar(255)  DEFAULT NULL,
  `email`          varchar(255)  DEFAULT NULL,
  `phone`          varchar(20)   DEFAULT NULL,
  `address`        text,
  `created_at`     timestamp     NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     timestamp     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 3. assets
-- =============================================
CREATE TABLE IF NOT EXISTS `assets` (
  `asset_id`       char(36)      NOT NULL,
  `asset_code`     varchar(50)   NOT NULL,
  `asset_name`     varchar(255)  NOT NULL,
  `category`       varchar(100)  NOT NULL,
  `brand`          varchar(100)  DEFAULT NULL,
  `model`          varchar(100)  DEFAULT NULL,
  `serial_number`  varchar(255)  DEFAULT NULL,
  `purchase_date`  date          DEFAULT NULL,
  `purchase_cost`  decimal(12,2) DEFAULT NULL,
  `vendor_name`    varchar(255)  DEFAULT NULL,
  `status`         enum('Available','Assigned','Maintenance','Retired') DEFAULT 'Available',
  `warranty_expiry` date         DEFAULT NULL,
  `description`    text,
  `created_at`     timestamp     NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     timestamp     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `asset_code` (`asset_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 4. asset_assignments
-- =============================================
CREATE TABLE IF NOT EXISTS `asset_assignments` (
  `assignment_id` char(36)  NOT NULL,
  `asset_id`      char(36)  NOT NULL,
  `user_id`       char(36)  NOT NULL,
  `assigned_date` date      NOT NULL,
  `return_date`   date      DEFAULT NULL,
  `status`        enum('Assigned','Returned') DEFAULT 'Assigned',
  `created_at`    timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  KEY `asset_id` (`asset_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `asset_assignments_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`),
  CONSTRAINT `asset_assignments_ibfk_2` FOREIGN KEY (`user_id`)  REFERENCES `users`  (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 5. maintenance
-- =============================================
CREATE TABLE IF NOT EXISTS `maintenance` (
  `maintenance_id`    int           NOT NULL AUTO_INCREMENT,
  `asset_id`          char(36)      NOT NULL,
  `issue_description` text          NOT NULL,
  `maintenance_date`  date          NOT NULL,
  `cost`              decimal(10,2) DEFAULT '0.00',
  `status`            enum('Open','In Progress','Completed') DEFAULT 'Open',
  `remarks`           text,
  `created_at`        timestamp     NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        timestamp     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`maintenance_id`),
  KEY `fk_maintenance_asset` (`asset_id`),
  CONSTRAINT `fk_maintenance_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 6. notifications
-- =============================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` int          NOT NULL AUTO_INCREMENT,
  `user_id`         char(36)     DEFAULT NULL,
  `title`           varchar(255) NOT NULL,
  `message`         text         NOT NULL,
  `type`            enum('Warranty','Maintenance','Assignment','Return','System') NOT NULL,
  `is_read`         tinyint(1)   DEFAULT '0',
  `created_at`      timestamp    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `fk_notification_user` (`user_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 7. audit_logs
-- =============================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_id`    int          NOT NULL AUTO_INCREMENT,
  `user_id`     char(36)     DEFAULT NULL,
  `action`      varchar(100) NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `record_id`   varchar(100) DEFAULT NULL,
  `description` text,
  `created_at`  timestamp    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`),
  KEY `fk_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;