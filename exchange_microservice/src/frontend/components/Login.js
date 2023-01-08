import React, { useState } from "react";
import Footer from "../components/Footer";

const { useHistory } = require("react-router-dom");
const { login } = require("../app/client.js");

export default function Login(props) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // let email, password; 
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await login({
      email: props.email,
      password: props.password,
    });

    if (res == null) return;

    var wallet = {
      euw: res.euwallet,
      usdw: res.usdwallet,
    };

    console.log("Risposta ricevuta: " + res.signature);
    console.log("valori iniziali: " + JSON.stringify(wallet));
    console.log("Inizializzaione in login");
    props.initialize(wallet, res.signature);
    history.push("/home");
  };

  return (
    <section id="login-root">
      <h1 className="login">Login</h1>
      <form onSubmit={handleSubmit}>
        <label className="login">Email</label>
        <div>
          <input
            id="email"
            type="text"
            className="login"
            //value={email} ?
            onChange={(e) => props.updateEmail(e.currentTarget.value)}
          />
          <label className="login">Password</label>
          <input
            id="password"
            type="password"
            className="login"
            //value={password}
            onChange={(e) => props.updatePassword(e.currentTarget.value)}
          />
          <button type="submit" className="login">
            Login
          </button>
        </div>
      </form>
      <Footer />
    </section>
  );
}
