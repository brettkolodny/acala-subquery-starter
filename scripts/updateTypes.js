const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const { typesBundle, typesAlias } = require("@acala-network/types");

try {
  const doc = yaml.load(fs.readFileSync("./project.yaml", "utf8"));
  doc.network = { ...doc.network, typesAlias, typesBundle };
  fs.writeFileSync(path.join(process.cwd(), "project.yaml"), yaml.dump(doc));
} catch (e) {
  console.log(e);
}
