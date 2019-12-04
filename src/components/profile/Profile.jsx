import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitorInfo: [],
      userInfo: [],
      userProducts: []
    };
  }
  componentDidMount() {
    this.getInfo();
  }

  getInfo() {
    axios
      .get(`/api/user/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          userInfo: res.data[0]
        });
      })
      .then(this.getProducts())
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
        });
      }).then(
        axios.get("/api/userInfo").then(res => {
          this.setState({
            visitorInfo: res.data
          });
        })
      );
  }

  product(product_id) {
    this.props.history.push(`/one-hammer/${product_id}`);
};

  getProducts() {
    axios.get(`/api/userProducts/${this.props.match.params.id}`).then(res => {
      this.setState({
        userProducts: res.data
      });
    });
  }
  adminDelete(product_id) {
    Swal.fire({
      title: "Are you sure?",
      text: `you're about to delete somebody else's Product!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!"
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "Are you Really sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yeah Im really sure!"
        }).then(result => {
          if (result.value) {
            axios.delete(`/api/product/${product_id}`).then(res =>
              this.setState({
                userProducts: res.data
              })
            );
            Swal.fire({
              title: "Deleted!",
              message: "Your Hammer has been removed.",
              icon: "success",
              timer: 1500,
              timerProgressBar: true
            }).then(result => {
              if (result.value) {
                window.location.reload();
              } else if (result.dismiss === Swal.DismissReason.timer){
                window.location.reload();
              }
            });
          }
        });
      }
    });
  }

  render() {
    const userProducts = this.state.userProducts.map(item => {
      return (
        <div key={item.product_id}>
          <div className="item">
            <div className="left-dash">
              <div className="profile">
                <img
                  className="profilePic"
                  src={item.profile_pic}
                  alt="no_user"
                />

                <h2 className="username">{item.username}</h2>
              </div>
              <img className="itemImg" src={item.img} alt="no img" />
            </div>
            <div className="right-dash">
              <h2>{item.item_name}.</h2>
              <h3>${item.price}</h3>
              <p>{item.description}</p>
              <ul>
                <li>length: {item.length} in</li>
                <li>Weight: {item.weight} lbs</li>
                <li>Material:{item.material}</li>
              </ul>
            </div>
            <br />
          </div>
          <div className="buttons">
            <button className="dashBut" onClick = {() => this.product(item.product_id)}>More Info</button>
            <button className="dashBut">Add to cart</button>
            {this.state.visitorInfo.isAdmin === true ? (
              <button
                className="adminButt"
                onClick={() => this.adminDelete(item.product_id)}
              >
                Admin Delete
              </button>
            ) : null}
          </div>
          <hr />
          <br />
        </div>
      );
    });
    const { userInfo } = this.state;
    return (
      <>
        <div className="upperStuff">
          <div className="left">
            <img className="userImg" src={userInfo.profile_pic} alt="oops" />
            <div className="buttons">
              <Link to="/edit-profile">
                <button>Edit Profile</button>
              </Link>
              <Link to="/new-hammer">
                <button>Add New Product</button>
              </Link>
            </div>
          </div>
          <div className="right">
            <h1>{userInfo.username}</h1>

            <article>{userInfo.about}</article>
          </div>
        </div>
        <div>
          <hr />
        </div>
        <div className="lowerStuff">{userProducts}</div>
      </>
    );
  }
}

export default Profile;
