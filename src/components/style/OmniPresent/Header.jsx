import React, { Component } from "react";
// import Nav from "./Nav";
import "../cssFiles/header.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      username: "",
      id: 0,
      authenticated: false
    };
  }
  componentDidMount() {
    this.getInfo();
  }
  getInfo() {
    axios.get("/api/userInfo").then(res => {
      this.setState({
        profile: res.data.profile_pic,
        username: res.data.username,
        id: res.data.id,
        authenticated: true
      });
      // console.log(res.data);
    });
  }

  logout() {
    axios.delete("/api/logout").then(this.loggedOut());
  }
  loggedOut() {
    Swal.fire({
      icon: "warning",
      title: "Logged Out.",
      text: "Come Back Soon!",
      confirmButtonText: "Continue",
      timer: 1500,
      timerProgressBar: true
    }).then(result => {
      if (result.value) {
        this.props.history.push("/");
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        this.props.history.push("/");
        window.location.reload();
      }
    });
  }

  holUpProfile() {
    if (this.state.authenticated === true) {
      this.props.history.push(`/my-profile/${this.state.id}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Please Log In First.",
        confirmButtonText: "Continue"
      }).then(result => {
        if (result.value) {
          this.props.history.push("/");
        }
      });
    }
  }

  holUpCart() {
    if (this.state.authenticated === true) {
      this.props.history.push(`/cart/${this.state.id}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Please Log In First.",
        confirmButtonText: "Continue"
      }).then(result => {
        if (result.value) {
          this.props.history.push("/");
        }
      });
    }
  }
  goHome() {
    this.props.history.push("/");
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
          <h1>WARHAMMERS-R-US</h1>

          <Link to="/login">
          <button className="toggle-button" >
            <div className="toggle-button__line" />

            <div className="toggle-button__line" />

            <div className="toggle-button__line" />
          </button>
            </Link>
        </div>
        <nav className="bar">
          <Link to="/">
            <button className="navButtons">Home</button>
          </Link>

          <button className="navButtons" onClick={() => this.holUpProfile()}>
            My Profile
          </button>

          <button className="navButtons" onClick={() => this.holUpCart()}>
            Cart
          </button>

          {!this.state.username ? (
            <Link to="/login">
              <button className="navButtons">Login</button>
            </Link>
          ) : (
            <button onClick={() => this.logout()} className="navButtons">
              Logout
            </button>
          )}
        </nav>
        {this.state.username ? (
          <div className="user">
            <Link to="/my-profile">
              <img
                className="profilePicHead"
                src={this.state.profile}
                alt="oops"
              />
            </Link>
            <p>
              {" "}
              Welcome Back: <br />
              {this.state.username}
            </p>
          </div>
        ) : null}
      </header>
    );
  }
}

export default withRouter(Header);

// alt src = "https://war-hammers-r-us.s3-us-west-1.amazonaws.com/download.jpeg"
