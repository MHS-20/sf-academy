const jws = require("jws");
const utils = require("./utils");
//Users service implementations

const usersImpl = {
  //-----------
  // Sign up
  //-----------
  signup: async (call, callback) => {
    const { name, email, password, iban } = call.request;
    const hash = await utils.passwordHash(password, 10); //generate hash
    console.log("Chiamata grcp: ");
    console.log("Hash generato: " + hash);

    if (!email || !name || !password || !iban) {
      //check arguments
      return callback(new Error("Missing credential"));
    } else {
      console.log("Inserisco l'utente");
      try {
        //add new user to the DB
        await utils.queryPromise(
          "INSERT INTO users (name, email, password,  iban) VALUES ($1, $2, $3, $4)",
          [name, email, hash, iban]
        );

        //initialize wallet
        await utils.queryPromise("INSERT INTO wallet (email) VALUES ($1)", [
          email,
        ]);
      } catch (err) {
        return callback(err);
      }
      return callback(null, {});
    }
  },

  //-----------
  // Login
  //-----------
  login: async (call, callback) => {
    const { email, password } = call.request;
    let hash;
    console.log("Esecuzione funzione grpc");
    console.log(email, password);

    if (!email || !password) return callback(new Error("Missing credential"));

    //extract hash from the DB
    try {
      hash = (
        await utils.queryPromise(
          "SELECT password FROM users WHERE email = ($1)",
          [email]
        )
      ).rows[0].password;
    } catch (err) {
      return callback(err);
    }

    console.log("Hash letto dal DB:  " + JSON.stringify(hash));

    //compare hashes
    if (!(await utils.comparePasswords(password, hash))) {
      return callback(new Error("Wrong password"));
    } else {
      //generating JWT
      const jwt = jws.sign({
        header: { alg: "HS256" },
        payload: {
          iss: "login in route",
          email: email,
          exp: Date.now() + 3600000, //1h
        },
        secret: process.env.SECRET_KEY,
      });

      console.log("JWT generato: " + jwt);
      const eu_wallet = await utils.getWalletValue(email, "EUR");
      const usd_wallet = await utils.getWalletValue(email, "USD");

      console.log("eur: " + eu_wallet);
      console.log("usd: " + eu_wallet);

      callback(null, {
        signature: jwt,
        euwallet: eu_wallet,
        usdwallet: usd_wallet,
      });
    } //else
  },

  //-----------
  // Deposit
  //-----------
  deposit: async (call, callback) => {
    console.log("Ricevuto in grpc: " + JSON.stringify(call.request));
    // let { value, symbol, jwt } = call.request;
    let { amount, from, jwt } = call.request;
    console.log("From: " + from);
    console.log("Valore ricevuto " + amount);
    const { ver, payload } = utils.verifyJwt(jwt); //check jwt
    console.log("Veirifica del JWT: " + ver);
    if (ver == false) return callback(new Error("Unauthorized"));

    const { email, exp } = await JSON.parse(payload);
    if (exp < Date.now()) return callback(new Error("Session expired"));

    console.log("Payload " + payload);
    console.log("Email dal deposito: " + email);

    let oldvalue = await utils.getWalletValue(email, from); //new wallet value
    console.log("Vecchio valore: " + oldvalue);

    amount += oldvalue;
    let queryText = utils.genQueryText(from); //update db wallet value
    console.log("Nuovo valore: " + amount);

    //updating wallet
    try {
      await utils.queryPromise(queryText, [amount, email]);
      console.log("Valore aggiornato sul DB");
    } catch (err) {
      return callback(err);
    }

    callback(null, { wallet: amount });
  },

  //-----------
  // withdraw
  //-----------
  withdraw: async (call, callback) => {
    let { amount, from, jwt } = call.request;
    const { ver, payload } = utils.verifyJwt(jwt); //check jwt
    if (ver == false) return callback(new Error("Unauthorized"));

    const { email } = await JSON.parse(payload);
    let wallet = await utils.getWalletValue(email, from);
    console.log(email, wallet);
    amount = wallet - amount; //new wallet value
    console.log("Nuovo saldo: " + amount);
    if (amount < 0) return callback(new Error("Not enough money"));

    //updating wallet
    let queryText = utils.genQueryText(from);
    try {
      await utils.queryPromise(queryText, [amount, email]);
      console.log("Valore aggiornato sul DB");
    } catch (err) {
      return callback(err);
    }

    callback(null, { wallet: amount });
  },

  //-----------
  // Buy
  //-----------
  buy: async (call, callback) => {
    // const { value, symbol, jwt, result } = call.request;
    let { amount, from, jwt, result } = call.request;
    console.log("Parametri ricevuti dal grpc: ", amount, from, result);
    const { ver, payload } = utils.verifyJwt(jwt); //check jwt
    if (ver === false) return callback(new Error("Unauthorized"));

    const { email } = await JSON.parse(payload);
    const walleteur = await utils.getWalletValue(email, "EUR"); //extract current value
    const walletusd = await utils.getWalletValue(email, "USD"); //extract current value

    let add, sub;
    let addsymbol, subsymbol;

    //prepararing new values of the wallets
    if (from == "EUR") {
      add = walleteur + amount; //increasing eur wallet
      sub = walletusd - result;
      addsymbol = "EUR";
      subsymbol = "USD";
    } else {
      add = walletusd + amount; //increasing usd wallet
      sub = walleteur - result;
      addsymbol = "USD";
      subsymbol = "EUR";
    }

    //updating list of transactions
    //preparing transaction's values
    let usd_amount, eu_amount;
    if (from == "EUR") {
      eu_amount = amount;
      usd_amount = result;
    } else {
      eu_amount = result;
      usd_amount = amount;
    }

    var today = new Date(Date.now()); 
    console.log(today.toLocaleDateString());

    try {
      //inserting transaction
      let queryText =
        "INSERT INTO transactions (email, date, eu_amount, usd_amount, starting_currency) VALUES ($1, $2, $3, $4, $5)";
      await utils.queryPromise(queryText, [
        email,
        today.toLocaleDateString(),
        eu_amount,
        usd_amount,
        from,
      ]);

      //Updating wallet 1 (add)
      queryText = utils.genQueryText(addsymbol);
      await utils.queryPromise(queryText, [add, email]);

      //Updating wallet 2 (substract)
      queryText = utils.genQueryText(subsymbol);
      await utils.queryPromise(queryText, [sub, email]);
    } catch (err) {
      return callback(err);
    }

    callback(null, {
      resValue: result,
      walleteur: add,
      walletusd: sub,
    });
  },

  //-----------
  // list of Transactions
  //-----------
  listTransactions: async (call, callback) => {
    const { symbol, startDate, endDate, jwt } = call.request;
    const { ver, payload } = utils.verifyJwt(jwt);
    if (ver == false) return callback(new Error("Unauthorized"));
    const { email } = await JSON.parse(payload);

    console.log("Funzione grpc");
    console.log(startDate, endDate, symbol);

    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    console.log(d1,d2);

    //extracting and filtering rows
    try {
      let { rows } = await utils.queryPromise(
        "SELECT code, date, eu_amount, usd_amount, starting_currency FROM transactions WHERE email=$1 ORDER BY code ASC",
        [email]
      );
      console.log("Query: " + JSON.stringify(rows[0].date));
      console.log(rows); 

      if (startDate != null) rows = rows.filter((row) => row.date >= d1);

      if (endDate != null) rows = rows.filter((row) => row.date <= d2);

      if (symbol != null) rows = rows.filter((row) => row.starting_currency === symbol);

        //change date format
        for(var i = 0; i < rows.length; i++)
        rows[i].date = rows[i].date.toLocaleDateString(); 

      console.log("Filtrato: " + JSON.stringify(rows));
      rows = JSON.stringify(rows); 
      callback(null, {rows}); 
    } catch (err) {
      return callback(err);
    }
  },
};

module.exports = { usersImpl };