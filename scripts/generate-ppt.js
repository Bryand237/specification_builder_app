import fs from "node:fs"
import path from "node:path"
import pptxgen from "pptxgenjs"

function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.5,
    y: 0.6,
    w: 12.3,
    h: 1,
    fontSize: 28,
    bold: true,
    color: "0F172A",
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5,
      y: 1.5,
      w: 12.3,
      h: 0.6,
      fontSize: 14,
      color: "334155",
    })
  }
}

function addBullets(slide, bullets, x, y, w, title) {
  let yt = y
  if (title) {
    slide.addText(title, { x, y: yt, w, h: 0.4, fontSize: 16, bold: true })
    yt += 0.35
  }

  for (const b of bullets) {
    slide.addText(`• ${b}`, {
      x,
      y: yt,
      w,
      h: 0.4,
      fontSize: 12,
      color: "111827",
    })
    yt += 0.25
  }
}

function addCode(slide, code, x, y, w, h, fontSize = 10) {
  slide.addText(code, {
    x,
    y,
    w,
    h,
    fontFace: "Courier New",
    fontSize,
    color: "111827",
    lineSpacingMultiple: 1.0,
    valign: "top",
  })
}

function saveAs(pptx, outPath) {
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath)
  return pptx.writeFile({ fileName: outPath })
}

const deckTitle = "Specifications Builder — Building Process & NoSQL Modeling"
const outPath = path.join(
  process.cwd(),
  "SB_Building_Process_and_NoSQL_Modeling.pptx",
)

const ppt = new pptxgen()
ppt.author = "Specifications Builder"
ppt.title = deckTitle
ppt.subject = "Building process + NoSQL modeling"
ppt.layout = "LAYOUT_WIDE"

// Slide 1 — Title
{
  const slide = ppt.addSlide()
  addTitle(slide, deckTitle, "Sharding • Replica Sets • Vector Timestamps • MapReduce")
  slide.addText(
    "This deck summarizes how the app is built and how the NoSQL model is designed (aggregates-based), with concrete sharding/replication/versioning/querying examples.",
    { x: 0.6, y: 2.2, w: 12.2, h: 1.1, fontSize: 14, color: "334155" },
  )
}

// Slide 2 — “Parfait, Deltes…” intro
{
  const slide = ppt.addSlide()
  addTitle(slide, "Deliverable (input spec)", undefined)
  const msg = `Parfait, Deltes.
Tu veux **toutes les options** — et tu vas les avoir, mais de manière **structurée**, **complète**, **pratique**, et surtout **directement exploitable** pour ton projet Web.

Voici ce que je vais te livrer dans cette réponse :
1) Un schéma UML complet (NoSQL orienté agrégats)
2) Un diagramme d’architecture (sharding, réplication, cohérence, flux applicatif)
3) Des exemples de requêtes MongoDB (CRUD, index, cohérence, versioning)
4) Un plan de configuration MongoDB (replica set, sharding, writeConcern, readConcern)
5) Un exemple de code backend (Node.js)
6) Un exemple MapReduce
7) Une stratégie de versioning (timbres vectoriels)
8) Une stratégie de vues matérialisées
9) Une stratégie de modélisation orientée agrégats
10) Une synthèse finale
`
  addCode(slide, msg, 0.6, 1.6, 12.2, 6.0, 12)
}

// Slide 3 — Building process + features
{
  const slide = ppt.addSlide()
  addTitle(slide, "Building process (how the app was conceived)", undefined)
  addBullets(
    slide,
    [
      "Domain-driven flow: create → edit sections → attach images → save → view as document.",
      "MongoDB-first design: CDC (cahiers) stored as aggregates + section content as nested structures.",
      "GridFS for images/diagrams, linked by metadata (cdcId + sectionKey).",
      "Versioning support: each section update increments CDC version (foundation for vector timestamps).",
      "Professional UI: dashboard shell + sidebar navigation + empty/error/loading states.",
      "Localization: shared i18n dictionary drives UI text across FR/EN.",
    ],
    0.6,
    1.7,
    6.2,
    "App build steps",
  )
  addBullets(
    slide,
    [
      "Auth (NextAuth) protects dashboard and data routes.",
      "Guided editor: sections tree + dynamic fields config per section key.",
      "Read-only viewer: PDF-like rendering with table of contents and section parts.",
      "Assets gallery: search/filter by file name + metadata badges.",
      "CDC CRUD: list + view + edit + delete (confirmation dialog).",
      "API routes implement CRUD securely (per-user ownership).",
    ],
    6.8,
    1.7,
    5.8,
    "Key features",
  )
}

