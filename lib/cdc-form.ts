import type { Locale } from "@/lib/i18n"

export type CdcFormField = {
  name: string
  label: string
  type: "text" | "textarea"
  placeholder?: string
  description?: string
}

export type CdcSectionFormConfig = {
  title: string
  fields: CdcFormField[]
  supportsAssets?: boolean
}

const cdcSectionFormConfigsFr: Record<string, CdcSectionFormConfig> = {
  "1.1": {
    title: "Contexte et enjeux",
    fields: [
      {
        name: "context",
        label: "Contexte",
        type: "textarea",
        placeholder: "Décris le contexte du projet...",
      },
      {
        name: "stakes",
        label: "Enjeux",
        type: "textarea",
        placeholder: "Quels sont les enjeux business/techniques ?",
      },
    ],
  },
  "1.2": {
    title: "Objectif du projet",
    fields: [
      {
        name: "goal",
        label: "Objectif principal",
        type: "textarea",
      },
      {
        name: "successCriteria",
        label: "Critères de succès",
        type: "textarea",
      },
    ],
  },
  "1.3": {
    title: "Cibles et Persona",
    fields: [
      {
        name: "targets",
        label: "Cibles",
        type: "textarea",
        placeholder: "Segments, utilisateurs, organisations...",
      },
      {
        name: "personas",
        label: "Personas",
        type: "textarea",
        placeholder: "Décris 1-3 personas (besoins, pain points, objectifs)...",
      },
    ],
  },
  "2.1": {
    title: "Arborescence de l’application",
    fields: [
      {
        name: "sitemap",
        label: "Arborescence (texte)",
        type: "textarea",
        placeholder: "Ex: /, /login, /dashboard, ...",
      },
    ],
  },
  "2.2": {
    title: "Maquettes fonctionnelles",
    fields: [
      {
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "Explique les écrans/flux principaux...",
      },
    ],
    supportsAssets: true,
  },
  "2.3": {
    title: "Charte graphique et principes de design",
    fields: [
      {
        name: "principles",
        label: "Principes",
        type: "textarea",
        placeholder: "Principes de design, accessibilité, cohérence...",
      },
      {
        name: "branding",
        label: "Contraintes de marque",
        type: "textarea",
        placeholder: "Logo, couleurs imposées, guidelines existantes...",
      },
    ],
  },
  "2.3.1": {
    title: "Palette de couleur",
    fields: [
      {
        name: "primaryColors",
        label: "Couleurs principales",
        type: "textarea",
        placeholder: "Ex: Primary: #..., Secondary: #..., Success: #...",
      },
      {
        name: "usageRules",
        label: "Règles d’usage",
        type: "textarea",
        placeholder: "Contrastes, usages par composant/état...",
      },
    ],
  },
  "2.3.2": {
    title: "Typographie",
    fields: [
      {
        name: "fonts",
        label: "Polices",
        type: "textarea",
        placeholder: "Ex: Titres: ..., Texte: ...",
      },
      {
        name: "scale",
        label: "Échelle / styles",
        type: "textarea",
        placeholder: "Tailles, graisse, line-height, h1/h2/body...",
      },
    ],
  },
  "2.3.3": {
    title: "Iconographie et composants d’interfaces",
    fields: [
      {
        name: "iconography",
        label: "Iconographie",
        type: "textarea",
        placeholder: "Librairie (Lucide...), style, règles d’usage...",
      },
      {
        name: "components",
        label: "Composants UI",
        type: "textarea",
        placeholder: "Boutons, inputs, cards, modals, tables...",
      },
    ],
  },
  "2.3.4": {
    title: "Guide de style",
    fields: [
      {
        name: "styleGuide",
        label: "Guide de style",
        type: "textarea",
        placeholder: "Règles globales: spacing, rayons, ombres, états...",
      },
      {
        name: "doDont",
        label: "Do / Don't",
        type: "textarea",
        placeholder: "Bonnes pratiques et anti-patterns...",
      },
    ],
  },
  "3.1": {
    title: "Liste des fonctionnalités par module",
    fields: [
      {
        name: "modules",
        label: "Modules + fonctionnalités",
        type: "textarea",
        placeholder: "Module A: ...\nModule B: ...",
      },
    ],
  },
  "3.2": {
    title: "Diagramme de cas d’utilisation",
    fields: [
      {
        name: "actors",
        label: "Acteurs",
        type: "textarea",
      },
      {
        name: "useCases",
        label: "Cas d’utilisation",
        type: "textarea",
      },
    ],
    supportsAssets: true,
  },
  "3.3": {
    title: "Règles de gestion",
    fields: [
      {
        name: "rules",
        label: "Règles",
        type: "textarea",
        placeholder: "Règle 1: ...\nRègle 2: ...",
      },
    ],
  },
  "4.1": {
    title: "Architecture technique",
    fields: [
      {
        name: "stack",
        label: "Stack / contraintes techniques",
        type: "textarea",
      },
      {
        name: "deployment",
        label: "Déploiement",
        type: "textarea",
      },
    ],
  },
  "4.2": {
    title: "Modélisation de la base de données",
    fields: [
      {
        name: "overview",
        label: "Vue d’ensemble",
        type: "textarea",
        placeholder:
          "Entités/collections principales, relations, contraintes...",
      },
      {
        name: "conventions",
        label: "Conventions",
        type: "textarea",
        placeholder: "Nommage, indexation, ids, timestamps...",
      },
    ],
  },
  "4.2.1": {
    title: "Modélisation les données en agrégats",
    fields: [
      {
        name: "aggregates",
        label: "Agrégats",
        type: "textarea",
        placeholder: "Décris les agrégats, invariants, frontières...",
      },
      {
        name: "transactions",
        label: "Transactions",
        type: "textarea",
        placeholder: "Quand utiliser des transactions, garanties attendues...",
      },
    ],
  },
  "4.2.2": {
    title: "Utilisation d’une base de données orienté document",
    fields: [
      {
        name: "documentModel",
        label: "Modèle document",
        type: "textarea",
        placeholder: "Choix embed vs reference, structures, exemples...",
      },
      {
        name: "tradeoffs",
        label: "Trade-offs",
        type: "textarea",
        placeholder: "Lecture/écriture, duplication, cohérence...",
      },
    ],
  },
  "4.2.3": {
    title: "Configuration du cluster",
    fields: [
      {
        name: "topology",
        label: "Topologie",
        type: "textarea",
        placeholder: "Replica set, sharding, régions, sizing...",
      },
      {
        name: "backups",
        label: "Sauvegardes",
        type: "textarea",
        placeholder: "Stratégie backup/restore, RPO/RTO...",
      },
    ],
  },
  "4.2.4": {
    title: "Timbre Vectoriel de version",
    fields: [
      {
        name: "versioning",
        label: "Versioning",
        type: "textarea",
        placeholder: "Stratégie de version, conflits, évolutions de schéma...",
      },
      {
        name: "concurrency",
        label: "Concurrence",
        type: "textarea",
        placeholder: "Optimistic locking, idempotence, retries...",
      },
    ],
  },
  "4.2.5": {
    title: "Vues matérialisées",
    fields: [
      {
        name: "views",
        label: "Vues matérialisées",
        type: "textarea",
        placeholder: "Quels besoins, fréquence de refresh, sources...",
      },
      {
        name: "maintenance",
        label: "Maintenance",
        type: "textarea",
        placeholder: "Rebuild, monitoring, stratégie d’invalidation...",
      },
    ],
  },
  "4.2.6": {
    title: "Map/Reduce",
    fields: [
      {
        name: "useCases",
        label: "Cas d’usage",
        type: "textarea",
        placeholder:
          "Pourquoi Map/Reduce, alternatives (aggregation pipeline)...",
      },
      {
        name: "implementation",
        label: "Implémentation",
        type: "textarea",
        placeholder: "Entrées/sorties, performance, limitations...",
      },
    ],
  },
  "4.3": {
    title: "Diagramme de classes",
    fields: [
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
    ],
    supportsAssets: true,
  },
  "4.4": {
    title: "Diagramme de séquence",
    fields: [
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
    ],
    supportsAssets: true,
  },
  "5.1": {
    title: "Sécurité et confidentialité (RGPD)",
    fields: [
      {
        name: "security",
        label: "Sécurité",
        type: "textarea",
      },
      {
        name: "privacy",
        label: "Confidentialité / RGPD",
        type: "textarea",
      },
    ],
  },
  "5.2": {
    title: "Planning et Jalons (Roadmap)",
    fields: [
      {
        name: "milestones",
        label: "Jalons",
        type: "textarea",
        placeholder: "Jalon 1: ...\nJalon 2: ...",
      },
      {
        name: "timeline",
        label: "Timeline",
        type: "textarea",
      },
    ],
  },
  "5.3": {
    title: "Budget et livrables attendus",
    fields: [
      {
        name: "budget",
        label: "Budget",
        type: "textarea",
      },
      {
        name: "deliverables",
        label: "Livrables",
        type: "textarea",
      },
    ],
  },
}

