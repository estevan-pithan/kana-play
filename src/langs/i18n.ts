import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { RESOURCES } from './resources'

void i18n.use(initReactI18next).init({
  resources: RESOURCES,
  lng: 'enUS',
  fallbackLng: 'enUS',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
