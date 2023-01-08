import React from "react";

export default function TransactionsList(props) {
  let rows = props.rows;
  // console.log("Props ricevuta: " + JSON.stringify(rows));     
  //console.log("Props ricevuta: " + rows);
  return (
    <table id="transactions-table">
      <tr>
        <td>Code</td>
        <td>Date</td>
        <td>EUR Amount</td>
        <td>USD Amount</td>
        <td>Starting Currency</td>
      </tr>
      {rows.map((row, index) => <tr key={index}>{row.map((item, index) => <td key={index}>{item}</td>)}</tr>)}
      </table>
  );
  
}