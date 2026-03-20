export type CdcSection = {
  key: string
  title: string
  content: string
  children?: CdcSection[]
  assets?: Array<{
    assetId: string
    fileName: string
    mimeType: string
    url: string
  }>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isCdcSection(value: unknown): value is CdcSection {
  if (!isRecord(value)) {
    return false
  }

  if (typeof value.key !== "string") return false
  if (typeof value.title !== "string") return false
  if (typeof value.content !== "string") return false

  if (value.children !== undefined) {
    if (!Array.isArray(value.children)) return false
    if (!value.children.every(isCdcSection)) return false
  }

  if (value.assets !== undefined) {
    if (!Array.isArray(value.assets)) return false
    for (const a of value.assets) {
      if (!isRecord(a)) return false
      if (typeof a.assetId !== "string") return false
      if (typeof a.fileName !== "string") return false
      if (typeof a.mimeType !== "string") return false
      if (typeof a.url !== "string") return false
    }
  }

  return true
}

export function isCdcSectionArray(value: unknown): value is CdcSection[] {
  return Array.isArray(value) && value.every(isCdcSection)
}

export function buildDefaultCdcSections(): CdcSection[] {
  return [
    {
      key: "I",
      title: "Présentation du projet",
      content: "",
      children: [
        { key: "1.1", title: "Contexte et enjeux", content: "" },
        { key: "1.2", title: "Objectif du projet", content: "" },
        { key: "1.3", title: "Cibles et Persona", content: "" },
      ],
    },
    {
      key: "II",
      title: "Architecture de l’information",
      content: "",
      children: [
        { key: "2.1", title: "Arborescence de l’application", content: "" },
        {
          key: "2.2",
          title: "Maquettes fonctionnelles",
          content: "",
          assets: [],
        },
        {
          key: "2.3",
          title: "Charte graphique et principes de design",
          content: "",
          children: [
            { key: "2.3.1", title: "Palette de couleur", content: "" },
            { key: "2.3.2", title: "Typographie", content: "" },
            {
              key: "2.3.3",
              title: "Iconographie et composants d’interfaces",
              content: "",
            },
            { key: "2.3.4", title: "Guide de style", content: "" },
          ],
        },
      ],
    },
    {
      key: "III",
      title: "Spécification fonctionnelles",
      content: "",
      children: [
        {
          key: "3.1",
          title: "Liste des fonctionnalités par module",
          content: "",
        },
        {
          key: "3.2",
          title: "Diagramme de cas d’utilisation",
          content: "",
          assets: [],
        },
        { key: "3.3", title: "Règles de gestion", content: "" },
      ],
    },
    {
      key: "IV",
      title: "Conception technique et données",
      content: "",
      children: [
        { key: "4.1", title: "Architecture technique", content: "" },
        {
          key: "4.2",
          title: "Modélisation de la base de données",
          content: "",
          children: [
            {
              key: "4.2.1",
              title: "Modélisation les données en agrégats",
              content: "",
            },
            {
              key: "4.2.2",
              title: "Utilisation d’une base de données orienté document",
              content: "",
            },
            { key: "4.2.3", title: "Configuration du cluster", content: "" },
            { key: "4.2.4", title: "Timbre Vectoriel de version", content: "" },
            { key: "4.2.5", title: "Vues matérialisées", content: "" },
            { key: "4.2.6", title: "Map/Reduce", content: "" },
          ],
        },
        {
          key: "4.3",
          title: "Diagramme de classes",
          content: "",
          assets: [],
        },
        {
          key: "4.4",
          title: "Diagramme de séquence",
          content: "",
          assets: [],
        },
      ],
    },
    {
      key: "V",
      title: "Contraintes et mise en œuvre",
      content: "",
      children: [
        {
          key: "5.1",
          title: "Sécurité et confidentialité (RGPD)",
          content: "",
        },
        { key: "5.2", title: "Planning et Jalons (Roadmap)", content: "" },
        { key: "5.3", title: "Budget et livrable attendus", content: "" },
      ],
    },
  ]
}
