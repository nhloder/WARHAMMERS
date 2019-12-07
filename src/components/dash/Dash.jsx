import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/cssFiles/dash.css";
// import Footer from "../style/OmniPresent/Footer";

class Dash extends Component {
  constructor() {
    super();
    this.state = {
      inventory: [],
      profileData: [],
      customer_id: 0,
      item_id: 0,
      exists: false
    };
  }

  componentDidMount() {
    this.getAll();
  }

  getAll() {
    axios
      .get("/api/products")
      .then(res => {
        this.setState({
          inventory: res.data
        });
        // console.log(res.data);
      })
      .then(
        axios.get("/api/userInfo").then(res => {
          this.setState({
            profileData: res.data
          });
        })
      );
  }
 //start of add to cart functionality. 
 //note: this is hour 14 of coding today
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
        // console.log(`Don't exist send`);
        this.makeItGo()
      }
    })
    // .then(()=>{
    //   this.setState({exists: false})
    // })
  }

  makeItGo() {
    // console.log("hit!");
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
  // end of add to cart functionality

  profile(seller_id) {
    if (this.state.profileData.id === seller_id) {
      this.props.history.push("/my-profile");
    } else {
      this.props.history.push(`/profile/${seller_id}`);
      axios.get(`/api/user/${seller_id}`);
      // console.log('hit')
    }
  }

  product(product_id) {
    this.props.history.push(`/one-hammer/${product_id}`);
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
              } else if (result.dismiss === Swal.DismissReason.timer) {
                window.location.reload();
              }
            });
          }
        });
      }
    });
  }

  render() {
    const inventoryList = this.state.inventory.map(item => {
      return (
        <div key={item.product_id}>
          <div className="item">
            <div className="left-dash">
              <div className="profile">
                <img
                  className="profilePic"
                  onClick={() => this.profile(item.seller_id)}
                  src={item.profile_pic}
                  alt="no_user"
                />

                <span className="username">{item.username}</span>
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
          <div className="dashButtons">
            <button
              className="dashBut"
              onClick={() => this.product(item.product_id)}
            >
              More Info
            </button>
            <button
              className="dashBut"
              onClick={() => this.addToCart(item.product_id)}
            >
              Add to cart
            </button>
            {this.state.profileData.isAdmin === true ? (
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
    return <div>{inventoryList}</div>;
  }
}

export default Dash;
