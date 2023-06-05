const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    logins: [
      {
        ip: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        device: {
          type: String,
          required: true,
        },
        device_detail: {
          browser: String,
          version: String,
          os: String,
          platform: String,
          login_time: String,
        },
        token: {
          type: String,
          required: true,
        },
        login_time: {
          type: String,
          required: true,
        },
        logout_time: {
          type: String,
          required: true,
          default: "in",
        },
        relogins: [
          {
            ip: String,
            address: String,
            browser: String,
            version: String,
            os: String,
            platform: String,
            login_time: String,
          },
        ],
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true }
);

const UsersModel = mongoose.model("users", usersSchema);

module.exports = UsersModel;
