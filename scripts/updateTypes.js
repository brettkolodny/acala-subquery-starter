const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const { typesBundle, typesAlias } = require("@acala-network/types");
const axios = require("axios");

async function run() {
  try {
    const doc = yaml.load(fs.readFileSync("./project.yaml", "utf8"));
    doc.network = { ...doc.network, typesAlias, typesBundle };
    fs.writeFileSync(path.join(process.cwd(), "project.yaml"), yaml.dump(doc));

    const docEndpoint = doc.network.endpoint;
    const [protocol, endpoint] = docEndpoint.split("://");
    const httpEndpoint = `${
      protocol === "wss" ? "https" : "http"
    }://${endpoint}`;

    const res = await axios.post(httpEndpoint, {
      id: "1",
      jsonrpc: "2.0",
      method: "state_getMetadata",
      params: [],
    });

    const typeData = res.data;

    fs.writeFileSync(
      path.join(process.cwd(), "src", "api-interfaces", "acala.json"),
      JSON.stringify(typeData)
    );
  } catch (e) {
    console.log(e);
  }
}

run();
