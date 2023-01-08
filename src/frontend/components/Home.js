import React, { useState } from 'react';
import Wallet from "./Wallet";
import Filter from "./Filter";
import Footer from "./Footer";
import Operations from "./Operations";
import TransactionsList from "./TransactionsList";
const { deposit, withdraw, buy } = require("../app/client");
const { listTransactions } = require("../app/client");

export default function Home(props) {
  const [currency, setCurrency] = useState("EUR"); //chosen currency
  const [amount, setAmount] = useState("0"); //chosen amount for deposit, withdraw or buy
  const [filter, setFilter] = useState({symbol: "EUR"}); //filter for transaction list
  const [euwallet, setEuWallet] = useState(props.init.euw); //eu wallet value
  const [usdwallet, setUsdWallet] = useState(props.init.usdw); //usd wallete value props.init ? props.init.usdw : 0
  const [rows, setRows] = useState([]);
  let res; 

  //console.log("Props ricevuta:" + JSON.stringify(props)); 
  //console.log("jwt in home: " + props.jwt); 
  //console.log("wallet in home: " + props.init.euw);

  const updateFilter = (date) => {
    //console.log("Data scelta: " + date); 
    setFilter((prev) => ({
      ...prev,
      ...date
    }));
  };
  
  const transactionsHandler = async () => {
    res = await listTransactions({body: filter, authorization: props.jwt});
    if(res != null) {
      res = JSON.parse(res.rows); 
      setRows(res.map(row => Object.values(row)));
    } else setRows([]);
  };

  const buyHandler = async () =>  {
    res = await buy({ amount: amount, from: currency, authorization: props.jwt });
    console.log("Risposta all'acquisto: " +  JSON.stringify(res)); 
    if (res) {
      setEuWallet(res.walleteur);
      setUsdWallet(res.walletusd);
    }
  };

  const depositHandler = async () => {
    res = await deposit({ amount: amount, from: currency, authorization: props.jwt });
    console.log("Risposta al deposito: " + JSON.stringify(res)); 
    if (res != null && currency === "EUR") setEuWallet(res.wallet);
    else setUsdWallet(res.wallet);
  };

  const withdrawHandler = async () => {
    res = await withdraw({ amount: amount, from: currency, authorization: props.jwt });
    console.log("Risposta al ritiro: " +  JSON.stringify(res)); 
    if (res !== null && currency === "EUR") setEuWallet(res.wallet);
    if (res !== null && currency === "USD") setUsdWallet(res.wallet);
  };

  return (
    <div id="home-root">
      <div id="home-head">
        <h3>Welcome to exchange service </h3>
        <p>Exchange EUR for USD and viceversa. </p>
        <Wallet eu={euwallet} usd={usdwallet} />
      </div> 
      <div id="home-filter">
        <Filter updateFilter={updateFilter} />
        <button className="home" onClick={transactionsHandler}>
          Transaction history
        </button>
        </div>
      <div className="home" id="home-operations">
        <Operations
          updateAmount={(amt) => setAmount(amt)}
          updateCurrency={(curr) => setCurrency(curr)}
        />
        <button className="home" onClick={buyHandler}>
          Buy
        </button>
        <button className="home" onClick={depositHandler}>
          Deposit
        </button>
        <button className="home" onClick={withdrawHandler}>
          Withdraw
        </button>
      </div>
      <Footer logout={props.logout}/>
      <br/><br/>
      <nav id="list">{rows.length > 0 ? <TransactionsList rows={rows} />  : "Nessuna transazione trovata"}</nav>   
    </div>
  );
}