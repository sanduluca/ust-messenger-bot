
"use strict";

const i18n = require("../i18n.config");
const _payload = require("../config/payload");
const config = require("../config");

module.exports = class Response {
  static genQuickReplys(text, quickReplies) {
    let response = {
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

  static genQuickReplyBtn(title, payload) {
    return {
      title,
      payload
    }
  }

  static genQuickReplyBtnWithImg(title, payload, image_url) {
    return {
      title,
      payload,
      image_url
    }
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
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

  static genGenericTemplateFrom(elements) {
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

  static genGenericTemplateElement(image_url, title, subtitle, buttons) {
    return {
      title,
      subtitle,
      image_url,
      buttons
    }
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = Response.genGenericTemplateFrom([
      {
        title,
        subtitle,
        image_url
      }
    ])

    return response;
  }

  static genButtonTemplate(title, buttons) {
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

  static genText(text) {
    return text.split(config.newMessageSign)
      .map(text => ({ text }))
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url, webview_height_ratio = "full") {
    let response = {
      type: "web_url",
      title,
      url,
      messenger_extensions: true,
      webview_height_ratio
    };

    return response;
  }

  static genNuxMessage(user) {
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
      }
    ]);

    return [welcome, guide, curation];
  }
};
