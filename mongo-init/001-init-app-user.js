db = db.getSiblingDB("spec_builder");

db.createUser({
  user: "sb_app",
  pwd: "sb_app_password",
  roles: [{ role: "readWrite", db: "spec_builder" }],
});
