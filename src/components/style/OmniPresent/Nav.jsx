import React, { Component } from "react";
import { Link } from "react-router-dom";
import Login from "../../profile/Login";

class Nav extends Component {
  render() {
    return (
      <div>
        <Link to="/">
          <button>Home</button>
        </Link>
        
        <Link to="/my-profile">
          <button>My Profile</button>
        </Link>

        <Link to="/cart">
          <button>Cart</button>
        </Link>

        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    );
  }
}

export default Nav;
