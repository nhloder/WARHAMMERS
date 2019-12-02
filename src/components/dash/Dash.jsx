import React, { Component } from "react";
import axios from "axios";
import "../style/cssFiles/dash.css";
// import Footer from "../style/OmniPresent/Footer";

class Dash extends Component {
  constructor() {
    super();
    this.state = {
      inventory: []
    };
  }

  componentDidMount() {
    this.getAll();
  }

  getAll() {
    axios.get("/api/products").then(res => {
      this.setState({
        inventory: res.data
      });
      // console.log(res.data);
    });
  }

  profile(seller_id) {
    this.props.history.push(`/profile/${seller_id}`);
    axios.get(`/api/user/${seller_id}`);
    console.log('hit')
  }

  render() {
    const inventoryList = this.state.inventory.map(item => {
      return (
        <div key={item.product_id}>
          <div className="item">
            <div className="left">
              <div className="profile">
                <img
                  className="profilePic"
                  onClick={() => this.profile(item.seller_id)}
                  src={item.profile_pic}
                  alt="no_user"
                />

                <span className= 'username'>{item.username}</span>
              </div>
              <img className="itemImg" src={item.img} alt="no img" />
            </div>
            <div className="right">
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
          </div>
          <hr />
          <br/>
        </div>
      );
    });
    return (<div>
    {inventoryList}
    
    </div>);
  }
}

export default Dash;
