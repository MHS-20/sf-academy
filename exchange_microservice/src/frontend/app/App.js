import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Access from "../components/Access";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import Home from "../components/Home";

import { Switch } from "react-router-dom";

export default function App() {
  const [initWallet, setInitWallet] = useState({ euw: 0, usdw: 0 });
  const [jwt, setJwt] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [iban, setIban] = useState("");

  const initialize = (wallet, signature) => {
    console.log("Init: " + signature + wallet.euw);
    setJwt(signature);
    setInitWallet({
      euw: wallet.euw,
      usdw: wallet.usdw,
    });
  };

  const logout = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setIban("");
  }

  return (
    <Router>
      <main className="gradient-background">
        <Switch>
          <Route exact path="/">
            <Access />
          </Route>
          <Route path="/sign-up">
            <SignUp
              email={email}
              password={password}
              username={username}
              iban={iban}
              updateName={(name) => setUsername(name)}
              updateEmail={(email) => setEmail(email)}
              updatePassword={(pw) => setPassword(pw)}
              updateIban={(iban) => setIban(iban)}
            />
          </Route>
          <Route path="/login">
            <Login
              email={email}
              password={password}
              initialize={initialize}
              updateEmail={(email) => setEmail(email)}
              updatePassword={(pw) => setPassword(pw)}
            />
          </Route>
          <Route path="/home">
            <Home init={initWallet} jwt={jwt} logout={logout}/>
          </Route>
        </Switch>
      </main>
    </Router>
  );
}
