const { outputFileSync, copyFileSync } = require("fs-extra")
const { join } = require("path")
const fetchOpenApi = require("fetch-openapi")

const YAML = require("yamljs")
const apiDoc = YAML.load(join(__dirname, "../../../apiDoc.yml"))

const generator = fetchOpenApi(apiDoc, {
  preset: "node"
})

outputFileSync(join(__dirname, "./paths.js"), generator, "utf8") //create file
//copyFileSync(join(__dirname, "../src/client.js"), join(__dirname, "../build/client.js"))