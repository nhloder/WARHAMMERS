import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import Swal from "sweetalert2";
// import "./styles.css";

function StripeForm(props) {
  const [product] = React.useState({
    price: props.price
  });

  //   function useEffect(() => {
  //     setProductState(props);
  // }, [props])

  async function handleToken(token, addresses) {
    const response = await axios.post("/checkout", { token, product });
    const { status } = response.data;
    console.log("Response:", response.data);
    console.log("product", product);

    console.log("props", props);

    if (status === "success") {
      Swal.fire({
        title: "Success! Thank you for your purchase.",
        icon: "success"
      }).then(res => {
        if (res.value) {
          axios
            .delete(`/api/wholeCart/${props.id}`)
            .then(window.location.reload());
        }
      });
    } else {
      Swal.fire({ title: "Transaction Failed.", icon: "error" });
    }
  }

  return (
    <div className="container">
      <StripeCheckout
        stripeKey="pk_test_MJb70FFgAaW092m4tnZi2ueq00fexM1NUc"
        token={handleToken}
        amount={props.price * 100}
        name="WarHammers-r-us"
      />
    </div>
  );
}
export default StripeForm;
