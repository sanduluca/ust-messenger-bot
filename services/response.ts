
"use strict";

import i18n from "../i18n.config"
import _payload from "../config/payload"
import config from "../config"

export default class Response {
  static genQuickReplys(text: string, quickReplies: any[]) {
    const response: any = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response.quick_replies.push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genQuickReplyBtn(title: string, payload: any) {
    return {
      title,
      payload
    }
  }

  static genQuickReplyBtnWithImg(title: string, payload: any, image_url: string) {
    return {
      title,
      payload,
      image_url
    }
  }

  static genGenericTemplate(image_url: string, title: string, subtitle: string, buttons: any[]) {
    let response = Response.genGenericTemplateFrom([
      {
        title,
        subtitle,
        image_url,
        buttons
      }
    ])

    return response;
  }

  static genGenericTemplateFrom(elements: any) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements
        }
      }
    };

    return response;
  }

  static genGenericTemplateElement(image_url: string, title: string, subtitle: string, buttons: any[]) {
    return {
      title,
      subtitle,
      image_url,
      buttons
    }
  }

  static genImageTemplate(image_url: string, title: string, subtitle = "") {
    let response = Response.genGenericTemplateFrom([
      {
        title,
        subtitle,
        image_url
      }
    ])

    return response;
  }

  static genButtonTemplate(title: string, buttons: any[]) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text: string) {
    return text.split(config.newMessageSign)
      .map(t => ({ text: t }))
  }

  static genTextWithPersona(text: string, persona_id: string) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title: string, payload: any) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title: string, url: string, webview_height_ratio = "full") {
    let response = {
      type: "web_url",
      title,
      url,
      messenger_extensions: true,
      webview_height_ratio
    };

    return response;
  }

  static genNuxMessage(user: any) {
    let welcome = this.genText(
      i18n.__("get_started.welcome", {
        userFirstName: user.firstName
      })
    );

    let guide = this.genText(i18n.__("get_started.guidance"));

    let curation = this.genQuickReplys(i18n.__("get_started.help"), [
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
    ]);

    return [welcome, guide, curation];
  }
};
