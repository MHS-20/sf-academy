import React from "react";
const {useHistory} = require("react-router-dom");

export default function Access() {
  const history = useHistory();

  const signUp = () => {
    history.push("/sign-up");
  };

  const login = () => {
    history.push("/login");
  };

  return (
    <div id="access-root">
      <h3 className="access">Exchange service </h3>
      <p className="access">Access to exchange service </p>
      <button className="access" onClick={signUp}>
        SignUp
      </button>
      <button className="access" onClick={login}>
        Login
      </button>
    </div>
  );
}

/*
  return (
    <div className="access">
        Access to exchange microservice: <br/>
        <NavLink to="/sign-up">Sign Up</NavLink>
        <NavLink to="/login">Login</NavLink>
    </div>
  )
}
 */