// Slide 4 — UML / aggregates conceptual model
{
  const slide = ppt.addSlide()
  addTitle(slide, "NoSQL conceptual model (UML / aggregates)", undefined)
  const uml = `+------------------+
|      User        |
+-----------------+
| userId (PK)      |
| name             |
| email            |
| passwordHash     |
| createdAt        |
+------------------+
          |
          | 1..*
          |
+---------------------------+
|     CahierDesCharges     |
+---------------------------+
| cdcId (PK)               |
| userId (FK)              |
| title                    |
| description              |
| createdAt                |
| versionStamp (vector)   |
| documents[]              |
+---------------------------+
          |
          | 1..*
          |
+---------------------------+
|         Document          |
+---------------------------+
| docId (PK)               |
| cdcId (FK)               |
| fileName                 |
| url                      |
| size                     |
| mimeType                 |
| versionStamp (vector)    |
| uploadedAt               |
+---------------------------+`
  addCode(slide, uml, 0.6, 1.7, 12.2, 5.8, 12)
}

// Slide 5 — Architecture (sharding + replica sets + consistency)
{
  const slide = ppt.addSlide()
  addTitle(slide, "Architecture (sharding + replica sets + consistency)", undefined)
  const arch = `                   ┌──────────────────────────────┐
                   │        Frontend Web          │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │         API Backend          │
                   │  (Node.js / Next.js routes) │
                   └──────────────┬───────────────┘
                                  │
                                  ▼
         ┌────────────────────────────────────────────────────────┐
         │                    MongoDB Cluster                      │
         │                                                        │
         │   ┌──────────────┐   ┌──────────────┐   ┌────────────┐│
         │   │ Shard 1       │   │ Shard 2       │   │ Shard 3    ││
         │   │ (userId hash) │   │ (userId hash) │   │ (userId..) ││
         │   └──────┬───────┘   └──────┬───────┘   └──────┬─────┘│
         │          │                  │                  │       │
         │   ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐│
         │   │ Replica Set A│  │ Replica Set B│  │ Replica Set C││
         │   │ P — S — S    │  │ P — S — S    │  │ P — S — S   ││
         │   └──────────────┘  └──────────────┘  └─────────────┘│
         └──────────────────────────────────────────────────────────┘

- Sharding: partition by userId (hashed)
- Replica sets: availability + majority consistency
- writeConcern: "majority"
- readConcern: "majority"`
  addCode(slide, arch, 0.6, 1.7, 12.2, 5.8, 11)
}

// Slide 6 — Vector timestamps (vector timbres) strategy
{
  const slide = ppt.addSlide()
  addTitle(slide, "Versioning strategy: vector timestamps (timbres vectoriels)", undefined)
  const v = `For each aggregate (e.g., CDC):
- Maintain a vector clock / stamp per user (or per node / writer).
- On update by user u:
  versionStamp[u] += 1
- Store versionStamp alongside the updated aggregate.

Example:
versionStamp.u123 += 1
versionStamp.u456 += 1

Conflict resolution:
- If A > B in all components => A is causally after B.
- If A and B are incomparable => concurrent updates => conflict to merge or rebase.

Write path:
1) read current aggregate + versionStamp
2) compute next stamp locally
3) PATCH aggregate atomically (server checks ownership/state)
4) persist updated sections + updatedAt`
  addCode(slide, v, 0.6, 1.7, 12.2, 5.8, 11)
}

// Slide 7 — Replica set + sharding plan
{
  const slide = ppt.addSlide()
  addTitle(slide, "MongoDB configuration plan (replica set + sharding)", undefined)
  const plan = `Replica set (3 nodes):
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
});

Sharding:
sh.enableSharding("mydb");
sh.shardCollection("mydb.cdc", { userId: "hashed" });

Consistency:
writeConcern: { w: "majority" }
readConcern: { level: "majority" }
`
  addCode(slide, plan, 0.6, 1.7, 12.2, 5.8, 12)
}

