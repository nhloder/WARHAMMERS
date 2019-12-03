import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./../style/cssFiles/myProfile.css";
import { Link } from 'react-router-dom';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: [],
      userProducts: []
    };
  }

  componentDidMount() {
    this.getInfo()
    
    
  }

  getInfo() {
    axios
      .get("/api/userInfo")
      .then(res => {
        this.setState({
          profileData: res.data
        });
      }).then(this.getUserProducts())
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

  deleteFn(product_id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove it!'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Are you Really sure?',
          text: "Make Sure You're looking at the right product!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yeah Im really sure!'
        }).then((result) => {
          if (result.value) {
            axios.delete(`/api/product/${product_id}`).then(res =>
              this.setState({
                userProducts:res.data
              }))
            Swal.fire(
              'Deleted!',
              'Your Hammer has been removed.',
              'success'
            ).then(result => {
              if(result.value){
                window.location.reload()
              }
            })
        console.log(product_id);
        
      }
    })
  }
  
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

                <h2 className= 'username'>{item.username}</h2>
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
            <button className="dashBut">More Info</button>
            <button className="dashBut">Add to cart</button>
            <button className="dashBut">Edit Hammer</button>
            <button className= 'dashBut' onClick={() => this.deleteFn(item.product_id)}>Delete Hammer</button>
          </div>
          <hr />
          <br/>
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
              <Link to = '/edit-profile'>
              <button>Edit Profile</button>
              </Link>
              <Link to = '/new-hammer'>
              <button>Add New Product</button>
              </Link>
            </div>
          </div>
          <div className="right">
            <h1>{profileData.username}</h1>

            <article>{profileData.about}</article>
          </div>
        </div>
        <div>
          <hr />
        </div>
        <div className="lowerStuff">
          {userProducts}
        </div>
      </>
    );
  }
}

export default Profile;
