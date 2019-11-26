import React, { Component } from "react";
import Nav from "./Nav";
import "../cssFiles/footer.css";
import axios from "axios";
import { Link } from "react-router-dom";

class Footer extends Component {
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
      console.log(res.data);
    });
  }

  logout() {
    axios
      .delete("/api/logout")
      .then(this.props.history.push("/"), window.location.reload());
  }

  render() {
    return (
      <footer>
        <div className="title">
          <img
            className="logo"
            src="http://icons.iconarchive.com/icons/google/noto-emoji-objects/256/62957-hammer-and-pick-icon.png"
            alt="oops"
          />
          <h1>WARHAMMERS' R' US</h1>
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

          {!this.state.username ? (
            <Link to="/login">
              <button>Login</button>
            </Link>
          ) : (
            <button onClick={() => this.logout()}>Logout</button>
          )}
        </nav>
      </footer>
    );
  }
}

export default Footer;