const cdcSectionFormConfigsEn: Record<string, CdcSectionFormConfig> = {
  "1.1": {
    title: "Project context & challenges",
    fields: [
      {
        name: "context",
        label: "Context",
        type: "textarea",
        placeholder: "Describe the project context...",
      },
      {
        name: "stakes",
        label: "Challenges",
        type: "textarea",
        placeholder: "What are the business/technical challenges?",
      },
    ],
  },
  "1.2": {
    title: "Project objective",
    fields: [
      {
        name: "goal",
        label: "Primary goal",
        type: "textarea",
      },
      {
        name: "successCriteria",
        label: "Success criteria",
        type: "textarea",
      },
    ],
  },
  "1.3": {
    title: "Target audiences & personas",
    fields: [
      {
        name: "targets",
        label: "Target audiences",
        type: "textarea",
        placeholder: "Segments, users, organizations...",
      },
      {
        name: "personas",
        label: "Personas",
        type: "textarea",
        placeholder:
          "Describe 1-3 personas (needs, pain points, goals)...",
      },
    ],
  },
  "2.1": {
    title: "Application sitemap",
    fields: [
      {
        name: "sitemap",
        label: "Sitemap (text)",
        type: "textarea",
        placeholder: "e.g. /, /login, /dashboard, ...",
      },
    ],
  },
  "2.2": {
    title: "Functional wireframes",
    fields: [
      {
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "Explain the main screens/flows...",
      },
    ],
    supportsAssets: true,
  },
  "2.3": {
    title: "Visual design guidelines & principles",
    fields: [
      {
        name: "principles",
        label: "Principles",
        type: "textarea",
        placeholder:
          "Design principles, accessibility, consistency...",
      },
      {
        name: "branding",
        label: "Brand constraints",
        type: "textarea",
        placeholder:
          "Logo, required colors, existing brand guidelines...",
      },
    ],
  },
  "2.3.1": {
    title: "Color palette",
    fields: [
      {
        name: "primaryColors",
        label: "Primary colors",
        type: "textarea",
        placeholder:
          "e.g. Primary: #..., Secondary: #..., Success: #...",
      },
      {
        name: "usageRules",
        label: "Usage rules",
        type: "textarea",
        placeholder:
          "Contrast & usage rules by component/state...",
      },
    ],
  },
  "2.3.2": {
    title: "Typography",
    fields: [
      {
        name: "fonts",
        label: "Fonts",
        type: "textarea",
        placeholder: "e.g. Headings: ..., Body: ...",
      },
      {
        name: "scale",
        label: "Scale / styles",
        type: "textarea",
        placeholder:
          "Sizes, weight, line-height, h1/h2/body...",
      },
    ],
  },
  "2.3.3": {
    title: "Iconography & UI components",
    fields: [
      {
        name: "iconography",
        label: "Iconography",
        type: "textarea",
        placeholder:
          "Library (Lucide...), style, usage rules...",
      },
      {
        name: "components",
        label: "UI components",
        type: "textarea",
        placeholder:
          "Buttons, inputs, cards, modals, tables...",
      },
    ],
  },
  "2.3.4": {
    title: "Style guide",
    fields: [
      {
        name: "styleGuide",
        label: "Style guide",
        type: "textarea",
        placeholder:
          "Global rules: spacing, radii, shadows, states...",
      },
      {
        name: "doDont",
        label: "Do / Don't",
        type: "textarea",
        placeholder:
          "Best practices and anti-patterns...",
      },
    ],
  },
  "3.1": {
    title: "Feature list by module",
    fields: [
      {
        name: "modules",
        label: "Modules & features",
        type: "textarea",
        placeholder: "Module A: ...\nModule B: ...",
      },
    ],
  },
  "3.2": {
    title: "Use case diagram",
    fields: [
      {
        name: "actors",
        label: "Actors",
        type: "textarea",
      },
      {
        name: "useCases",
        label: "Use cases",
        type: "textarea",
      },
    ],
    supportsAssets: true,
  },
  "3.3": {
    title: "Business rules",
    fields: [
      {
        name: "rules",
        label: "Rules",
        type: "textarea",
        placeholder: "Rule 1: ...\nRule 2: ...",
      },
    ],
  },
  "4.1": {
    title: "Technical architecture",
    fields: [
      {
        name: "stack",
        label: "Stack / technical constraints",
        type: "textarea",
      },
      {
        name: "deployment",
        label: "Deployment",
        type: "textarea",
      },
    ],
  },
  "4.2": {
    title: "Database modeling",
    fields: [
      {
        name: "overview",
        label: "Overview",
        type: "textarea",
        placeholder:
          "Main entities/collections, relationships, constraints...",
      },
      {
        name: "conventions",
        label: "Conventions",
        type: "textarea",
        placeholder:
          "Naming, indexing, ids, timestamps...",
      },
    ],
  },
  "4.2.1": {
    title: "Modeling data as aggregates",
    fields: [
      {
        name: "aggregates",
        label: "Aggregates",
        type: "textarea",
        placeholder: "Describe aggregates, invariants, boundaries...",
      },
      {
        name: "transactions",
        label: "Transactions",
        type: "textarea",
        placeholder:
          "When to use transactions, expected guarantees...",
      },
    ],
  },
  "4.2.2": {
    title: "Using a document database",
    fields: [
      {
        name: "documentModel",
        label: "Document model",
        type: "textarea",
        placeholder:
          "Embed vs reference choices, structures, examples...",
      },
      {
        name: "tradeoffs",
        label: "Trade-offs",
        type: "textarea",
        placeholder:
          "Read/write, duplication, consistency...",
      },
    ],
  },
  "4.2.3": {
    title: "Cluster configuration",
    fields: [
      {
        name: "topology",
        label: "Topology",
        type: "textarea",
        placeholder:
          "Replica set, sharding, regions, sizing...",
      },
      {
        name: "backups",
        label: "Backups",
        type: "textarea",
        placeholder:
          "Backup/restore strategy, RPO/RTO...",
      },
    ],
  },
  "4.2.4": {
    title: "Version vector timestamping",
    fields: [
      {
        name: "versioning",
        label: "Versioning",
        type: "textarea",
        placeholder:
          "Versioning strategy, conflicts, schema evolution...",
      },
      {
        name: "concurrency",
        label: "Concurrency",
        type: "textarea",
        placeholder:
          "Optimistic locking, idempotence, retries...",
      },
    ],
  },
  "4.2.5": {
    title: "Materialized views",
    fields: [
      {
        name: "views",
        label: "Materialized views",
        type: "textarea",
        placeholder:
          "Needs, refresh frequency, sources...",
      },
      {
        name: "maintenance",
        label: "Maintenance",
        type: "textarea",
        placeholder:
          "Rebuild, monitoring, invalidation strategy...",
      },
    ],
  },
  "4.2.6": {
    title: "Map/Reduce",
    fields: [
      {
        name: "useCases",
        label: "Use cases",
        type: "textarea",
        placeholder:
          "Why Map/Reduce, alternatives (aggregation pipeline)...",
      },
      {
        name: "implementation",
        label: "Implementation",
        type: "textarea",
        placeholder:
          "Inputs/outputs, performance, limitations...",
      },
    ],
  },
  "4.3": {
    title: "Class diagram",
    fields: [
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
    ],
    supportsAssets: true,
  },
  "4.4": {
    title: "Sequence diagram",
    fields: [
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
    ],
    supportsAssets: true,
  },
  "5.1": {
    title: "Security & privacy (GDPR)",
    fields: [
      {
        name: "security",
        label: "Security",
        type: "textarea",
      },
      {
        name: "privacy",
        label: "Privacy / GDPR",
        type: "textarea",
      },
    ],
  },
  "5.2": {
    title: "Planning & milestones (Roadmap)",
    fields: [
      {
        name: "milestones",
        label: "Milestones",
        type: "textarea",
        placeholder: "Milestone 1: ...\nMilestone 2: ...",
      },
      {
        name: "timeline",
        label: "Timeline",
        type: "textarea",
      },
    ],
  },
  "5.3": {
    title: "Budget & expected deliverables",
    fields: [
      {
        name: "budget",
        label: "Budget",
        type: "textarea",
      },
      {
        name: "deliverables",
        label: "Deliverables",
        type: "textarea",
      },
    ],
  },
}

export function getSectionFormConfig(
  locale: Locale,
  key: string,
): CdcSectionFormConfig {
  const configs = locale === "en" ? cdcSectionFormConfigsEn : cdcSectionFormConfigsFr
  return (
    configs[key] ?? {
      title: locale === "en" ? "Content" : "Contenu",
      fields: [
        {
          name: "content",
          label: locale === "en" ? "Content" : "Contenu",
          type: "textarea",
        },
      ],
    }
  )
}

export function getCdcSectionTitle(
  locale: Locale,
  key: string,
  fallbackTitle?: string,
) {
  if (key === "I") return locale === "en" ? "Project overview" : "Présentation du projet"
  if (key === "II")
    return locale === "en"
      ? "Information architecture"
      : "Architecture de l’information"
  if (key === "III") return locale === "en" ? "Functional specifications" : "Spécification fonctionnelles"
  if (key === "IV")
    return locale === "en"
      ? "Technical design & data"
      : "Conception technique et données"
  if (key === "V")
    return locale === "en"
      ? "Constraints and implementation"
      : "Contraintes et mise en œuvre"

  const configs = locale === "en" ? cdcSectionFormConfigsEn : cdcSectionFormConfigsFr
  return configs[key]?.title ?? fallbackTitle ?? key
}
