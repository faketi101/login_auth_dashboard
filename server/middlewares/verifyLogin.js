const User = require("../models/UsersModel");
const jwt = require("jsonwebtoken");

const verifyLogin = async (req, res, next) => {
  try {
    const cookie = req.headers.authorization;

    if (cookie !== "undefined" && cookie) {
      const decoded = jwt.decode(cookie, process.env.JWT_SECRET);

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

      const isTokenExpired = (token) =>
        Date.now() >=
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).exp *
          1000;

      if (isTokenExpired(cookie)) {
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
              status: "expired",
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

        return res
          .status(401)
          .json({ success: false, message: "Token expired. Please relogin." });
      }

      // success

      req.loggedInUser = {
        username: user.username,
        role: user.role,
        email: user.email,
        avatar: user.avatar || null,
      };
      next();
    } else {
      res
        .status(404)
        .json({ success: false, message: "No login details found." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, message: "Unauthorised. Please relogin. " });
  }
};

module.exports = verifyLogin;
