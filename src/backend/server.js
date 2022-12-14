require("dotenv").config();

const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const express = require("express");

const bodyParser = require("body-parser");
const autoParser = require("express-query-auto-parse");
const cors = require("cors");

const { queryParser } = require("express-query-parser");
const { join } = require("path");
const { promisify } = require("util");
const { initialize } = require("express-openapi");

//Ports
const { PORT = 80 } = process.env;
const EX_PORT = process.env.EX_PORT; //exchange service port
const USR_PORT = process.env.USR_PORT; //users service port

//Services implementations
const { api } = require("./api.js");
const { exchangesImpl } = require("./exchange.js");
const { usersImpl } = require("./users.js");

//------------
// GRPC SERVER
//------------

//loading proto files
const descriptorEx = grpc.loadPackageDefinition(
  protoLoader.loadSync(join(__dirname, "../proto/exchange.proto"))
);
const descriptorUsr = grpc.loadPackageDefinition(
  protoLoader.loadSync(join(__dirname, "../proto/users.proto"))
);

const server = new grpc.Server();
server.bindAsync = promisify(server.bindAsync);

//exchange bind
server
  .bindAsync(`0.0.0.0:${EX_PORT}`, grpc.ServerCredentials.createInsecure())
  .then(() => {
    server.addService(descriptorEx.exchange.service, exchangesImpl);
    console.log("grpc server started on port %O", EX_PORT);
  })
  .catch(console.log);

//users bind and server start
server
  .bindAsync(`0.0.0.0:${USR_PORT}`, grpc.ServerCredentials.createInsecure())
  .then(() => {
    server.addService(descriptorUsr.users.service, usersImpl);
    server.start();
    console.log("grpc server started on port %O", USR_PORT);
  })
  .catch(console.log);

//----------
// Initializing Api service
//---------

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(autoParser());

app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);
/* */

//api.login({query: {email: "ciro", password: "ciropw"}}, null, null)

initialize({
  app: app,
  errorMiddleware: (err, req, res, next) => {
    res.json(err);
  },
  apiDoc: join(__dirname, "../../apiDoc.yml"),
  dependencies: {
    log: console.log,
  },
  operations: api,
});

app.listen(PORT, () => console.log(`api listening on port: ${PORT}`));
