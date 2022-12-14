import React from "react";

export default function Wallet(props) {
  return (  
    <div id="wallet-root">
        EU wallet: 
      <input type="text" className="wallet" id="from" readOnly="readOnly" value={props.eu}></input>
      <br/>
        USD wallet: 
      <input type="text" className="wallet" id="to" readOnly="readOnly" value={props.usd}></input>
    </div>
  );
}