import React, {Component}from "react";
import ReactDOM from "react-dom";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import Swal from "sweetalert2";
// import "./styles.css";

function StripeForm(props) {
  const [product, setProducts] = React.useState({
    name: props.name,
    price: 1,
    id: props.id,
    newArr: []
  });

  // function total() {
  //   // const{price, newArr} = this.state

  //   for (let i = 0; i < props.cart.length; i++) {
  //     product.newArr.push(props.cart[i].price);
  //   }
  //   // console.log("new", product.newArr);
  // }
  // function add() {
  //   const { price, newArr } = product;
  //   console.log("here",sum(newArr));
  //   let thing = (sum(newArr))
  //   console.log(thing, 'blah');
    
  //   setProducts({price: thing})
  // }

  // function sum(input) {
  //   if (toString.call(input) !== "[object Array]") return false;

  //   var total = 0;
  //   for (var i = 0; i < input.length; i++) {
  //     if (isNaN(input[i])) {
  //       continue;
  //     }
  //     total += Number(input[i]);
  //   }
  //   return total;
  // }

  async function handleToken(token, addresses) {
    const response = await axios.post("/checkout", { token, product })
    // .then(total()).then(add())
    const { status } = response.data;
    console.log("Response:", response.data);
    console.log(product.price);

    if (status === "success") {
      Swal.fire({ title: "Success! Check email for details", icon: "success" });
    } else {
      Swal.fire({title:"Transaction Failed.", icon: 'error'});
    }
  }

  return (
    <div className="container">
      {/* <div className="product">
        <h1>{props.name}</h1>
        <h3>On Sale · ${props.price}</h3>
      </div> */}
      <StripeCheckout
        stripeKey="pk_test_MJb70FFgAaW092m4tnZi2ueq00fexM1NUc"
        token={handleToken}
        amount={props.price * 100}
        name="WarHammers-r-us"
      />
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);

export default StripeForm;
