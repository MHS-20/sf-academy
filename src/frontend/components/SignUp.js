import React, { useState } from "react";
import Footer from "./Footer";
// import signup from "../app/client";

const { useHistory } = require("react-router-dom");
const { signup } = require("../app/client");

export default function SignUp(props) {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("");
  // const [iban, setIban] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await signup({
      body: {
        email: props.email,
        password: props.password,
        name: props.username,
        iban: props.iban,
      },
    });

    if (res.status === 200) history.push("/login");
  };

  return (
    <section>
      <h1 className="signup">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="signup">Username</label>
          <input
            id="username"
            type="text"
            className="signup"
            //value={username}
            onChange={(e) => props.updateName(e.currentTarget.value)}
          />
          <label className="signup">Email</label>
          <input
            id="email"
            type="text"
            className="signup"
            //value={email}
            onChange={(e) => props.updateEmail(e.currentTarget.value)}
          />
          <label className="signup">Password</label>
          <input
            id="password"
            type="password"
            className="signup"
            //value={password}
            onChange={(e) => props.updatePassword(e.currentTarget.value)}
          />
          <label className="signup">Iban</label>
          <input
            id="iban "
            type="text"
            className="signup"
            //value={iban}
            onChange={(e) => props.updateIban(e.currentTarget.value)}
          />
          <button className="signup" type="submit">
            Sign Up
          </button>
        </div>
      </form>
      <Footer />
    </section>
  );
}
