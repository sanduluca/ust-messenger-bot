
"use strict";

// Imports dependencies and set up http server
const express = require("express"),
    { urlencoded, json } = require("body-parser"),
    crypto = require("crypto"),
    path = require("path"),
    config = require("./services/config"),
    routes = require('./routes')
app = express();


// Parse application/x-www-form-urlencoded
app.use(
    urlencoded({
        extended: true
    })
);

// Parse application/json. Verify that callback came from Facebook
app.use(json({ verify: verifyRequestSignature }));

// Serving static files in Express
app.use(express.static(path.join(path.resolve(), "public")));

// Set template engine in Express
app.set("view engine", "ejs");

app.use('/', routes);

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        console.log("Couldn't validate the signature.");
    } else {
        var elements = signature.split("=");
        var signatureHash = elements[1];
        var expectedHash = crypto
            .createHmac("sha1", config.appSecret)
            .update(buf)
            .digest("hex");
        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

// Check if all environment variables are set
config.checkEnvVariables();

// listen for requests :)
var listener = app.listen(config.port, function () {
    console.log("Your app is listening on port " + listener.address().port);

    if (
        Object.keys(config.personas).length == 0 &&
        config.appUrl &&
        config.verifyToken
    ) {
        console.log(
            "Is this the first time running?\n" +
            "Make sure to set the both the Messenger profile, persona " +
            "and webhook by visiting:\n" +
            config.appUrl +
            "/profile?mode=all&verify_token=" +
            config.verifyToken
        );
    }

    if (config.pageId) {
        console.log("Test your app by messaging:");
        console.log("https://m.me/" + config.pageId);
    }
});
