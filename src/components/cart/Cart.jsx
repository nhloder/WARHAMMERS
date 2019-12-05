import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: [],
      userCart: []
    };
  }

  componentDidMount() {
    this.getUser(this.props.match.params.id);
    this.getCart(this.props.match.params.id);
  }

  getUser(id) {
    axios
      .get(`/api/user/${id}`)
      .then(res => {
        this.setState({
          profileData: res.data[0]
        });
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: "Please Log in first",
          text: err.response.data.message,
          confirmButtonText: "Continue"
        }).then(result => {
          if (result.value) {
            this.props.history.push("/");
            window.location.reload();
          }
        });
      });
  }

  getCart(id) {
    axios.get(`/api/cart/${id}`).then(res => {
      console.log(id);
      this.setState({
        userCart: res.data
      });
      console.log(res.data);
    });
  }

  render() {
    return (
      <div>
        <p>hi</p>
      </div>
    );
  }
}

export default Cart;
