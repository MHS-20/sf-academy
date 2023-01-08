import React from "react";

export default function Filter(props) {
  return (
    <div id="filter-root">
      <label className="filter">Filter transactions:</label>
      <br />
      <form>
      <label className="filter">From:</label>
        <input
          type="date"
          className="filter"
          id="start"
          onChange={({currentTarget}) => {
            const value = currentTarget.value; 
            console.log(value); 
            props.updateFilter({startDate: value}); 
          }}
        />
        <br />
        <label className="filter">To:</label>
        <input
          type="date"
          id="end"
          className="filter"
          onChange={({currentTarget}) => {
            const value = currentTarget.value; 
            console.log(value); 
            props.updateFilter({endDate: value})}}
        />
        <br />
        <label className="filter">Starting currency:</label>
        <select
          id="currency"
          className="filter"
          onChange={({currentTarget}) => {
            const value = currentTarget.value; 
            console.log(value); 
            props.updateFilter({symbol: value})}}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </form>
    </div>
  );
}
