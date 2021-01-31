
const i18n = require("i18n");
const path = require("path");
const config = require("./config");

i18n.configure({
  locales: [
    // "en_US",
    "ro_RO",
    // "ru_RU",

  ],
  defaultLocale: config.defaultLocale,
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
  api: {
    __: "translate",
    __n: "translateN"
  }
});

module.exports = i18n;
