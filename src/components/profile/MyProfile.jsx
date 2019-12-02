import React, { Component } from "react";
import Swal from 'sweetalert2'
import axios from "axios";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: {}
    };
  }

  componentDidMount(){
    this.getInfo()
  }

  getInfo() {
    axios.get("/api/userInfo").then(res => {
      this.setState({
        profileData: res.data
      });
    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "something went wrong.",
        text: err.response.data.message,
        confirmButtonText: "Continue"
      }).then(result => {
        if (result.value) {
          this.props.history.push("/");
        }
      })
    })
  }

  render() {
    const {profileData} = this.state
    return (
      <div>
        <img src = {profileData.profile_pic} alt="oops"/>
      </div>
    );
  }
}

export default Profile;
