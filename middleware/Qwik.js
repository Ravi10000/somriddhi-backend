
const axios = require("axios");
const fs = require("fs");

const tokenFilePath = "./token.txt";

const verifyUrl = "https://extapi12.woohoo.in/oauth2/verify";
const codeUrl = "https://extapi12.woohoo.in/oauth2/token";

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

exports.generateAccessToken = async (req, res, next) => {
  fs.readFile(tokenFilePath, 'utf8',async function (err, data) {
    console.log(tokenFilePath,data);
    console.log("data ",data);
    if (err) return console.log(err);
    if (data) {
    //   const tokenData = JSON.parse(data);
    //   if (isTokenValid(tokenData)) {
        console.log(data);
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
                "clientId": process.env.QWIK_CLIENTID,
                "username": process.env.QWIK_USERNAME,
                "password": process.env.QWIK_PASSWORD
            }),
        };
        var verifyResponse = await axios.request(verifyOptions);
        var authCode = verifyResponse.data['authorizationCode'];
        console.log("AuthCode",verifyResponse.data,verifyOptions);

        //then call token api
        const codeOptions = {
            method: "POST",
            url: codeUrl,
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            data: JSON.stringify({
                "authorizationCode": authCode,
                "clientId": process.env.QWIK_CLIENTID,
                "clientSecret": process.env.QWIK_CLIENTSECRET
            }),
        };

        var codeResponse = await axios.request(codeOptions);
        var authToken = codeResponse.data['token'];
        console.log("authToken",codeResponse.data,codeOptions);
        fs.writeFile(
            tokenFilePath,
            authToken,
            async function (err) {
                console.log("Error while saving file: ", err);
            }
        );

        req.access_token = authToken;
        next();
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
};

// function isTokenValid(tokenData) {
//   const currentDate = new Date().valueOf();
//   const tokenExpiryDate = new Date(tokenData[".expires"]).valueOf();

//   return currentDate < tokenExpiryDate;
// }
