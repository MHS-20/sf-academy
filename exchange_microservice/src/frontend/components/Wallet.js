import React from "react";

export default function Wallet(props) {
  return (  
    <div id="wallet-root">
        EU wallet: 
      <input type="text" className="wallet" id="from" readOnly="readOnly" value={props.eu.toFixed(2)}></input>
      <br/>
        USD wallet: 
      <input type="text" className="wallet" id="to" readOnly="readOnly" value={props.usd.toFixed(2)}></input>
    </div>
  );
}