import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getUser, setUsername } from "../../dux/reducer";
import "./myProfile.css";

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: [],
      userProducts: []
    };
  }

  async componentDidMount() {
    await this.getInfo();
  }

  getInfo() {
    axios
      .get("/api/userInfo")
      .then(res => {
        this.setState({
          profileData: res.data
        });
        this.reduxExample(res.data.username)
      })
    .then(
    this.getUserProducts()
    )
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
    });
  }

  getUserProducts() {
    axios.get(`/api/myProducts`).then(res => {
      this.setState({
        userProducts: res.data
      });
    });
  }

  deleteFn(product_id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!"
    }).then(result => {
      if (result.value) {
        Swal.fire({
          title: "Are you Really sure?",
          text: "Make Sure You're looking at the right product!",
          icon: "warning",
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
            Swal.fire(
              "Deleted!",
              "Your Hammer has been removed.",
              "success"
            ).then(result => {
              if (result.value) {
                window.location.reload();
              }
            });
          }
        });
      }
    });
  }
  editFn = id => {
    this.props.history.push(`/edit-hammer/${id}`);
  };
  editProfileFn = id => {
    this.props.history.push(`/edit-profile/${id}`);
  };

  product(product_id) {
    this.props.history.push(`/one-hammer/${product_id}`);
  }

  reduxExample(username){
    this.props.setUsername(username)
  }

  do(){
    console.log('props', this.props.userInfo.username);
  }
  async addToCart(id) {
    await 
    this.setState({
      customer_id: this.state.profileData.id,
      item_id: id,
      exists:false
    });
    this.doesItExist();
  }

  async doesItExist() {
    const { customer_id, item_id,} = this.state;
    await axios.get(`/api/cart/${customer_id}`).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        if (this.state.exists === false) {
        if (res.data[i].item_id === +item_id) {
          Swal.fire({
            icon: "warning",
            title: "Item Already in Cart!",
            text: `Click on "Cart" in the Navigation bar to access your cart`,
            confirmButtonText: "Continue",
            timer: 3500,
            timerProgressBar: true
          });
          this.setState({
            exists: true
          });
        } else if (res.data[i].item_id !== +item_id) {
          console.log(i, res.data[i].cart_id);
        }
        }
      }
    })
    .then(() => {
      if (this.state.exists === false){
        this.makeItGo()
      }
    })
  }

  makeItGo() {
    console.log("hit!");
    axios
      .post("/api/cart", this.state)
      .then(this.success())
      .catch(err => {
        console.log(err);
      });
  }

  success() {
    Swal.fire({
      icon: "success",
      title: "Added to cart!",
      text: `Click on "Cart" in the Navigation bar to access your cart`,
      confirmButtonText: "Continue",
      timer: 1500,
      timerProgressBar: true
    })
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
            <button
              className="dashBut"
              onClick={() => this.product(item.product_id)}
            >
              More Info
            </button>
            <button className="dashBut" onClick = {() => this.addToCart(item.product_id)}>Add to cart</button>
            <button
              className="dashBut"
              onClick={() => this.editFn(item.product_id)}
            >
              Edit Hammer
            </button>
            <button
              className="dashBut"
              onClick={() => this.deleteFn(item.product_id)}
            >
              Delete Hammer
            </button>
          </div>
          <hr />
          <br />
        </div>
      );
    });
    const { profileData } = this.state;
    return (
      <>
        <div className="upperStuff">
          <div className="left">
            <img className="userImg" src={profileData.profile_pic} alt="oops" />

            <div className="buttons">
              <button onClick={() => this.editProfileFn(profileData.id)}>
                Edit Profile
              </button>

              <Link to="/new-hammer">
                <button>Add New Product</button>
              </Link>
            </div>
          </div>
          <div className="right">
            
            <h1>
              {this.props.userInfo.username}
            </h1>

            <article>{profileData.about}</article>
            {/* <button onClick = {() => this.do()}>thing</button> */}
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
function mapStateToProps(reduxState) {
  return {
    userInfo: reduxState
  };
}

export default connect(mapStateToProps, { getUser, setUsername })(MyProfile);
