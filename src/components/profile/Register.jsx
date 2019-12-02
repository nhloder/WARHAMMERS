import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { updateUserInfo } from "../../dux/reducer";
// import Dropzone from "react-dropzone";
// import { GridLoader } from "react-spinners";
// import { v4 as randomString } from "uuid";
import "./../style/cssFiles/register.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      password2: "",
      profile_pic: "http://via.placeholder.com/400x300",
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
      about,
      is_admin
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
        .then(
          axios.post("/api/login", {
            email: email,
            password: password
          })
        )
        .then(res => {
          this.props.updateUserInfo(res.data.user);
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
        this.props.history.push("/my-profile");
      }
    });
  }

  handleUsername(e) {
    this.setState({
      username: e.target.value
    });
    // console.log(this.state);
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handlePassword2(e) {
    this.setState({
      password2: e.target.value
    });
  }

  handleAbout(e) {
    this.setState({
      about: e.target.value
    });
  }

  handleImage(e) {
    this.setState({
      profile_pic: e.target.value
    });
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  render() {
    return (
      <div className="register">
        <div className="top">
          <div className="name">
            <p>Username: </p>
            <input
              type="text"
              placeholder="Username"
              onChange={e => this.handleUsername(e)}
            />
            {/* <br /> */}
            <p>E-mail:</p>
            <input
              type="text"
              placeholder="e-mail"
              onChange={e => this.handleEmail(e)}
            />
          </div>
          <div className="password">
            <p>Password: </p>
            <input
              type="password"
              placeholder="Password"
              onChange={e => this.handlePassword(e)}
            />

            <p>Confirm Password: </p>
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={e => this.handlePassword2(e)}
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
            <p>Tell us about yourself!</p>
            <textarea className="about" onChange={e => this.handleAbout(e)} />
          </div>

          <div className="rightBox">
            <p>Got a good Picture?</p>
            <input
              type="text"
              placeholder="image url"
              onChange={e => this.handleImage(e)}
            />
            <br />
            <br />
            <img
              className="newProfilePic"
              src={this.state.profile_pic}
              alt="oops, there's nothing here."
            />

            {/* <Dropzone
          onDropAccepted={this.getSignedRequest}
          style={{
            position: 'relative',
            width: 200,
            height: 200,
            borderWidth: 7,
            marginTop: 100,
            borderColor: 'rgb(102, 102, 102)',
            borderStyle: 'dashed',
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 28,
          }}
          accept="image/*"
          multiple={false}
          >
          {this.state.isUploading ? <GridLoader /> : <p>Drop File or Click Here</p>}
        </Dropzone> */}
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

export default connect(null, { updateUserInfo })(Register);

// getSignedRequest = ([file]) => {
//   this.setState({ isUploading: true });

//   const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

//   axios
//     .get("/sign-s3", {
//       params: {
//         "file-name": fileName,
//         "file-type": file.type
//       }
//     })
//     .then(response => {
//       const { signedRequest, url } = response.data;
//       this.uploadFile(file, signedRequest, url);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// uploadFile = (file, signedRequest, url) => {
//   const options = {
//     headers: {
//       'Content-Type': file.type,
//     },
//   };

//   axios
//     .put(signedRequest, file, options)
//     .then(response => {
//       this.setState({ isUploading: false, url });
//     })
//     .catch(err => {
//       this.setState({
//         isUploading: false,
//       });
//       if (err.response.status === 403) {
//         alert(
//           `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${
//             err.stack
//           }`
//         );
//       } else {
//         alert(`ERROR: ${err.status}\n ${err.stack}`);
//       }
//     });
// };
