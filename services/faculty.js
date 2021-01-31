"use strict";

// Imports dependencies
const Response = require("./response");
const config = require("../config");
const _payload = require("../config/payload");
const i18n = require("../i18n.config");

module.exports = class Faculty {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case _payload.FACULTY:
        response = this.processFacultyPayload();
        break;

      case _payload.FACULTY_STUDY_FORMS.GEO:
        response = Response.genQuickReplys(
          i18n.__("faculty.what_study_forms", {
            faculty: i18n.__("faculty.geografy")
          }),
          [
            this.getBachelorQuickReplyBtn(payload),
            this.getMasterQuickReplyBtn(payload)
          ]
        );
        break;

      case _payload.FACULTY_STUDY_FORMS.BIO_CH:
        response = Response.genQuickReplys(
          i18n.__("faculty.what_study_forms", {
            faculty: i18n.__("faculty.biology_chemestry")
          }),
          [
            this.getBachelorQuickReplyBtn(payload),
            this.getMasterQuickReplyBtn(payload)
          ]
        );
        break;

      case _payload.FACULTY_STUDY_FORMS.PED:
        response = Response.genQuickReplys(
          i18n.__("faculty.what_study_forms", {
            faculty: i18n.__("faculty.pedagogy")
          }),
          [
            this.getBachelorQuickReplyBtn(payload),
            this.getMasterQuickReplyBtn(payload)
          ]
        );
        break;

      case _payload.FACULTY_STUDY_FORMS.PHILO:
        response = Response.genQuickReplys(
          i18n.__("faculty.what_study_forms", {
            faculty: i18n.__("faculty.philology")
          }),
          [
            this.getBachelorQuickReplyBtn(payload),
            this.getMasterQuickReplyBtn(payload),
            this.getPHDQuickReplyBtn(payload)
          ]
        );
        break;

      case _payload.FACULTY_STUDY_FORMS.FMTI:
        response = Response.genQuickReplys(
          i18n.__("faculty.what_study_forms", {
            faculty: i18n.__("faculty.fmti")
          }),
          [
            this.getBachelorQuickReplyBtn(payload),
            this.getMasterQuickReplyBtn(payload),
            this.getPHDQuickReplyBtn(payload)
          ]
        );
        break;


      case _payload.FACULTY_STUDY_FORMS.GEO +
        `/${_payload.STUDY_FORM.BACHELOR}`:
        response = Response.genText(i18n.__("study_form_specialities.geografy.bachelor"))
        break;
      case _payload.FACULTY_STUDY_FORMS.GEO +
        `/${_payload.STUDY_FORM.MASTER}`:
        response = Response.genText(i18n.__("study_form_specialities.geografy.master"))
        break;
      case _payload.FACULTY_STUDY_FORMS.GEO +
        `/${_payload.STUDY_FORM.PHD}`:
        response = Response.genText(i18n.__("study_form_specialities.geografy.phd"))
        break;

      case _payload.FACULTY_STUDY_FORMS.BIO_CH +
        `/${_payload.STUDY_FORM.BACHELOR}`:
        response = Response.genText(i18n.__("study_form_specialities.biology_chemestry.bachelor"))
        break;
      case _payload.FACULTY_STUDY_FORMS.BIO_CH +
        `/${_payload.STUDY_FORM.MASTER}`:
        response = Response.genText(i18n.__("study_form_specialities.biology_chemestry.master"))
        break;
      case _payload.FACULTY_STUDY_FORMS.BIO_CH +
        `/${_payload.STUDY_FORM.PHD}`:
        response = Response.genText(i18n.__("study_form_specialities.biology_chemestry.phd"))
        break;

      case _payload.FACULTY_STUDY_FORMS.PED +
        `/${_payload.STUDY_FORM.BACHELOR}`:
        response = Response.genText(i18n.__("study_form_specialities.pedagogy.bachelor"))
        break;
      case _payload.FACULTY_STUDY_FORMS.PED +
        `/${_payload.STUDY_FORM.MASTER}`:
        response = Response.genText(i18n.__("study_form_specialities.pedagogy.master"))
        break;
      case _payload.FACULTY_STUDY_FORMS.PED +
        `/${_payload.STUDY_FORM.PHD}`:
        response = Response.genText(i18n.__("study_form_specialities.pedagogy.phd"))
        break;

      case _payload.FACULTY_STUDY_FORMS.PHILO +
        `/${_payload.STUDY_FORM.BACHELOR}`:
        response = Response.genText(i18n.__("study_form_specialities.philology.bachelor"))
        break;
      case _payload.FACULTY_STUDY_FORMS.PHILO +
        `/${_payload.STUDY_FORM.MASTER}`:
        response = Response.genText(i18n.__("study_form_specialities.philology.master"))
        break;
      case _payload.FACULTY_STUDY_FORMS.PHILO +
        `/${_payload.STUDY_FORM.PHD}`:
        response = Response.genText(i18n.__("study_form_specialities.philology.phd"))
        break;

      case _payload.FACULTY_STUDY_FORMS.FMTI +
        `/${_payload.STUDY_FORM.BACHELOR}`:
        response = Response.genText(i18n.__("study_form_specialities.fmti.bachelor"))
        break;
      case _payload.FACULTY_STUDY_FORMS.FMTI +
        `/${_payload.STUDY_FORM.MASTER}`:
        response = Response.genText(i18n.__("study_form_specialities.fmti.master"))
        break;
      case _payload.FACULTY_STUDY_FORMS.FMTI +
        `/${_payload.STUDY_FORM.PHD}`:
        response = Response.genText(i18n.__("study_form_specialities.fmti.phd"))
        break;

      case _payload.FACULTY_GENERAL_INFO.BIO_CH:
        response = Response.genText(i18n.__("general_info.biology_chemestry"))
        break;
      case _payload.FACULTY_GENERAL_INFO.FMTI:
        response = Response.genText(i18n.__("general_info.fmti"))
        break;
      case _payload.FACULTY_GENERAL_INFO.GEO:
        response = Response.genText(i18n.__("general_info.geografy"))
        break;
      case _payload.FACULTY_GENERAL_INFO.PED:
        response = Response.genText(i18n.__("general_info.pedagogy"))
        break;
      case _payload.FACULTY_GENERAL_INFO.PHILO:
        response = Response.genText(i18n.__("general_info.philology"))
        break;

      default:
        response = Response.genText(
          `faculty service: This is a default postback message for payload: ${payload}!`
        );
        break;
    }

    return response;
  }

  getBachelorQuickReplyBtn(payload) {
    return Response.genQuickReplyBtn(
      `👨‍🎓${i18n.__("study_form.bachelor")}👩‍🎓`,
      payload + `/${_payload.STUDY_FORM.BACHELOR}`
    );
  }
  getMasterQuickReplyBtn(payload) {
    return Response.genQuickReplyBtn(
      `👨‍🏫${i18n.__("study_form.master")}👩‍🏫`,
      payload + `/${_payload.STUDY_FORM.MASTER}`
    );
  }
  getPHDQuickReplyBtn(payload) {
    return Response.genQuickReplyBtn(
      `👨‍⚕️${i18n.__("study_form.phd")}👩‍⚕️`,
      payload + `/${_payload.STUDY_FORM.PHD}`
    );
  }

  processFacultyPayload() {
    const elements = [
      Response.genGenericTemplateElement(
        `${config.appUrl}/faculty/fmti.png`,
        i18n.__("faculty.fmti"),
        undefined,
        this.getFacultyButtons(
          _payload.FACULTY_GENERAL_INFO.FMTI,
          _payload.FACULTY_STUDY_FORMS.FMTI,
          "https://ust.md/subdiviziuni-universitare/facultati/fmti/orarul/"
        )
      ),
      Response.genGenericTemplateElement(
        `${config.appUrl}/faculty/geografy.jpg`,
        i18n.__("faculty.geografy"),
        undefined,
        this.getFacultyButtons(
          _payload.FACULTY_GENERAL_INFO.GEO,
          _payload.FACULTY_STUDY_FORMS.GEO,
          "https://ust.md/subdiviziuni-universitare/facultati/geografie/orarul/"
        )
      ),
      Response.genGenericTemplateElement(
        `${config.appUrl}/faculty/philology.jpg`,
        i18n.__("faculty.philology"),
        undefined,
        this.getFacultyButtons(
          _payload.FACULTY_GENERAL_INFO.PHILO,
          _payload.FACULTY_STUDY_FORMS.PHILO,
          "https://ust.md/subdiviziuni-universitare/facultati/filologie/orarul/"
        )
      ),
      Response.genGenericTemplateElement(
        `${config.appUrl}/faculty/bio-ch.jpg`,
        i18n.__("faculty.biology_chemestry"),
        undefined,
        this.getFacultyButtons(
          _payload.FACULTY_GENERAL_INFO.BIO_CH,
          _payload.FACULTY_STUDY_FORMS.BIO_CH,
          "https://ust.md/subdiviziuni-universitare/facultati/biologie-si-chimie/orarul/"
        )
      ),
      Response.genGenericTemplateElement(
        `${config.appUrl}/faculty/pedagogy.jpg`,
        i18n.__("faculty.pedagogy"),
        undefined,
        this.getFacultyButtons(
          _payload.FACULTY_GENERAL_INFO.PED,
          _payload.FACULTY_STUDY_FORMS.PED,
          "https://ust.md/subdiviziuni-universitare/facultati/pedagogie/orarul/"
        )
      )
    ];

    return [
      ...Response.genText(i18n.__("faculty.our_faculties")),
      Response.genGenericTemplateFrom(elements)
    ];
  }

  getFacultyButtons(generalInfoPayload, studyFormPayload, scheduleUrl) {
    return [
      Response.genPostbackButton(
        i18n.__("faculty.general_information"),
        generalInfoPayload
      ),
      Response.genPostbackButton(
        i18n.__("faculty.study_forms"),
        studyFormPayload
      ),
      Response.genWebUrlButton(i18n.__("faculty.schedule"), scheduleUrl)
    ];
  }
};
