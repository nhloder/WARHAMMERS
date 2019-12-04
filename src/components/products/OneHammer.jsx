import React, { Component } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import './../style/cssFiles/oneHammer.css'

class OneHammer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      profile_pic: "",
      item_name: "",
      price: 0,
      description: "",
      img: "",
      weight: 0,
      length: 0,
      material: "",
      commentStuff:[]
    };
  }

  componentDidMount() {
    this.getProduct();
    this.getComments()
  }

getComments(){
  axios.get(`/api/comments/${this.props.match.params.id}`)
  .then(res => {
    console.log(res.data[0]);
    
    this.setState({
      commentStuff:res.data
    })
  })
}

  getProduct() {
    axios.get(`/api/product/${this.props.match.params.id}`).then(res => {
      this.setState({
        username: res.data[0].username,
        profile_pic: res.data[0].profile_pic,
        item_name: res.data[0].item_name,
        price: res.data[0].price,
        description: res.data[0].description,
        img: res.data[0].img,
        weight: res.data[0].weight,
        length: res.data[0].length,
        material: res.data[0].material
      });
    });
  }
  render() {
    const {
      username,
      profile_pic,
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material,
    } = this.state;

    const comments = this.state.commentStuff.map(comment => {
      return(
        <div key = {comment.comment_id}>
        <div className="commentProfileStuff">
          <img src= {comment.profile_pic} alt="oops" className="profilePic"/>
          <h3>{comment.username}</h3>
          <article className="commentContent">{comment.content}</article>
        </div>
        </div>
      )
    })
    return (
      <>
      <br/>
        <div className="topBit">
          <div className="leftBit">
            <div className="profileBit">
              <img className = 'profilePic2' src={profile_pic} alt="theres nothing here" />
              <span className = 'profileName'>{username} </span>
            </div>
            <br />
            <img className = 'itemPic' src={img} alt="theres nothing here" />
          </div>
          <div className="rightBit">
            <h1>{item_name}</h1>
            <h2> ${price} </h2>
      <article> {description} </article>
      <ul className = 'listBit'>
        <li> Weight: {weight} lbs. </li>
        <li> Length: {length} in. </li>
        <li> Material: {material} </li>
      </ul>
          </div>
        </div>
        <div className="buttons">
          <button onClick = {() => this.props.history.goBack()}>Go Back</button>
        </div>
        <div>
          <br/>
          <hr/>
        </div>
        <div className="cancerLand">
          {comments}
        </div>
      </>
    );
  }
}

export default OneHammer;
