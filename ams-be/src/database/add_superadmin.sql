-- ============================================================
-- SuperAdmin Role Migration
-- Run this SQL on your ams_db database to add the SuperAdmin
-- ============================================================

-- 1. Add SuperAdmin to the role enum
ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('Admin', 'User', 'SuperAdmin') NOT NULL;

-- 2. Insert the SuperAdmin account
--    Password: SuperAdmin@AMS2026
INSERT INTO `users` (
  `user_id`,
  `name`,
  `department`,
  `designation`,
  `phone`,
  `email`,
  `password`,
  `plain_password`,
  `role`
) VALUES (
  UUID(),
  'Super Admin',
  'Management',
  'System SuperAdmin',
  NULL,
  'superadmin@ams.local',
  '$2b$10$dj04X0t7rWjyMqFt4elxhuUqOWuP9yAPp2nK41vOS45VdozjXKl86',
  'SuperAdmin@AMS2026',
  'SuperAdmin'
);
