import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./oneHammer.css";

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
      seller_id: "",
      commentStuff: [],
      profileData: [],
      toggleAdd: false,
      commenter_id: 0,
      comment_location_id: 0,
      content: ""
    };
  }

  componentDidMount() {
    this.getProduct();
  }

  getProduct() {
    axios
      .get(`/api/product/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          seller_id: res.data[0].seller_id,
          username: res.data[0].username,
          profile_pic: res.data[0].profile_pic,
          item_name: res.data[0].item_name,
          price: res.data[0].price,
          description: res.data[0].description,
          img: res.data[0].img,
          weight: res.data[0].weight,
          length: res.data[0].length,
          material: res.data[0].material,
          comment_location_id: this.props.match.params.id
        });
      })
      .then(
        axios.get("/api/userInfo").then(res => {
          this.setState({
            profileData: res.data,
            commenter_id: res.data.id
          });
        })
      )
      .then(
        axios.get(`/api/comments/${this.props.match.params.id}`).then(res => {
          this.setState({
            commentStuff: res.data
          });
        })
      );
  }

  profile(seller_id) {
    if (this.state.profileData.id === seller_id) {
      this.props.history.push("/my-profile");
    } else {
      this.props.history.push(`/profile/${seller_id}`);
      axios.get(`/api/user/${seller_id}`);
    }
  }

  commenterProfile(cId) {
    if (this.state.profileData.id === cId) {
      this.props.history.push("/my-profile");
    } else {
      this.props.history.push(`/profile/${cId}`);
      axios.get(`/api/user/${cId}`);
    }
  }

  success() {
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "comment posted!",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        window.location.reload();
      }
    });
  }

  addComment() {
    const { comment_location_id, commenter_id, content } = this.state;

    if (comment_location_id && commenter_id && content) {
      axios
        .post(`/api/comment`, this.state)
        .then(this.success())
        .catch(err => {
          Swal.fire({
            icon: "error",
            title: "Whoops!",
            text: err.response.data.message,
            confirmButtonText: "Try again"
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "Must fill out all fields",
        confirmButtonText: "Try again"
      });
    }
  }

  toggler() {
    if (this.state.profileData.id) {
      this.setState({
        toggleAdd: !this.state.toggleAdd
      });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Please log in first",
        confirmButtonText: "OK"
      });
    }
    console.log(
      "location",
      this.state.comment_location_id,
      "commenter id",
      this.state.commenter_id
    );
  }

  handleContent(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.addComment();
    }
  };

  adminDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: `you're about to delete somebody else's comment!`,
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
            axios.delete(`/api/comment/${id}`).then(res =>
              this.setState({
                commentStuff: res.data
              })
            );
            Swal.fire({
              title: "Deleted!",
              message: "This comment has been removed.",
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

  userDelete(id){
    Swal.fire({
      title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yeah Im really sure!"
    }).then(result => {
      if (result.value){
        axios.delete(`/api/comment/${id}`).then(res =>
          this.setState({
            commentStuff: res.data
          })
        ).then(window.location.reload());
      }
    })
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
      material
    } = this.state;

    const comments = this.state.commentStuff.map(comment => {
      return (
        <div key={comment.comment_id}>
          <div className="commentsSection">
            <div className="commentProfileStuff">
              <img
                src={comment.profile_pic}
                alt="oops"
                className="profilePic"
                onClick={() => this.commenterProfile(comment.commenter_id)}
              />
              <h3>{comment.username}</h3>
              <br />
            </div>
            <div className="commentBox">
              <article className="commentContent">{comment.content}</article>
            </div>
          </div>

          {this.state.profileData.isAdmin === true && comment.commenter_id !== this.state.profileData.id? (
            <div className="adminButtContainer">
              <button
                className="adminButt"
                onClick={() => this.adminDelete(comment.comment_id)}
              >
                {" "}
                Admin Delete{" "}
              </button>
            </div>
          ) : null}

          {comment.commenter_id === this.state.profileData.id ? 
          <div className="buttons">
            <button onClick = {() => this.userDelete(comment.comment_id)}>Delete Comment</button>
          </div>
          : null
          }
          <br />
          <hr />
        </div>
      );
    });

    return (
      <>
        <br />
        <div className="topBit">
          <div className="leftBit">
            <div className="profileBit">
              <img
                className="profilePic"
                src={profile_pic}
                alt="theres nothing here"
                onClick={() => this.profile(this.state.seller_id)}
              />
              <span className="profileName">{username} </span>
            </div>
            <br />
            <img className="itemPic" src={img} alt="theres nothing here" />
          </div>
          <div className="rightBit">
            <h1>{item_name}</h1>
            <h2> ${price} </h2>
            <article> {description} </article>
            <ul className="listBit">
              <li> Weight: {weight} lbs. </li>
              <li> Length: {length} in. </li>
              <li> Material: {material} </li>
            </ul>
          </div>
        </div>
        <div className="buttons">
          <button onClick={() => this.props.history.goBack()}>Go Back</button>
        </div>
        <div>
          <br />
          <hr />
        </div>
        {comments}
        <div className="addComment">
          {!this.state.toggleAdd ? (
            <button onClick={() => this.toggler()}>Add Comment</button>
          ) : (
            <div className="commentPoster">
              <h3>What would you like to say?</h3>
              <br />
              <textarea
                placeholder="Type out your comment here."
                onChange={e => this.handleContent(e)}
                onKeyPress={this.handleKeyPress}
              />
              <br />
              <div>
                <button onClick={() => this.addComment()}>Add Comment</button>
              </div>
        <br/><br/><br/>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default OneHammer;
