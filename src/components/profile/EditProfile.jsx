import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Dropzone from "react-dropzone";
import { GridLoader } from "react-spinners";
import { v4 as randomString } from "uuid";
import "./../style/cssFiles/register.css";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      profile_pic: "",
      about: "",
      isUploading: false,
      oldPic: ''
    };
  }
  componentDidMount() {
    this.getData();
  }

  getData() {
    axios.get(`/api/user/${this.props.match.params.id}`).then(res => {
      this.setState({
        username: res.data[0].username,
        profile_pic: res.data[0].profile_pic,
        about: res.data[0].about
      });
    });
  }

  async ToggleEdit(){
    await this.setState({
      oldPic: this.state.profile_pic
    })
    // console.log(this.state.oldPic);
    this.setState({
      profile_pic: ''
    })
  }

  async nvm(){
    // console.log(this.state.oldPic);
    await this.setState({
      profile_pic:this.state.oldPic
    })

    this.setState({
      oldPic:''
    })
  }

  finalize() {
    const { username, profile_pic, about } = this.state;
    if (
      username &&
      profile_pic &&
      about &&
      profile_pic !== "http://via.placeholder.com/400x300"
    ) {
      axios
        .put(`/api/user/${this.props.match.params.id}`, this.state)
        .then(this.success())
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Whoops!",
            text: err.response.data.message,
            confirmButtonText: "Try again"
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "Must fill out all fields",
        confirmButtonText: "Try again"
      });
    }
  }

  success() {
    Swal.fire({
      icon: "success",
      title: "Changes Saved!",
      text: "You will have to Login Again",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        axios.delete("/api/logout").then(
          this.props.history.push("/login"),
        window.location.reload());
      }
    });
  }

  handleUsername(e) {
    this.setState({
      username: e.target.value
    });
    // console.log(this.state);
  }

  handleAbout(e) {
    this.setState({
      about: e.target.value
    });
  }

  handleImg(url) {
    this.setState({
      profile_pic: url
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
        this.handleImg(url)
      })
      .catch(err => {
        this.setState({
          isUploading: false
        });
        if (err.response.status === 403) {
          alert(
            `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${err.stack}`
          );
        } else {
          alert(`ERROR: ${err.status}\n ${err.stack}`);
        }
      });
  };

  render() {
    const { username, profile_pic, about } = this.state;
    return (
      <div className="register">
        <div className="top">
          <div className="name">
            <p>Username: </p>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={e => this.handleUsername(e)}
            />
          </div>
        </div>
        <br />
        <br />

        <div className="login">
          <span>Changed your mind?</span>
          <br />
          <Link to="/my-profile">
            <button className="loginButton">Cancel</button>
          </Link>
        </div>

        <div className="boxContainer">
          <div className="leftBox">
            <p>Tell us about yourself!</p>
            <textarea
              className="about"
              value={about}
              onChange={e => this.handleAbout(e)}
            />
          </div>

          <div className="rightBox">
            <p>Got a good Picture?</p>

            {this.state.profile_pic ? (
              <div className = 'rightBox'>
              <button className="loginButton" onClick = {() => this.ToggleEdit()}>Change Picture</button>
              <br/>
              <br/>
              <img
              className="newProfilePic"
              src={profile_pic}
              alt="oops, there's nothing here."
            />
            </div>
            ) : (
              <div className="rightbox">
                <button className="loginButton" onClick = {() => this.nvm()}>NeverMind</button>
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
                    </div>
            )}
            
          </div>
        </div>
        <br />
        <button className="registerButton" onClick={() => this.finalize()}>
          Edit Profile
        </button>
      </div>
    );
  }
}

export default EditProfile;

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
