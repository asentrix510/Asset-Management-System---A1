# Phase 10: Notifications System

This phase adds a real-time notification system that alerts administrators about key system events — including warranty expirations, maintenance activities, asset assignments, and returns. Notifications appear in a dropdown panel accessible from the top navigation bar.

## 1. Database Schema

### The `notifications` Table
```sql
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` INT          NOT NULL AUTO_INCREMENT,
  `user_id`         CHAR(36)     DEFAULT NULL,
  `title`           VARCHAR(255) NOT NULL,
  `message`         TEXT         NOT NULL,
  `type`            ENUM('Warranty','Maintenance','Assignment','Return','System') NOT NULL,
  `is_read`         TINYINT(1)   DEFAULT '0',
  `created_at`      TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
);
```

- **`notification_id`**: Auto-incrementing primary key.
- **`user_id`**: Optional — links notification to a specific user (nullable for system-wide alerts).
- **`title`**: Short notification headline.
- **`message`**: Detailed notification body text.
- **`type`**: Category for icon and color styling (`Warranty`, `Maintenance`, `Assignment`, `Return`, `System`).
- **`is_read`**: Boolean flag — `0` for unread, `1` for read.

---

## 2. Backend API

### Controller (`notificationController.js`)
Handles fetching, marking as read, and deleting notifications.

### Endpoints
1. **`GET /api/notifications`** — Fetch all notifications, ordered by most recent.
   - **Response**: `{ success: true, notifications: [...] }`

2. **`PUT /api/notifications/:id/read`** — Mark a notification as read.
   - **SQL**: `UPDATE notifications SET is_read = TRUE WHERE notification_id = ?`
   - **Response**: `{ success: true, message: "Notification marked as read" }`

3. **`DELETE /api/notifications/:id`** — Delete a notification.
   - **Response**: `{ success: true, message: "Notification deleted" }`

### Automatic Notification Triggers
Notifications are created as side effects in other controllers:
- **Maintenance Created**: When a new maintenance record is created, a notification of type `Maintenance` is inserted automatically.
- **Asset Assignment/Return**: Assignment operations can trigger `Assignment` or `Return` type notifications.

---

## 3. Frontend Integration

### Context Provider (`NotificationContext.jsx`)
A React context that:
- Fetches all notifications on mount.
- Exposes `notifications`, `unreadCount`, `loading`, `markAsRead(id)`, and `deleteNotification(id)` to all child components.
- Auto-refreshes the notification list after any mark/delete action.

### API Wrapper (`notificationApi.js`)
- `getNotifications()` — Fetch all notifications.
- `markNotificationRead(id)` — Mark a single notification as read.
- `deleteNotification(id)` — Remove a notification.

### Navbar Notification Panel (`Navbar.jsx`)
The notification system is accessed via a bell icon button in the top navigation bar:
- **Bell Icon**: Shows a red badge with the unread count (caps at "99+").
- **Dropdown Panel**: Opens on click, displaying:
  - Header with "Alert Notifications" label and unread count.
  - Scrollable list of notifications with:
    - **Type-specific icon**: Warranty (warning triangle), Maintenance (wrench), Assignment (user-check), Return (check-square).
    - **Type-specific background color**: Yellow, amber, blue, violet per type.
    - **Title, message, and timestamp** for each notification.
    - **Mark as read** button (checkmark) for unread items.
    - **Delete** button (trash icon) for each item.
  - Empty state message when no notifications exist.
- **Outside click detection**: Closes the panel when clicking outside.
