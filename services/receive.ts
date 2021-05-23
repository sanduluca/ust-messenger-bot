
"use strict";


import Response from "./response"
import GraphAPi from "./graph-api"
import i18n from "../i18n.config"
import _payload from "../config/payload"
import Faculty from "./faculty"

export default class Receive {
    user: any
    webhookEvent: any
    constructor(user?: any, webhookEvent?: any) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    // Check if the event is a message or postback and
    // call the appropriate handler function
    handleMessage() {
        this.sendTyping()
        let event = this.webhookEvent;

        let responses;

        try {
            if (event.message) {
                let message = event.message;

                if (message.quick_reply) {
                    responses = this.handleQuickReply();
                } else if (message.attachments) {
                    responses = this.handleAttachmentMessage();
                } else if (message.text) {
                    responses = this.handleTextMessage();
                }
            } else if (event.postback) {
                responses = this.handlePostback();
            } else if (event.referral) {
                responses = this.handleReferral();
            }
        } catch (error) {
            console.error(error);
            responses = {
                text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
            };
        }

        if (Array.isArray(responses)) {
            let delay = 0;
            for (let response of responses) {
                this.sendMessage(response, delay * 2000);
                delay++;
            }
        } else {
            this.sendMessage(responses);
        }
    }

    // Handles messages events with text
    handleTextMessage() {
        console.log(
            "Received text:",
            `${this.webhookEvent.message.text} for ${this.user.psid}`
        );

        // check greeting is here and is confident
        let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

        let message: string = this.webhookEvent.message.text.trim().toLowerCase();

        let response;

        if (
            (greeting && greeting.confidence > 0.8) ||
            message.includes("start over")
        ) {
            response = Response.genNuxMessage(this.user);
        }
        else if (message.includes('adresa') || message.includes('adresă') || message.includes('адрес')) {
            response = Response.genText(i18n.__("address"))
        } else if (message.includes('contact') || message.includes('контакт')) {
            response = Response.genText(i18n.__("contact"))
        } else if (message.includes('admitere') || message.includes('admission')) {
            response = this.handlePayload(_payload.ADMITTANCE)
        } else if (message.includes('wifi')) {
            response = Response.genText(i18n.__('wifi_settings'))
        } else {
            response = [
                ...Response.genText(
                    i18n.__("fallback.any", {
                        message: this.webhookEvent.message.text
                    })
                ),
                ...Response.genText(i18n.__("get_started.guidance")),
                Response.genQuickReplys(i18n.__("get_started.help"), [
                    {
                        title: i18n.__("menu.faculties"),
                        payload: _payload.FACULTY
                    },
                    {
                        title: i18n.__("menu.help"),
                        payload: _payload.HELP
                    },
                    {
                        title: i18n.__("menu.admittance"),
                        payload: _payload.ADMITTANCE
                    }
                ])
            ];
        }

        return response;
    }

    // Handles mesage events with attachments
    handleAttachmentMessage() {
        let response;

        // Get the attachment
        let attachment = this.webhookEvent.message.attachments[0];
        console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

        response = Response.genQuickReplys(i18n.__("fallback.attachment"), [
            {
                title: i18n.__("menu.help"),
                payload: _payload.HELP
            },
            {
                title: i18n.__("menu.start_over"),
                payload: _payload.GET_STARTED
            }
        ]);

        return response;
    }

    // Handles mesage events with quick replies
    handleQuickReply() {
        // Get the payload of the quick reply
        let payload = this.webhookEvent.message.quick_reply.payload;

        return this.handlePayload(payload);
    }

    // Handles postbacks events
    handlePostback() {
        let postback = this.webhookEvent.postback;
        // Check for the special Get Starded with referral
        let payload;
        if (postback.referral && postback.referral.type == "OPEN_THREAD") {
            payload = postback.referral.ref;
        } else {
            // Get the payload of the postback
            payload = postback.payload;
        }
        return this.handlePayload(payload.toUpperCase());
    }

    // Handles referral events
    handleReferral() {
        // Get the payload of the postback
        let payload = this.webhookEvent.referral.ref.toUpperCase();

        return this.handlePayload(payload);
    }

    handlePayload(payload: string) {
        console.log("Received Payload:", `${payload} for ${this.user.psid}`);

        // Log CTA event in FBA
        GraphAPi.callFBAEventsAPI(this.user.psid, payload);

        let response;

        // Set the response based on the payload
        if (payload === "GET_STARTED") {
            response = Response.genNuxMessage(this.user);
        } else if (payload === _payload.ADMITTANCE) {
            response = Response.genButtonTemplate(i18n.__("admittance_info"), [
                Response.genWebUrlButton(
                    i18n.__("complete_now"),
                    'https://ust.md/admiterea-2020-formular-de-inregistrare/',
                    'tall'
                )
            ])
        } else if (payload.includes(_payload.FACULTY)) {
            let faculty = new Faculty(this.user, this.webhookEvent)
            response = faculty.handlePayload(payload)
        } else if (payload.includes("CURATION") || payload.includes("COUPON")) {
            // let curation = new Curation(this.user, this.webhookEvent);
            // response = curation.handlePayload(payload);
        } else {
            response = {
                text: `This is a default postback message for payload: ${payload}!`
            };
        }

        return response;
    }

    handlePrivateReply(type: string, object_id: string) {
        let welcomeMessage = i18n.__("get_started.welcome") + " " +
            i18n.__("get_started.guidance") + ". " +
            i18n.__("get_started.help");

        let response = Response.genQuickReplys(welcomeMessage, [
            {
                title: i18n.__("menu.faculties"),
                payload: _payload.FACULTY
            },
            {
                title: i18n.__("menu.help"),
                payload: _payload.HELP
            }
        ]);

        let requestBody = {
            recipient: {
                [type]: object_id
            },
            message: response
        };

        GraphAPi.callSendAPI(requestBody);
    }

    sendMessage(response: any, delay: number = 0) {
        // Check if there is delay in the response
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }

        // Construct the message body
        let requestBody: any = {
            recipient: {
                id: this.user.psid
            },
            message: response
        };

        // Check if there is persona id in the response
        if ("persona_id" in response) {
            let persona_id = response["persona_id"]
            delete response["persona_id"];

            requestBody = {
                recipient: {
                    id: this.user.psid
                },
                message: response,
                persona_id: persona_id
            };
        }

        setTimeout(() => {
            GraphAPi.callSendAPI(requestBody)
        }, delay);
    }

    firstEntity(nlp: any, name: string) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    }

    sendTyping() {
        GraphAPi.callSendAPI({
            recipient: {
                id: this.user.psid
            },
            sender_action: "typing_on"
        })
    }
};
