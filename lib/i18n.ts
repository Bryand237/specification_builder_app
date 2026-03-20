export const locales = ["fr", "en"] as const

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

type Dictionary = {
  nav: {
    home: string
    help: string
    about: string
    dashboard: string
  }
  auth: {
    login: string
    signup: string
  }
  home: {
    title: string
    subtitle: string
    cta: string
  }
}

const dictionaries: Record<Locale, Dictionary> = {
  fr: {
    nav: {
      home: "Accueil",
      help: "Aide",
      about: "À propos",
      dashboard: "Dashboard",
    },
    auth: {
      login: "Connexion",
      signup: "Créer un compte",
    },
    home: {
      title: "Specifications Builder",
      subtitle:
        "L’analyse d’un projet n’a jamais été aussi simple. Suis les étapes et construis ton cahier des charges.",
      cta: "Commencer maintenant",
    },
  },
  en: {
    nav: {
      home: "Home",
      help: "Help",
      about: "About",
      dashboard: "Dashboard",
    },
    auth: {
      login: "Login",
      signup: "Sign up",
    },
    home: {
      title: "Specifications Builder",
      subtitle:
        "Project analysis has never been this simple. Follow the steps and build your specifications.",
      cta: "Get started",
    },
  },
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