// Slide 8 — MongoDB CRUD / query examples (focus: versioning + indexes)
{
  const slide = ppt.addSlide()
  addTitle(slide, "MongoDB examples (CRUD, indexes, versioning)", undefined)
  const code = `Create user:
db.users.insertOne({
  userId: "u123",
  name: "Martin",
  email: "martin@example.com",
  passwordHash: "...",
  createdAt: new Date()
});

Create CDC aggregate:
db.cdc.insertOne({
  cdcId: "cdc99",
  userId: "u123",
  title: "Site e-commerce",
  description: "Développement complet",
  createdAt: new Date(),
  versionStamp: { u123: 1 },
});

Update CDC with version stamp (concept):
db.cdc.updateOne(
  { _id: cdcId, userId: "u123" },
  { $set: { sections: nextSections, updatedAt: new Date() },
    $inc: { "versionStamp.u123": 1 },
  },
  { writeConcern: { w: "majority" } }
);

Indexes (typical):
db.cdc.createIndex({ userId: 1, updatedAt: -1 });
db.cdc.createIndex({ userId: 1, cdcId: 1 }, { unique: true });
`
  addCode(slide, code, 0.6, 1.7, 12.2, 5.8, 10)
}

// Slide 9 — MapReduce example
{
  const slide = ppt.addSlide()
  addTitle(slide, "MapReduce example (statistics)", undefined)
  const mr = `Goal: count number of CDCs per user.

Map (emit one count per CDC):
function () {
  emit(this.userId, 1);
}

Reduce (sum):
function (key, values) {
  return Array.sum(values);
}

Mongo shell concept:
db.cdc.mapReduce(
  mapFn,
  reduceFn,
  { out: "cdcCountsByUser" }
);
`
  addCode(slide, mr, 0.6, 1.7, 12.2, 5.8, 11)
}

// Slide 10 — Backend sample (Node.js connection + CRUD)
{
  const slide = ppt.addSlide()
  addTitle(slide, "Backend sample (Node.js) — consistency-focused", undefined)
  const node = `MongoClient connection:
const client = new MongoClient(uri, {
  writeConcern: { w: "majority" },
  readConcern: { level: "majority" },
});

CRUD concept (aggregate update):
// PATCH section content:
const res = await db.collection("cdc").updateOne(
  { _id: cdcObjectId, userId },
  { $set: { sections: nextSections, updatedAt: new Date() },
    $inc: { "versionStamp.u123": 1 }
  },
  { writeConcern: { w: "majority" } }
);

// Read with majority:
const doc = await db.collection("cdc")
  .findOne({ _id: cdcObjectId, userId }, { readConcern: { level: "majority" } });
`
  addCode(slide, node, 0.6, 1.7, 12.2, 5.8, 10)
}

// Slide 11 — Materialized views + aggregates summary
{
  const slide = ppt.addSlide()
  addTitle(slide, "Materialized views + aggregates strategy", undefined)
  const mv = `Example materialized view (concept):
{
  "userId": "u123",
  "cdcList": [
    { "cdcId": "cdc99", "title": "Site e-commerce" }
  ]
}

Update strategy: eager (on CDC create/update)
{
  on CDC insert:
    append into cdcList
  on CDC update:
    update title/metadata
}`
  addCode(slide, mv, 0.6, 1.7, 12.2, 2.9, 11)
  addBullets(
    slide,
    [
      "User = independent aggregate (authentication/ownership).",
      "CDC = main aggregate (sections nested as structured content).",
      "Assets/diagrams = stored in GridFS + metadata linked to sectionKey.",
      "Relations via IDs, avoid joins; denormalize for read performance.",
      "Sharding key: userId (hashed) for even distribution.",
    ],
    0.6,
    4.7,
    12.2,
  )
}

// Slide 12 — Final synthesis (guided implementation)
{
  const slide = ppt.addSlide()
  addTitle(slide, "Final synthesis (how to apply it)", undefined)
  addBullets(
    slide,
    [
      "Model in aggregates: User + CDC (with nested sections) + Assets (GridFS).",
      "Sharding: enable sharding, shard by userId hashed on the main aggregate collection.",
      "Replica sets: deploy 3-node replica sets per shard, use majority write/read.",
      "Vector timbres: increment versionStamp on every update, compare stamps for conflicts.",
      "MapReduce: run statistics on CDCs/assets for reporting and analytics.",
      "Materialized views: precompute dashboard lists for fast UI responses.",
      "Backend: enforce per-user ownership at API routes; keep updates atomic per aggregate.",
    ],
    0.7,
    1.8,
    12.0,
  )
}

await saveAs(ppt, outPath)
console.log(`PPTX generated: ${outPath}`)

