
"use strict";

// Imports dependencies and set up http server
const express = require("express"),
    { urlencoded, json } = require("body-parser"),
    { verifyRequestSignature } = require("./helpers/verifyRequestSignature"),
    path = require("path"),
    config = require("./services/config"),
    routes = require('./routes'),
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


// Check if all environment variables are set
config.checkEnvVariables();

// listen for requests :)
const listener = app.listen(config.port, function () {
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
