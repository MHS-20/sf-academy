require("dotenv").config();

//API service implementation

const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { join } = require("path");
const { setTimeout } = require("timers/promises");

const { PORT = 80 } = process.env;
const EX_PORT = process.env.EX_PORT;
const USR_PORT = process.env.USR_PORT;

const loaderOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

//loading proto files
const descriptorEx = grpc.loadPackageDefinition(
  protoLoader.loadSync(
    join(__dirname, "../proto/exchange.proto"),
    loaderOptions
  )
);
const descriptorUsr = grpc.loadPackageDefinition(
  protoLoader.loadSync(join(__dirname, "../proto/users.proto"), loaderOptions)
);

//grpc Clients
const grpcClientExchange = new descriptorEx.exchange(
  `0.0.0.0:${EX_PORT}`,
  grpc.credentials.createInsecure()
);
const grpcClientUsers = new descriptorUsr.users(
  `0.0.0.0:${USR_PORT}`,
  grpc.credentials.createInsecure()
);

//----------
//Api Implementations
//Just sorting out on other services
//----------

const api = {
  exchange: (req, res, next) => {
    const { amount, from, to } = req.body;
    console.log("NEVER CALLED");
    grpcClientExchange.exchange({ amount, from, to }, (err, data) => {
      if (err) res.json(err);
      else res.status(200).json(data);
    });
  },

  //-----------
  // sign up
  //-----------
  signup: (req, res, next) => {
    //POST
    console.log("\n\nEsecuzione di signup: ");
    console.log("Ricevuto: " + req.method);
    console.log(JSON.stringify(req.body));
    console.log(req.body);
    //console.log(JSON.stringify(req.headers));
    console.log("Questo è l'email " + req.body.email);
    const { name, email, password, iban } = req.body;
    grpcClientUsers.signup({ email, password, name, iban }, (err, data) => {
      if (err) res.status(400).json(err);
      else res.status(200).json(data);
    });
  },

  //-----------
  // login
  //-----------
  login: (req, res, next) => {
    //GET
    console.log("\n\nEsecuzione di login: ");
    console.log("Ricevuto: " + req.method);
    console.log(JSON.stringify(req.query));
    //const { email, password } = req.query;
    const email = req.query.email;
    const password = req.query.password;
    // console.log(email, password);

    grpcClientUsers.login({ email, password }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json(err);
      } else {
        console.log("Invio risposta: " + JSON.stringify(data));
        res.status(200).json(data);
      }
    });
  },

  //-----------
  // Deposit
  //-----------
  deposit: (req, res, next) => {
    //GET
    const { amount, from } = req.query;
    console.log("\n\nEsecuzione di deposit: ");
    console.log(amount, from);
    console.log(JSON.stringify(req.query));

    const jwt = req.headers.authorization;
    console.log("JWT da header: " + jwt);
    grpcClientUsers.deposit(
      { amount: amount, from: from, jwt: jwt },
      (err, data) => {
        if (err) res.status(401).json(err);
        else res.status(200).json(data);
      }
    );
  },

  //-----------
  // Withdraw
  //-----------

  withdraw: (req, res, next) => {
    //GET
    const { amount, from } = req.query;
    console.log("\n\nEsecuzione di withdraw: ");
    console.log(amount, from);
    console.log(JSON.stringify(req.query));
    const jwt = req.headers.authorization;
    grpcClientUsers.withdraw({ amount, from, jwt }, (err, data) => {
      if (err) res.status(401).json(err);
      else res.status(200).json(data);
    });
  },

  //-----------
  // buy
  //-----------
  buy: async (req, res, next) => {
    //GET
    const { amount, from } = req.query;
    const jwt = req.headers.authorization;

    console.log("\n\nEsecuzione di buy: ");
    console.log(JSON.stringify(req.query));
    console.log(amount, from);

    /*
    await grpcClientExchange.exchange({amount, from}, (err, data) => {
      if (err) res.status(400).json(err);
      else result = data; 
      console.log("Termine esecuzione exchange");
    });
    */

    let {result} = await new Promise((resolve, reject) => {
      grpcClientExchange.exchange({ amount, from }, (err, data) => {
        if (err) reject(res.status(400).json(err));
        else resolve(data);
        console.log("Conversione di valuta eseguita con successo");
      });
    });

    //await setTimeout(3000, 0);
    console.log("Risultato dello scambio: " + JSON.stringify(result));

    grpcClientUsers.buy({ amount, from, jwt, result }, (err, data) => {
      if (err) res.status(401).json(err);
      else res.status(200).json(data);
      console.log("Termine esecuzione buy");
    });
  },

  //-----------
  // listTransactions
  //-----------
  listTransactions: (req, res, next) => {
    //POST
    console.log("\n\nEsecuzione di listTransactions: ");
    const {symbol, startDate, endDate}  = req.body; 
    console.log(symbol, startDate, endDate); 
    const jwt = req.headers.authorization;
    grpcClientUsers.listTransactions({symbol, startDate, endDate, jwt }, (err, data) => {
      if (err) res.status(401).json(err);
      else res.status(200).json(data);
    });
  },
}; //api

module.exports = {
  api,
};
