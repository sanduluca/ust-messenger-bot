import express from "express"
import Receive from "../services/receive"
import GraphAPi from "../services/graph-api"
import User from "../models/User"
import config from "../config"
import i18n from "../i18n.config"
import Profile from './../services/profile'

const router = express.Router();

// Respond with index file when a GET request is made to the homepage
router.get("/", function (_req: any, res: any) {
    res.render("index");
});

// Adds support for GET requests to our webhook
router.get("/webhook", (req: any, res: any) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === config.mode.SUBSCRIBE && token === config.verifyToken) {
            // Responds with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for your webhook
router.post("/webhook", async (req: any, res: any) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(async function (entry: any) {
            if ("changes" in entry) {
                // Handle Page Changes event
                let receiveMessage = new Receive();
                if (entry.changes[0].field === "feed") {
                    let change = entry.changes[0].value;
                    switch (change.item) {
                        case "post":
                            return receiveMessage.handlePrivateReply(
                                "post_id",
                                change.post_id
                            );
                            break;
                        case "comment":
                            return receiveMessage.handlePrivateReply(
                                "commentgity _id",
                                change.comment_id
                            );
                            break;
                        default:
                            console.log('Unsupported feed change type.');
                            return;
                    }
                }
            }

            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];
            // console.log(webhookEvent);

            // Discard uninteresting events
            if ("read" in webhookEvent) {
                // console.log("Got a read event");
                return;
            }

            if ("delivery" in webhookEvent) {
                // console.log("Got a delivery event");
                return;
            }

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;

            let user =  await User.findOne({ psid: senderPsid }).exec()

            if (!user) {
                user = new User({ psid: senderPsid })
                user = await user.save()

                GraphAPi.getUserProfile(senderPsid)
                    .then(async (userProfile: any) => {
                        user.firstName = userProfile.firstName
                        user.lastName = userProfile.lastName
                        user.locale = userProfile.locale
                        user.timezone = userProfile.timezone
                        user.gender = userProfile.gender
                        user = await user.save()
                    })
                    .catch((error: any) => {
                        // The profile is unavailable
                        console.log("Profile is unavailable:", error);
                    }).finally(() => {
                        i18n.setLocale(user.locale);
                        console.log(
                            "New Profile PSID:",
                            senderPsid,
                            "with locale:",
                            i18n.getLocale()
                        );
                        let receiveMessage = new Receive(user, webhookEvent);
                        return receiveMessage.handleMessage();
                    });
            } else {
                i18n.setLocale(user.locale);
                console.log(
                    "Profile already exists PSID:",
                    senderPsid,
                    "with locale:",
                    i18n.getLocale()
                );
                let receiveMessage = new Receive(user, webhookEvent);
                return receiveMessage.handleMessage();
            }
        });
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Set up your App's Messenger Profile
router.get("/profile", (req: any, res: any) => {
    let token = req.query["verify_token"];
    let mode = req.query["mode"].toLowerCase();

    if (!config.webhookUrl.startsWith("https://")) {
        res.status(200).send("ERROR - Need a proper API_URL in the .env file");
    }
    const profile = new Profile();

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        if (token === config.verifyToken) {
            if (mode === config.mode.WEBHOOK || mode === config.mode.ALL) {
                profile.setWebhook();
                res.write(
                    `<p>Set app ${config.appId} call to ${config.webhookUrl}</p>`
                );
            }
            if (mode === config.mode.PROFILE || mode === config.mode.ALL) {
                profile.setThread();
                res.write(`<p>Set Messenger Profile of Page ${config.pageId}</p>`);
            }
            if (mode === config.mode.PERSONAS || mode === config.mode.ALL) {
                profile.setPersonas();
                res.write(`<p>Set Personas for ${config.appId}</p>`);
                res.write(
                    "<p>To persist the personas, add the following variables \
          to your environment variables:</p>"
                );
                res.write("<ul>");
                res.write(`<li>PERSONA_BILLING = ${config.personaBilling.id}</li>`);
                res.write(`<li>PERSONA_CARE = ${config.personaCare.id}</li>`);
                res.write(`<li>PERSONA_ORDER = ${config.personaOrder.id}</li>`);
                res.write(`<li>PERSONA_SALES = ${config.personaSales.id}</li>`);
                res.write("</ul>");
            }
            if (mode === config.mode.NLP || mode === config.mode.ALL) {
                GraphAPi.callNLPConfigsAPI();
                res.write(`<p>Enable Built-in NLP for Page ${config.pageId}</p>`);
            }
            if (mode === config.mode.DOMAINS || mode === config.mode.ALL) {
                profile.setWhitelistedDomains();
                res.write(`<p>Whitelisting domains: ${config.whitelistedDomains}</p>`);
            }
            if (mode === config.mode.PRIVATE_REPLY) {
                profile.setPageFeedWebhook();
                res.write(`<p>Set Page Feed Webhook for Private Replies.</p>`);
            }
            res.status(200).end();
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    } else {
        // Returns a '404 Not Found' if mode or token are missing
        res.sendStatus(404);
    }
});

export default router;