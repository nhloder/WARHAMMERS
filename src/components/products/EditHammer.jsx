import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";

class EditHammer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_name: "",
      price: 0,
      description: "",
      img: "",
      weight: 0,
      length: 0,
      material: ""
    };
  }

  componentDidMount() {
    this.getProduct();
  }

  getProduct() {
    axios.get(`/api/product/${this.props.match.params.id}`).then(res => {
      // console.log(res.data[0]);
      this.setState({
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

  editHammer = () => {
    const {
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material
    } = this.state;
    if (
      item_name &&
      price &&
      description &&
      img &&
      weight &&
      length &&
      material
    ) {
      axios
        .put(`/api/product/${this.props.match.params.id}`, this.state)
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
  };

  success() {
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Thanks for using War-Hammers' R' Us!",
      confirmButtonText: "Continue"
    }).then(result => {
      if (result.value) {
        this.props.history.push("/my-profile");
      }
    });
  }

  handleImg(e) {
    this.setState({
      img: e.target.value
    });
  }

  handleName(e) {
    this.setState({
      item_name: e.target.value
    });
  }

  handlePrice(e) {
    this.setState({
      price: e.target.value
    });
  }

  handleDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleWeight(e) {
    this.setState({
      weight: e.target.value
    });
  }

  handleLength(e) {
    this.setState({
      length: e.target.value
    });
  }

  handleMaterial(e) {
    this.setState({
      material: e.target.value
    });
  }
  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.editHammer();
    }
  };

  onCancel(){
    this.props.history.push('/my-profile')
  }

  render() {
    const {
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material
    } = this.state;

    return (
      <>
        <h1>Edit Hammer #{this.props.match.params.id}</h1>
        <hr />
        <div className="newHammer">
          <div className="left-new">
            <p>
              Product Image:
              <input
                type="text"
                value={img}
                placeholder="Image"
                onChange={e => this.handleImg(e)}
                onKeyPress={this.handleKeyPress}
              />
            </p>
            <img src={img} alt="Nothing here" />
          </div>
          <div className="right-new">
            <p>
              War-Hammer Name:
              <input
                type="text"
                value = {item_name}
                placeholder="Name"
                onChange={e => this.handleName(e)}
              />
            </p>
            <p>
              Price: $
              <input
                type="number"
                value = {price}
                placeholder="Price"
                onChange={e => this.handlePrice(e)}
              />
            </p>
            <p>
              Weight:{" "}
              <input
                type="number"
                value = {weight}
                placeholder="Weight"
                onChange={e => this.handleWeight(e)}
              />
              lbs.
            </p>
            <p>
              Length:{" "}
              <input
                type="number"
                value = {length}
                placeholder="Length"
                onChange={e => this.handleLength(e)}
              />
              in.
            </p>
            <p>
              Material:{" "}
              <input
                type="text"
                value = {material}
                placeholder="Material"
                onChange={e => this.handleMaterial(e)}
              />{" "}
            </p>
            <p>War-Hammer Description:</p>
            <textarea
              placeholder="Description"
              value = {description}
              onChange={e => this.handleDescription(e)}
              onKeyPress = {this.handleKeyPress}
            ></textarea>
          </div>
        </div>
        <div className="new-buttons">
          <button onClick = {() => this.onCancel()}>Cancel</button>
          <button onClick={() => this.editHammer()}>Edit Hammer</button>
        </div>
        
      </>
    );
  }
}

export default EditHammer;
