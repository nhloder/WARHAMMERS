import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

class Cart extends Component {
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
          title: "Fuck outta here Bruh.",
          text: err.response.data.message,
          confirmButtonText: "Continue"
        }).then(result => {
          if (result.value) {
            this.props.history.push("/");
            window.location.reload();
          }
        })
      })
    }


   render() {
      return (
         <div>
            Cart
         </div>
      );
   }
}

export default Cart;