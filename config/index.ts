
"use strict";
import dotenv from "dotenv"

// Use dotenv to read .env vars into Node
dotenv.config();

// Required environment variables
const ENV_VARS = [
    "PAGE_ID",
    "APP_ID",
    "PAGE_ACCESS_TOKEN",
    "APP_SECRET",
    "VERIFY_TOKEN",
    "APP_URL",
    "SITE_URL"
];

export default {
    mongodb: process.env.MONGODB,
    mongodbOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    // Messenger Platform API
    mPlatformDomain: "https://graph.facebook.com",
    mPlatformVersion: "v3.2",

    // Page and Application information
    pageId: process.env.PAGE_ID,
    appId: process.env.APP_ID,
    pageAccesToken: process.env.PAGE_ACCESS_TOKEN,
    appSecret: process.env.APP_SECRET,
    verifyToken: process.env.VERIFY_TOKEN,

    // URL of your app domain
    appUrl: process.env.APP_URL,

    // URL of your website
    shopUrl: process.env.SITE_URL,

    // Page Webhooks fields that you want to subscribe
    pageWebhookFields: "messages, messaging_postbacks, messaging_optins, \
    message_deliveries, messaging_referrals",

    userProfileFields: "first_name, last_name, gender, locale, timezone",

    defaultLocale: "ro_RO",

    // Persona IDs
    personas: {},

    // Preferred port (default to 3000)
    port: process.env.PORT || 3000,

    get mPlatfom() {
        return this.mPlatformDomain + "/" + this.mPlatformVersion;
    },

    newMessageSign: '<<NEW>>',

    mode: {
        ALL: "all",
        SUBSCRIBE: "subscribe",
        WEBHOOK: "webhook",
        PROFILE: "profile",
        PERSONAS: "personas",
        NLP: "nlp",
        DOMAINS: "domains",
        PRIVATE_REPLY: "private-reply",
    },

    // URL of your webhook endpoint
    get webhookUrl() {
        return this.appUrl + "/webhook";
    },

    get newPersonas() {
        return [
            {
                name: "Jorge",
                picture: `${this.appUrl}/personas/sales.jpg`
            },
            {
                name: "Laura",
                picture: `${this.appUrl}/personas/billing.jpg`
            },
            {
                name: "Riandy",
                picture: `${this.appUrl}/personas/order.jpg`
            },
            {
                name: "Daniel",
                picture: `${this.appUrl}/personas/care.jpg`
            }
        ];
    },

    pushPersona(persona: any) {
        this.personas[persona.name] = persona.id;
    },

    get personaSales() {
        let id = this.personas["Jorge"] || process.env.PERSONA_SALES;
        return {
            name: "Jorge",
            id: id
        };
    },

    get personaBilling() {
        let id = this.personas["Laura"] || process.env.PERSONA_BILLING;
        return {
            name: "Laura",
            id: id
        };
    },

    get personaOrder() {
        let id = this.personas["Riandy"] || process.env.PERSONA_ORDER;
        return {
            name: "Riandy",
            id: id
        };
    },

    get personaCare() {
        let id = this.personas["Daniel"] || process.env.PERSONA_CARE;
        return {
            name: "Daniel",
            id: id
        };
    },

    get whitelistedDomains() {
        return [this.appUrl, this.shopUrl];
    },

    checkEnvVariables: function () {
        ENV_VARS.forEach(function (key) {
            if (!process.env[key]) {
                console.log("WARNING: Missing the environment variable " + key);
            } else {
                // Check that urls use https
                if (["APP_URL", "SITE_URL"].includes(key)) {
                    const url = process.env[key];
                    if (!url.startsWith("https://")) {
                        console.log(
                            "WARNING: Your " + key + ' does not begin with "https://"'
                        );
                    }
                }
            }
        });
    }
};
