// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressip = require("express-ip");
const useragent = require("express-useragent");
const morgan = require("morgan");
// internal imports
const loginRouter = require("./routers/loginRouter");

dotenv.config();
const app = express();

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

// cors init
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));

// morgain init
app.use(morgan("dev"));

// init ip option
app.use(expressip().getIpInfoMiddleware);

// init user agent
app.use(useragent.express());

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/auth", loginRouter);

// 404 route
app.get("*", (req, res) => {
  res.status(404).json({ success: false, message: "url not found!" });
});

app.listen(process.env.PORT, () => {
  console.log(`app started at port ${process.env.PORT}`);
});
