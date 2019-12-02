import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { updateUserInfo } from "../../dux/reducer";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      password: "",
      userInfo: {}
    };
  }

  async login() {
    await axios
      .post("/api/login", {
        email: this.state.emailInput,
        password: this.state.password
      })
      .then(res => {
        this.props.updateUserInfo(res.data.user);
        this.success();
      })
      .catch(err => {
        Swal.fire(err.response.data.message);
      });
  }

  success() {
    Swal.fire({
      icon: "success",
      title: "Logged in!",
      text: "Welcome back",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        this.props.history.push("/");
        window.location.reload();
      }
    });
  }

  // handleLogin(){
  //   console.log(this.state)
  //   this.setState({
  //     emailInput: "",
  //     password: ""
  //   })
  // }

  handleEmail(e) {
    this.setState({
      emailInput: e.target.value
    });
  }

  handlePass(e) {
    this.setState({
      password: e.target.value
    });
  }
  render() {
    return (
      <div>
        <div className="name/pass">
          <p>Email:</p>
          <input
            type="text"
            onChange={e => this.handleEmail(e)}
            placeholder="E-mail"
          />
          <p>Password:</p>
          <input type="password" onChange={e => this.handlePass(e)} />
          <br/>
          <button onClick={() => this.login()}>Login</button>
          <p>Not a member?</p>
          <Link to="/register">
            <button>Sign Up!</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(null, { updateUserInfo })(Login);
