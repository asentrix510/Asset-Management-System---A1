const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // SuperAdmin inherits all Admin-level access automatically
    const effectiveRoles = roles.includes("Admin")
      ? [...roles, "SuperAdmin"]
      : roles;

    if (!effectiveRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = authorize;