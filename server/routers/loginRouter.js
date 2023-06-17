const express = require("express");
const router = express.Router();

// internal imports
const {
  login,
  verifyPage,
  logout,
  getDevices,
  deviceUpdate,
  changePassword,
  changeAvatar
} = require("../controllers/loginController");
const { userDetails } = require("../middlewares/userDetails");
const verifyLogin = require("../middlewares/verifyLogin");

// do login
router.post("/login", userDetails, login);

// verify login
router.get("/verify", verifyLogin, verifyPage);

// log out
router.get("/logout", logout);

// Devide details
router.get("/devices", verifyLogin, getDevices);

// device update
router.post("/devices/update", verifyLogin, deviceUpdate);

// change password
router.post("/change_password", verifyLogin, changePassword);

// change password
router.post("/change_avatar", verifyLogin, changeAvatar);

module.exports = router;
