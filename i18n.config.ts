
import i18n from "i18n"
import path from "path"
import config from "./config"

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

export default i18n;
