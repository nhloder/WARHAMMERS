import React, { Component } from "react";
import axios from "axios";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: []
    };
  }

  getInfo() {
    axios.get("/api/userInfo").then(res => {
      this.setState({
        profileData: res.data
      });
    });
  }

  render() {
    return (
      <div>
        <p>my - Profile</p>
      </div>
    );
  }
}

export default Profile;
