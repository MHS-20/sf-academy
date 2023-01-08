require("isomorphic-fetch");

const responseHandler = async (res) => {
  console.log(res.body);
  //console.log("Body ricevuto " + JSON.stringify(await res.json()));
  if (res.status < 300) {
    return res.json();
  } else {
    alert((await res.json()).details);
    console.log("Errore, body ricevuto: " + JSON.stringify(res, Object.getOwnPropertyNames(res)));
    return null;
  }
};

const client = require("./paths.js")({
  //options create api
  endpoint: `http://localhost:3000`,
  cors: true,
  securityHandlers: {
  },
});

const exchange = (exchangeRequest) => {
  console.log("NEVER CALLED");
  return client
    .exchange(exchangeRequest)
    .then((res) => {
      return responseHandler(res);
    })
    .catch(console.error);
};

const signup = async (signupRequest) => {
  console.log("Client invoca signup: " + JSON.stringify(signupRequest));
  return client
    .signup(signupRequest)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      alert(err.message);
      return null;
    });
};

const login = async (loginRequest) => {
  console.log("Client invoca login: " + JSON.stringify(loginRequest));
  return client
    .login(loginRequest)
    .then((res) => {
      return responseHandler(res);
    })
    .catch((err) => {
      alert(err.message);
      return null;
    });
};

const deposit = async (depositRequest) => {
  console.log("Client invoca deposit: " + JSON.stringify(depositRequest));
  return client
    .deposit(depositRequest)
    .then((res) => {
      return responseHandler(res);
    })
    .catch((err) => {
      alert(err.message);
      return null;
    });
};

const withdraw = async (withdrawRequest) => {
  console.log("Client invoca withdraw: " + JSON.stringify(withdrawRequest));
  return client
    .withdraw(withdrawRequest)
    .then((res) => {
      return responseHandler(res);
    })
    .catch((err) => {
      alert(err);
      return null;
    });
};

const buy = async (buyRequest) => {
  console.log("Client invoca buy: " + JSON.stringify(buyRequest));
  return client
    .buy(buyRequest)
    .then((res) => {
      return responseHandler(res);
    })
    .catch((err) => {
      alert(err.message);
      return null;
    });
};

const listTransactions = async (transactionsRequest) => {
  console.log(
    "Client invoca listTransactions: " + JSON.stringify(transactionsRequest));
  return client
    .listTransactions(transactionsRequest)
    .then((res) => {
      return responseHandler(res);
    })
    .catch((err) => {
      alert(err.message);
      return null;
    });
};

module.exports = {
  exchange,
  signup,
  login,
  deposit,
  withdraw,
  buy,
  listTransactions,
};
