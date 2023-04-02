require("dotenv").config();
const express = require("express");
const fs = require("fs");
const https = require("https");

const cors = require("cors");

const key = fs.readFileSync("/home/ubuntu/task4-server/private.key");
const cert = fs.readFileSync("/home/ubuntu/task4-server/certificate.crt");

const app = express();
const userRouter = require("./api/users/user.router");

const cred = {
  key,
  cert,
};

app.use(cors());

app.use(express.json());
app.use("/api/auth", userRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("Start on port: ", process.env.APP_PORT);
});

app.get("*", function (req, res) {
  res.redirect("http://" + req.headers.host + req.url);
});

app.listen(80);

const httpsServer = https.createServer(cred, app);
httpsServer.listen(443);
