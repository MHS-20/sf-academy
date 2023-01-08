import React from "react";

export default function Operations(props) {
  return (
    <div id="operations-root">
      <br />
      <label className="operations">Currency: </label>
      <select
        className="operations"
        id="currency"
        onChange={(e) => props.updateCurrency(e.currentTarget.value)}>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <br />
      <label className="operations">Amount: </label>
      <input
        type="text"
        id="amount"
        className="operations"
        onChange={(e) => props.updateAmount(e.currentTarget.value)}
      ></input>
      <br />
    </div>
  );
}
