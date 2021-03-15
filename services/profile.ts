
"use strict";

// Imports dependencies
import GraphAPi from "./graph-api"
import i18n from "../i18n.config"
import config from "../config"
import _payload from "../config/payload"
const locales = i18n.getLocales()

export default class Profile {
    setWebhook() {
        GraphAPi.callSubscriptionsAPI();
        GraphAPi.callSubscribedApps();
    }

    setPageFeedWebhook() {
        GraphAPi.callSubscriptionsAPI("feed");
        GraphAPi.callSubscribedApps("feed");
    }

    setThread() {
        let profilePayload = {
            ...this.getGetStarted(),
            ...this.getGreeting(),
            ...this.getPersistentMenu()
        };

        GraphAPi.callMessengerProfileAPI(profilePayload);
    }

    setPersonas() {
        let newPersonas = config.newPersonas;

        GraphAPi.getPersonaAPI()
            .then((personas: any[]) => {
                for (let persona of personas) {
                    config.pushPersona({
                        name: persona.name,
                        id: persona.id
                    });
                }
                console.log(config.personas);
                return config.personas;
            })
            .then(existingPersonas => {
                for (let persona of newPersonas) {
                    if (!(persona.name in existingPersonas)) {
                        GraphAPi.postPersonaAPI(persona.name, persona.picture)
                            .then(personaId => {
                                config.pushPersona({
                                    name: persona.name,
                                    id: personaId
                                });
                                console.log(config.personas);
                            })
                            .catch(error => {
                                console.log("Creation failed:", error);
                            });
                    } else {
                        console.log("Persona already exists for name:", persona.name);
                    }
                }
            })
            .catch(error => {
                console.log("Creation failed:", error);
            });
    }

    setGetStarted() {
        let getStartedPayload = this.getGetStarted();
        GraphAPi.callMessengerProfileAPI(getStartedPayload);
    }

    setGreeting() {
        let greetingPayload = this.getGreeting();
        GraphAPi.callMessengerProfileAPI(greetingPayload);
    }

    setPersistentMenu() {
        let menuPayload = this.getPersistentMenu();
        GraphAPi.callMessengerProfileAPI(menuPayload);
    }

    setWhitelistedDomains() {
        let domainPayload = this.getWhitelistedDomains();
        GraphAPi.callMessengerProfileAPI(domainPayload);
    }

    getGetStarted() {
        return {
            get_started: {
                payload: _payload.GET_STARTED
            }
        };
    }

    getGreeting() {
        let greetings = [];

        for (let locale of locales) {
            greetings.push(this.getGreetingText(locale));
        }

        return {
            greeting: greetings
        };
    }

    getPersistentMenu() {
        let menuItems = [];

        for (let locale of locales) {
            menuItems.push(this.getMenuItems(locale));
        }

        return {
            persistent_menu: menuItems
        };
    }

    getGreetingText(locale: string) {
        let param = locale === config.defaultLocale ? "default" : locale;

        i18n.setLocale(locale);

        let localizedGreeting = {
            locale: param,
            text: i18n.__("profile.greeting", {
                user_first_name: "{{user_first_name}}"
            })
        };

        console.log(localizedGreeting);
        return localizedGreeting;
    }

    getMenuItems(locale: string) {
        let param = locale === config.defaultLocale ? "default" : locale;

        i18n.setLocale(locale);

        let localizedMenu = {
            locale: param,
            composer_input_disabled: false,
            call_to_actions: [
                {
                    title: i18n.__("menu.faculties"),
                    type: "postback",
                    payload: _payload.FACULTY
                },
                {
                    title: i18n.__("menu.help"),
                    type: "postback",
                    payload: _payload.HELP
                },
                {
                    type: "web_url",
                    title: i18n.__("menu.site"),
                    url: config.shopUrl,
                    webview_height_ratio: "full"
                }
            ]
        };

        console.log(localizedMenu);
        return localizedMenu;
    }

    getWhitelistedDomains() {
        let whitelistedDomains = {
            whitelisted_domains: config.whitelistedDomains
        };

        console.log(whitelistedDomains);
        return whitelistedDomains;
    }
};
