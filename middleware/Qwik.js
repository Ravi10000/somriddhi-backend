const axios = require("axios");
const fs = require("fs");
const path = require("path");

const tokenFilePath = path.resolve("token.txt"); // $ROOT_FOLDER/token.txt

const verifyUrl = `${process.env.QWIK_BASEURL}/oauth2/verify`;
const codeUrl = `${process.env.QWIK_BASEURL}/oauth2/token`;

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports.generateAccessToken = async (req, res, next) => {
  fs.readFile(tokenFilePath, "utf8", async function (err, data) {
    console.log({ tokenFilePath, data });
    if (err) console.log({ "error while reading token": err?.message });
    else if (data) {
      //   const tokenData = JSON.parse(data);
      //   if (isTokenValid(tokenData)) {
      req.access_token = data;
      return next();
      //   }
    }
    try {
      const verifyOptions = {
        method: "POST",
        url: verifyUrl,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        data: JSON.stringify({
          clientId: process.env.QWIK_CLIENTID,
          username: process.env.QWIK_USERNAME,
          password: process.env.QWIK_PASSWORD,
        }),
      };
      let verifyResponse = await axios.request(verifyOptions);
      let authCode = verifyResponse.data["authorizationCode"];
      console.log("AuthCode", verifyResponse.data, verifyOptions);

      //then call token api
      const codeOptions = {
        method: "POST",
        url: codeUrl,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        data: JSON.stringify({
          authorizationCode: authCode,
          clientId: process.env.QWIK_CLIENTID,
          clientSecret: process.env.QWIK_CLIENTSECRET,
        }),
      };

      let codeResponse = await axios.request(codeOptions);
      let authToken = codeResponse.data["token"];
      console.log("authToken", codeResponse.data, codeOptions);
      fs.writeFile(tokenFilePath, authToken, async function (err) {
        console.log("Error while saving file: ", err);
      });

      req.access_token = authToken;
      next();
    } catch (err) {
      console.error("Error while generating access token: ", err);
      res.status(500).json(err);
    }
  });
};

module.exports.tokenFilePath = tokenFilePath;
// function isTokenValid(tokenData) {
//   const currentDate = new Date().valueOf();
//   const tokenExpiryDate = new Date(tokenData[".expires"]).valueOf();

//   return currentDate < tokenExpiryDate;
// }
