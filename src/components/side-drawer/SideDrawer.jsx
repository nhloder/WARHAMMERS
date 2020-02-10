import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import  Swal  from "sweetalert2";
import "./sideDrawer.css";

class SideDrawer extends Component {
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
      })
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
      })
    }
  }

  render() {
    let drawerClasses = "side-drawer";
    if (this.props.show) {
      drawerClasses = "side-drawer open";
    }

    return (
      <div className={drawerClasses}>
        <nav className="drawer-bar">
          <Link to="/">
            <button className="drawer-navButtons">Home</button>
          </Link>

          <button
            className="drawer-navButtons"
            onClick={() => this.holUpProfile()}
          >
            My Profile
          </button>

          <button
            className="drawer-navButtons"
            onClick={() => this.holUpCart()}
          >
            Cart
          </button>

          {!this.state.username ? (
            <Link to="/login">
              <button className="drawer-navButtons">Login</button>
            </Link>
          ) : (
            <button onClick={() => this.logout()} className="drawer-navButtons">
              Logout
            </button>
          )}
        </nav>
        {this.state.username ? (
          <div className="drawer-user">
            <Link to="/my-profile">
              <img
                className="drawer-profilePicHead"
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
      </div>
    );
  }
}

export default SideDrawer;
