"use strict";

// Imports dependencies
import request from "request"
import camelCase from "camelcase"
import config from "../config"

export default class GraphAPi {
    static callSendAPI(requestBody: any) {
        // Send the HTTP request to the Messenger Platform
        request(
            {
                uri: `${config.mPlatfom}/me/messages`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            error => {
                if (error) {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static callMessengerProfileAPI(requestBody: any) {
        // Send the HTTP request to the Messenger Profile API

        console.log(`Setting Messenger Profile for app ${config.appId}`);
        request(
            {
                uri: `${config.mPlatfom}/me/messenger_profile`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            },
            (error: any, _res: any, body: any) => {
                if (!error) {
                    console.log("Request sent:", body);
                } else {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static callSubscriptionsAPI(customFields?: any) {
        // Send the HTTP request to the Subscriptions Edge to configure your webhook
        // You can use the Graph API's /{app-id}/subscriptions edge to configure and
        // manage your app's Webhooks product
        // https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
        console.log(
            `Setting app ${config.appId} callback url to ${config.webhookUrl}`
        );

        let fields = config.pageWebhookFields;

        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }

        console.log(fields);

        request(
            {
                uri: `${config.mPlatfom}/${config.appId}/subscriptions`,
                qs: {
                    access_token: config.appId + "|" + config.appSecret,
                    object: "page",
                    callback_url: config.webhookUrl,
                    verify_token: config.verifyToken,
                    fields: fields,
                    include_values: "true"
                },
                method: "POST"
            },
            (error: any, _res: any, body: any) => {
                if (!error) {
                    console.log("Request sent:", body);
                } else {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static callSubscribedApps(customFields?: any) {
        // Send the HTTP request to subscribe an app for Webhooks for Pages
        // You can use the Graph API's /{page-id}/subscribed_apps edge to configure
        // and manage your pages subscriptions
        // https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
        console.log(`Subscribing app ${config.appId} to page ${config.pageId}`);

        let fields = config.pageWebhookFields;

        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }

        console.log(fields);

        request(
            {
                uri: `${config.mPlatfom}/${config.pageId}/subscribed_apps`,
                qs: {
                    access_token: config.pageAccesToken,
                    subscribed_fields: fields
                },
                method: "POST"
            },
            (error: any) => {
                if (error) {
                    console.error("Unable to send message:", error);
                }
            }
        );
    }

    static async getUserProfile(senderPsid: any) {
        try {
            const userProfile: any = await this.callUserProfileAPI(senderPsid);

            for (const key in userProfile) {
                const camelizedKey = camelCase(key);
                const value = userProfile[key];
                delete userProfile[key];
                userProfile[camelizedKey] = value;
            }

            return userProfile;
        } catch (err) {
            console.log("Fetch failed:", err);
        }
    }

    static callUserProfileAPI(senderPsid: any) {
        return new Promise(function (resolve, reject) {
            let body: any[] = [];

            // Send the HTTP request to the Graph API
            request({
                uri: `${config.mPlatfom}/${senderPsid}`,
                qs: {
                    access_token: config.pageAccesToken,
                    fields: config.userProfileFields
                },
                method: "GET"
            })
                .on("response", function (response: any) {
                    // console.log(response.statusCode);

                    if (response.statusCode !== 200) {
                        reject(Error(response.statusCode));
                    }
                })
                .on("data", function (chunk) {
                    body.push(chunk);
                })
                .on("error", function (error: any) {
                    console.error("Unable to fetch profile:" + error);
                    reject(Error("Network Error"));
                })
                .on("end", () => {
                    const res = Buffer.concat(body).toString();
                    // console.log(JSON.parse(body));

                    resolve(JSON.parse(res));
                });
        });
    }

    static getPersonaAPI() {
        return new Promise(function (resolve, reject) {
            let body: any[] = [];

            // Send the POST request to the Personas API
            console.log(`Fetching personas for app ${config.appId}`);

            request({
                uri: `${config.mPlatfom}/me/personas`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "GET"
            })
                .on("response", function (response: any) {
                    // console.log(response.statusCode);

                    if (response.statusCode !== 200) {
                        reject(Error(response.statusCode));
                    }
                })
                .on("data", function (chunk: any) {
                    body.push(chunk);
                })
                .on("error", function (error: any) {
                    console.error("Unable to fetch personas:" + error);
                    reject(Error("Network Error"));
                })
                .on("end", () => {
                    const res = Buffer.concat(body).toString();
                    // console.log(JSON.parse(body));

                    resolve(JSON.parse(res).data);
                });
        });
    }

    static postPersonaAPI(name: any, profile_picture_url: any) {
        let body: any[] = [];

        return new Promise(function (resolve, reject) {
            // Send the POST request to the Personas API
            console.log(`Creating a Persona for app ${config.appId}`);

            let requestBody = {
                name: name,
                profile_picture_url: profile_picture_url
            };

            request({
                uri: `${config.mPlatfom}/me/personas`,
                qs: {
                    access_token: config.pageAccesToken
                },
                method: "POST",
                json: requestBody
            })
                .on("response", function (response: any) {
                    // console.log(response.statusCode);
                    if (response.statusCode !== 200) {
                        reject(Error(response.statusCode));
                    }
                })
                .on("data", function (chunk: any) {
                    body.push(chunk);
                })
                .on("error", function (error: any) {
                    console.error("Unable to create a persona:", error);
                    reject(Error("Network Error"));
                })
                .on("end", () => {
                    const res = Buffer.concat(body).toString();
                    // console.log(JSON.parse(body));

                    resolve(JSON.parse(res).id);
                });
        }).catch(error => {
            console.error("Unable to create a persona:", error, body);
        });
    }

    static callNLPConfigsAPI() {
        // Send the HTTP request to the Built-in NLP Configs API
        // https://developers.facebook.com/docs/graph-api/reference/page/nlp_configs/

        console.log(`Enable Built-in NLP for Page ${config.pageId}`);
        request(
            {
                uri: `${config.mPlatfom}/me/nlp_configs`,
                qs: {
                    access_token: config.pageAccesToken,
                    nlp_enabled: true
                },
                method: "POST"
            },
            (error: any, _res: any, body: any) => {
                if (!error) {
                    console.log("Request sent:", body);
                } else {
                    console.error("Unable to activate built-in NLP:", error);
                }
            }
        );
    }

    static callFBAEventsAPI(senderPsid: string, eventName: string) {
        // Construct the message body
        let requestBody = {
            event: "CUSTOM_APP_EVENTS",
            custom_events: JSON.stringify([
                {
                    _eventName: "postback_payload",
                    _value: eventName,
                    _origin: "original_coast_clothing"
                }
            ]),
            advertiser_tracking_enabled: 1,
            application_tracking_enabled: 1,
            extinfo: JSON.stringify(["mb1"]),
            page_id: config.pageId,
            page_scoped_user_id: senderPsid
        };

        // Send the HTTP request to the Activities API
        request(
            {
                uri: `${config.mPlatfom}/${config.appId}/activities`,
                method: "POST",
                form: requestBody
            },
            (error: any) => {
                if (!error) {
                    console.log(`FBA event '${eventName}'`);
                } else {
                    console.error(`Unable to send FBA event '${eventName}':` + error);
                }
            }
        );
    }
};
