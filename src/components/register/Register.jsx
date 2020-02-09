import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dropzone from "react-dropzone";
import { GridLoader } from "react-spinners";
import { v4 as randomString } from "uuid";
import "./register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      password2: "",
      profile_pic: "",
      about: "",
      is_admin: false,
      isUploading: false,
      userInfo: {}
    };
  }

  finalize = () => {
    const {
      email,
      username,
      password,
      password2,
      profile_pic,
      about
    } = this.state;
    if (
      email &&
      username &&
      password &&
      password2 &&
      profile_pic &&
      about &&
      password === password2
    ) {
      axios
        .post("/api/user", this.state)
        .then(res => {
          this.success();
        })
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Whoops!",
            text: err.response.data.message,
            confirmButtonText: "Try again"
          });
        });
    } else if (password && password !== password2) {
      Swal.fire({
        icon: "error",
        text: "passwords must match",
        confirmButtonText: "Try again"
      });
    } else if (!email || !username || !password || !password2 || !about) {
      Swal.fire({
        icon: "error",
        text: "Must fill out all fields",
        confirmButtonText: "Try again"
      });
    }
  };

  success() {
    Swal.fire({
      icon: "success",
      title: "Registered!",
      text: "Welcome! Don't forget your password!",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        axios
          .post("/api/login", {
            email: this.state.email,
            password: this.state.password
          })
          .then(this.props.history.push("/"));
      }
    });
  }

  getSignedRequest = ([file]) => {
    this.setState({ isUploading: true });

    const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

    axios
      .get("/sign-s3", {
        params: {
          "file-name": fileName,
          "file-type": file.type
        }
      })
      .then(response => {
        const { signedRequest, url } = response.data;
        this.uploadFile(file, signedRequest, url);
      })
      .catch(err => {
        console.log(err);
      });
  };

  uploadFile = (file, signedRequest, url) => {
    const options = {
      headers: {
        "Content-Type": file.type
      }
    };

    axios
      .put(signedRequest, file, options)
      .then(response => {
        this.setState({ isUploading: false, url });
        this.handleChange("profile_pic", url);
      })
      .catch(err => {
        this.setState({
          isUploading: false
        });
        alert(`ERROR: ${err.status}\n ${err.stack}`);
      });
  };

  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.finalize();
    }
  };

  render() {
    return (
      <div className="register">
        <div className="top">
          <div className="name">
            <p>Username: </p>
            <input
              type="text"
              placeholder="Username"
              onChange={e => this.handleChange("username", e.target.value)}
            />
            <p>E-mail:</p>
            <input
              type="text"
              placeholder="e-mail"
              onChange={e => this.handleChange("email", e.target.value)}
            />
          </div>
          <div className="password">
            <p>Password: </p>
            <input
              type="password"
              placeholder="Password"
              onChange={e => this.handleChange("password", e.target.value)}
            />

            <p>Confirm Password: </p>
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={e => this.handleChange("password2", e.target.value)}
            />
          </div>
        </div>
        <br />
        <br />

        <div className="login">
          <span>Already have an account?</span>
          <br />
          <Link to="/login">
            <button className="loginButton">Login</button>
          </Link>
        </div>

        <div className="boxContainer">
          <div className="leftBox">
            <h3>Tell us about yourself!</h3>
            <textarea
              className="about"
              onChange={e => this.handleChange("about", e.target.value)}
            />
          </div>

          <div className="rightBox">
            <h3>Got a good Picture?</h3>
            {this.state.profile_pic ? (
              <div>
                <br />
                <img
                  className="newProfilePic"
                  src={this.state.profile_pic}
                  alt="oops, there's nothing here."
                />
              </div>
            ) : (
              <Dropzone
                onDropAccepted={this.getSignedRequest}
                style={{
                  position: "relative",
                  width: 200,
                  height: 200,
                  borderWidth: 7,
                  marginTop: 100,
                  borderColor: "rgb(102, 102, 102)",
                  borderStyle: "dashed",
                  borderRadius: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 28
                }}
                accept="image/*"
                multiple={false}
              >
                {this.state.isUploading ? (
                  <GridLoader />
                ) : (
                  <p>Drop File or Click Here</p>
                )}
              </Dropzone>
            )}
          </div>
        </div>
        <br />
        <button className="registerButton" onClick={() => this.finalize()}>
          Register
        </button>
      </div>
    );
  }
}

export default Register;
