db = db.getSiblingDB("spec_builder")

db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

db.cdc.createIndex({ userId: 1, createdAt: -1 })

db["assets.files"].createIndex({ "metadata.userId": 1, uploadDate: -1 })
db["assets.files"].createIndex({ "metadata.cdcId": 1 })
