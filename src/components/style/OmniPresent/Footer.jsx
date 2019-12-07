import React, { Component } from "react";
// import Nav from "./Nav";
import "../cssFiles/footer.css";
import Swal from 'sweetalert2'
import axios from "axios";
import { Link } from "react-router-dom";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      username: ""
    };
  }
  componentDidMount() {
    this.getInfo();
  }
  getInfo() {
    axios.get("/api/userInfo").then(res => {
      this.setState({
        profile: res.data.profile_pic,
        username: res.data.username
      });
      console.log(res.data);
    });
  }

  logout() {
    axios
      .delete("/api/logout")
      .then(this.loggedOut())
  }
  loggedOut() {
    Swal.fire({
      icon: "warning",
      title: "Logged Out.",
      text: "Come Back Soon!",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        window.location.reload();
      }
    });
  }

  render() {
    return (
      <footer>
        <div className="title">
          <img
            className="logo"
            src="http://icons.iconarchive.com/icons/google/noto-emoji-objects/256/62957-hammer-and-pick-icon.png"
            alt="oops"
          />
          <h1>WARHAMMERS' R' US</h1>
        </div>
        <nav>
          <Link to="/">
            <button>Home</button>
          </Link>

          <Link to="/my-profile">
            <button>My Profile</button>
          </Link>

          <Link to="/cart">
            <button>Cart</button>
          </Link>

          {!this.state.username ? (
            <Link to="/login">
              <button>Login</button>
            </Link>
          ) : (
            <button onClick={() => this.logout()}>Logout</button>
          )}
        </nav>
      </footer>
    );
  }
}

export default Footer;


// import './../style/cssFiles/stripeForm.css'

// class StripeForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: "",
//       amount: ""
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       let { token } = await this.props.stripe.createToken({
//         name: this.state.name
//       });
//       let amount = this.state.amount;
//       if (amount >= 8) {
//         await fetch("/auth/payment", {
//             method: "POST",
//             headers: {
//               "Content-type": "application/json"
//             },
//             body: JSON.stringify({ token, amount })
//           });
//         this.props.register();
//       } else {
//           Swal.fire({
//               title: "Insufficient Payment. $8 required to access.",
//               icon: 'error'
//           })
//       }
     
//       // redirect, clear inputs, thank alert, toast
      
//     } catch (e) {
//       throw e;
//     }
//   };
//   handleChange = (key, value) => {
//     this.setState({ [key]: value });
//   };

//   do(){
//     console.log('logged');
//   }

//   render() {
//     return (
//       <main className="form-container">
//         <form className="stripe-form" onSubmit={this.handleSubmit}>
//           <h4 className="x" onClick={this.props.registerButton}>
//             X
//           </h4>
//           <img className="by-stripe" src="assets/stripe.png" alt="stripe" />
//           <label>Name</label>
//           <input
//             type="text"
//             className="name-input"
//             value={this.state.name}
//             onChange={e => this.handleChange("name", e.target.value)}
//           />
//           <label>Amount (8 $USD)</label>
//           <input
//             type="text"
//             className="value-input"
//             value={this.state.amount}
//             onChange={e => this.handleChange("amount", e.target.value)}
//           />
//           <label>Card Info</label>
//           <CardElement className="card-element" />
//           <button className="submit-btn">Confirm Payment</button>
//         </form>
//         {this.do()}
//       </main>
//     );
//   }
// }

// export default injectStripe(StripeForm);