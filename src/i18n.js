import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  cs: {
    translation: {
      "shopping_lists": "Nákupní seznamy",
      "create_list": "Vytvořit nový seznam",
      "login": "Přihlásit se",
      "logout": "Odhlásit se",
      "owner": "Vlastník",
      "members": "Členové",
      "items_done": "{{done}}/{{total}} položek dokončeno",
      "request_access": "Požádat o přístup",
      "no_access": "Nemáte přístup"
    }
  },
  en: {
    translation: {
      "shopping_lists": "Shopping Lists",
      "create_list": "Create new list",
      "login": "Login",
      "logout": "Logout",
      "owner": "Owner",
      "members": "Members",
      "items_done": "{{done}}/{{total}} items done",
      "request_access": "Request access",
      "no_access": "No access"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app_lang') || 'cs',
    fallbackLng: 'cs',
    interpolation: { escapeValue: false }
  })

export default i18n