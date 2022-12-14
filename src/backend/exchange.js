const utils = require("./utils");

//Exchange service implementation

const exchangesImpl = {
  exchange: async (call, callback) => {
    console.log("Calcolo scambio");
    const { amount, from } = call.request;
    const rate = await utils.getRate(); //get exchange rate (wait for ajax)
    console.log("Tasso di scambio ricevuto: " + rate);

    if (from == "EUR") callback(null, { resValue: amount * rate, rate: rate });
    else callback(null, { resValue: amount / rate, rate: rate });
  },
};

module.exports = { exchangesImpl };