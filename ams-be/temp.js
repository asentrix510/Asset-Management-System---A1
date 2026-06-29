const bcrypt = require("bcryptjs");
bcrypt.compare("admin123", "$2b$10$SLpPBSJ8EqrMW123JQ7OyupfsYMOWFIVj2Pu3dFJXEUF4ZTSnTfhi")
  .then(res => console.log("Comparison result:", res));