import React from "react";
const {useHistory} = require("react-router-dom");

export default function Footer(props) {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const goForward = () => {
    history.goForward();
  };

  const logOut = () => { 
    props.logout(); 
    history.push("/login");
  };

  return (
    <footer>
      {props.logout ? "" : <button className="footer" onClick={goBack}>Back</button>} 
      {props.logout ? "" : <button className="footer" onClick={goForward}>Forward</button>} 
      {props.logout ? <button className="footer" onClick={logOut}>Log out</button> : "" /*only in home*/} 
    </footer>
  );
}