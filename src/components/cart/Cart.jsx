import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import { StripeProvider, Elements } from "react-stripe-elements";
import StripeForm from "./StripeForm";
import "./cart.css";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      userCart: [],
      toggle: false,
      price: 0,
      id:''
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
          userData: res.data[0],
          id:id
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
    axios.get(`/api/cart/${id}`).then((res) => {
      if (res.data.length > 0){

        let sub = res.data.map(val => {
          return val.price;
        })
        .reduce((price1, price2) => price1 + price2, 0)
        this.setState({
          userCart: res.data,
          price: sub
        });
      } else {
        this.setState({
          userCart: res.data,
          price: res.data.price
        })
      }
      });
  }

  total() {
    const { userCart } = this.state;
    const sub = userCart
      .map(val => {
        return val.price;
      })
      .reduce((price1, price2) => price1 + price2, 0)

      return sub
  }

  product(product_id) {
    this.props.history.push(`/one-hammer/${product_id}`);
  }

  removeFromCart(id) {
    axios.delete(`/api/cart/${id}`).then(
      Swal.fire({
        icon: "success",
        title: "removed!",
        confirmButtonText: "Continue",
        timer: 1000,
        timerProgressBar: true
      }).then(result => {
        if (result.value) {
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.timer) {
          window.location.reload();
        }
      })
    );
  }

  clearCart(id) {
    // console.log(id);
    axios.delete(`/api/wholeCart/${id}`).then(
      Swal.fire({
        icon: "success",
        title: "removed!",
        confirmButtonText: "Continue",
        timer: 1500,
        timerProgressBar: true
      }).then(result => {
        if (result.value) {
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.timer) {
          window.location.reload();
        }
      })
    );
  }

  toggler() {
    this.setState({
      toggle: true
    });
  }

  toggleBack() {
    this.setState({
      toggle: false
    });
  }

  render() {
    const { userCart, userData, price } = this.state;
    const cartData = userCart.map(cart => {
      return (
        
        <div key={cart.cart_id}>
          <div className="lowerCart">
            <div className="cart-leftBit">
              <img
                src={cart.img}
                alt="Theres nothing here"
                className="itemImg"
              />
            </div>
            <div className="cart-right">
              <h2>{cart.item_name}</h2>
              <h4>Price: ${cart.price}</h4>
              <p>{cart.description}</p>
              <ul>
                <li>length: {cart.length} in</li>
                <li>Weight: {cart.weight} lbs</li>
                <li>Material:{cart.material}</li>
              </ul>
              <div className="dashButtons">
                <button
                  className="dashBut"
                  onClick={() => this.product(cart.product_id)}
                >
                  More Info
                </button>
                <button
                  className="dashBut"
                  onClick={() => this.removeFromCart(cart.cart_id)}
                >
                  Remove from cart
                </button>
              </div>
            </div>
          </div>
          <hr />
        </div>
      );
    });

    return (
      <>
        <div className="upperCart">
          <div className="cart-leftBit">
            <img
              src={userData.profile_pic}
              alt="no profile"
              className="profile-cart"
            />
            <h1> {userData.username}'s Cart: </h1>
          </div>
          <div className="cart-rightBit">
            <h2>Your total is ${price}</h2>
            <StripeForm 
            name={this.state.userData.username} 
            price={price} 
            id = {this.state.id}
            />
          </div>
        </div>
        <hr />
        <div>{cartData}</div>
        <div className="checkout-buttons">
          <button
            className="checkout"
            onClick={() => this.clearCart(userData.user_id)}
          >
            Clear Cart
          </button>
        </div>
      </>
    );
  }
}
export default Cart;
