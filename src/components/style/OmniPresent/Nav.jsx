import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

class Nav extends Component {

  logout(){
    axios.delete('/api/logout')
    .then(
       this.props.history.push('/'),
       window.location.reload()
    )
 }
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
        <button onClick = {() => this.logout()}>Logout</button>
      </div>
    );
  }
}

export default Nav;
