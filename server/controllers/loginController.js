// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/UsersModel");

// do login
async function login(req, res) {
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          username: user.username,
          email: user.email,
          avatar: user.avatar || null,
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        let cookie = {
          name: process.env.COOKIE_NAME,
          token: token,
          options: {
            maxAge: process.env.JWT_EXPIRY,
            httpOnly: true,
            signed: true,
            path: "/",
          },
        };

        let loginDetails = {
          ip: req.userIP,
          address: `${req.userLocation.city},${req.userLocation.country}`,
        };

        let login = {
          ip: req.userIP,
          status: "in",
          address: loginDetails.address,
          device: req.userDevice.browser,
          device_detail: req.userDevice,
          token: token,
          login_time: new Date().getTime(),
          relogins: [],
        };

        await User.updateOne(
          {
            $or: [
              { username: req.body.username },
              { email: req.body.username },
            ],
          },
          { $push: { logins: login } }
        );

        res.status(200).json({
          data: userObject,
          success: true,
          cookie,
        });
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (err) {
    res.status(401).json({
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// verify page
const verifyPage = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome back ${req.loggedInUser.username}`,
    data: req.loggedInUser,
  });
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const cookie = req.headers.authorization;
    const decoded = jwt.decode(cookie);
    if (cookie !== "undefined" && cookie) {
      const user = await User.findOne({
        $or: [{ username: decoded.username }, { email: decoded.email }],
      });
      // checking token user
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "No login details found." });

      let db_login = null;
      user.logins.map((login) => {
        if (login.token === cookie) {
          return (db_login = login);
        }
      });
      // checking db login staus and db login token
      if (
        !db_login ||
        db_login.status === "deleted" ||
        db_login.status === "out" ||
        db_login.status === "expired"
      ) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorised. Please relogin. " });
      }

      let upLogins = [];
      user.logins.map((login) => {
        if (login.token === cookie) {
          let {
            ip,
            address,
            device,
            device_detail,
            token,
            login_time,
            relogins,
            _id,
          } = login;
          let upObj = {
            ip,
            address,
            device,
            device_detail,
            token,
            login_time,
            relogins,
            _id,
            status: "out",
            logout_time: new Date().getTime(),
          };
          upLogins.push(upObj);
        } else {
          upLogins.push(login);
        }
      });

      await User.updateOne(
        {
          $or: [{ username: decoded.username }, { email: decoded.email }],
        },
        { $set: { logins: upLogins } }
      );
      res.status(201).json({
        success: true,
        message: `${decoded.username} has been logged out.`,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No login details found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error! try again later." });
  }
};

// DEVICE MANAGER
const getDevices = async (req, res) => {
  try {
    const user = await User.findOne(
      {
        $or: [
          { username: req.loggedInUser.username },
          { email: req.loggedInUser.email },
        ],
      },
      { "logins.token": 0, password: 0 }
    );

    let filteredLogins = [];
    user.logins.map((login) => {
      if (login.status === "expired") {
        return;
      } else {
        filteredLogins.push(login);
      }
    });
    res.status(200).json({
      success: true,
      user: req.loggedInUser,
      updated: user.timestamps,
      logins: filteredLogins.reverse(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error! try again later." });
  }
};

// Device Update
const deviceUpdate = async (req, res) => {
  try {
    const { type, id } = req.body;
    const user = await User.findOne({
      $or: [
        { username: req.loggedInUser.username },
        { email: req.loggedInUser.email },
      ],
    });

    let upLogins = [];
    let previous = "";
    let updated = "";
    user.logins.map((login) => {
      if (login._id == id) {
        let {
          ip,
          address,
          device,
          device_detail,
          token,
          login_time,
          relogins,
          _id,
        } = login;
        previous = login;
        previous.token = "NA";

        let upObj = {
          ip,
          address,
          device,
          device_detail,
          token,
          login_time,
          relogins,
          _id,
          status: type,
        };
        updated = upObj;
        updated.token = "NA";
        upLogins.push(upObj);
      } else {
        upLogins.push(login);
      }
    });

    await User.updateOne(
      {
        $or: [
          { username: req.loggedInUser.username },
          { email: req.loggedInUser.email },
        ],
      },
      { $set: { logins: upLogins } }
    );

    const data = await User.findOne(
      {
        $or: [
          { username: req.loggedInUser.username },
          { email: req.loggedInUser.email },
        ],
      },
      { "logins.token": 0, password: 0 }
    );

    let filteredLogins = [];
    data.logins.map((login) => {
      if (login.status === "expired") {
        return;
      } else {
        filteredLogins.push(login);
      }
    });

    res.status(200).json({
      success: true,
      message: `IP${previous.ip} has changed from logged ${previous.status} to ${updated.status}. `,
      user: req.loggedInUser,
      updated: data.timestamps,
      logins: filteredLogins.reverse(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error! try again later." });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { prePass, newPass } = req.body;
    const user = await User.findOne({
      $or: [
        { username: req.loggedInUser.username },
        { email: req.loggedInUser.email },
      ],
    });
    const isValid = await bcrypt.compare(prePass, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Previous password didn't match" });
    }

    const newHashPassword = await bcrypt.hash(newPass, 12);
    console.log(newHashPassword);
    await User.updateOne(
      {
        $or: [
          { username: req.loggedInUser.username },
          { email: req.loggedInUser.email },
        ],
      },
      { $set: { password: newHashPassword } }
    );
    res
      .status(201)
      .json({ success: true, message: "Password has been changed." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error! try again later." });
  }
};

// Change Avatar
const changeAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    await User.updateOne(
      {
        $or: [
          { username: req.loggedInUser.username },
          { email: req.loggedInUser.email },
        ],
      },
      { $set: { avatar: avatar } }
    );
    res
      .status(201)
      .json({ success: true, message: "Avatar has been changed." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error! try again later." });
  }
};

module.exports = {
  login,
  verifyPage,
  logout,
  getDevices,
  deviceUpdate,
  changePassword,
  changeAvatar,
};
