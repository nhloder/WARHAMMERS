import React, { Component } from "react";
// import Nav from "./Nav";
import "../cssFiles/header.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      username: ""
    };
  }
  componentDidMount() {
    this.getInfo();
  }
  getInfo() {
    axios.get("/api/userInfo").then(res => {
      this.setState({
        profile: res.data.profile_pic,
        username: res.data.username
      });
      // console.log(res.data);
    })
  }

  logout() {
    axios
      .delete("/api/logout")
      .then(this.loggedOut())
  }
  loggedOut() {
    Swal.fire({
      icon: "warning",
      title: "Logged Out.",
      text: "Come Back Soon!",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        window.location.reload();
      }
    });
  }

  render() {
    return (
      <header>
        <div className="title">
          <img
            className="logo"
            src="http://icons.iconarchive.com/icons/google/noto-emoji-objects/256/62957-hammer-and-pick-icon.png"
            alt="oops"
          />
          <h1> WARHAMMERS' R' US </h1>
        </div>
        <nav>
          <Link to="/">
            <button>Home</button>
          </Link>

          <Link to="/my-profile">
            <button>My Profile</button>
          </Link>

          <Link to="/cart">
            <button>Cart</button>
          </Link>

          {!this.state.username ? <Link to="/login">
            <button>Login</button>
          </Link> :
          <button onClick={() => this.logout()}>Logout</button>}
        </nav>
        {this.state.username ? 
        <div className="user">
          <img className="profilepic" src={this.state.profile} alt="oops" />
          <p> Welcome Back: {this.state.username}</p>
        </div>:
        null
      }
      </header>
    );
  }
}

export default Header;

// alt src = "https://war-hammers-r-us.s3-us-west-1.amazonaws.com/download.jpeg"
