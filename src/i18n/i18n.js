import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Translation files
import esTranslation from "./locales/es/translation.json"
import enTranslation from "./locales/en/translation.json"
import frTranslation from "./locales/fr/translation.json"

const resources = {
  es: {
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // default language
  fallbackLng: "es",

  interpolation: {
    escapeValue: false, // react already does escaping
  },

  react: {
    useSuspense: false,
  },
})

export default i18n
