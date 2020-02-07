import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { v4 as randomString } from 'uuid';
import Dropzone from 'react-dropzone';
import { GridLoader } from 'react-spinners';

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
      material: "",
      oldPic:''
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

  handleImg(url) {
    this.setState({
      img: url
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

  async ToggleEdit(){
    await this.setState({
      oldPic: this.state.img
    })
    // console.log(this.state.oldPic);
    this.setState({
      img: ''
    })
  }

  async nvm(){
    // console.log(this.state.oldPic);
    await this.setState({
      img:this.state.oldPic
    })

    this.setState({
      oldPic:''
    })
  }

  getSignedRequest = ([file]) => {
    this.setState({ isUploading: true });

    const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

    axios
      .get("/sign-s3", {
        params: {
          "file-name": fileName,
          "file-type": file.type
        }
      })
      .then(response => {
        const { signedRequest, url } = response.data;
        this.uploadFile(file, signedRequest, url);
        
      })
      .catch(err => {
        console.log(err);
      });
  };

  uploadFile = (file, signedRequest, url) => {
    const options = {
      headers: {
        "Content-Type": file.type
      }
    };

    axios
      .put(signedRequest, file, options)
      .then(response => {
        this.setState({ isUploading: false, url });
        this.handleImg(url)
      })
      .catch(err => {
        this.setState({
          isUploading: false
        });
        if (err.response.status === 403) {
          alert(
            `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${err.stack}`
          );
        } else {
          alert(`ERROR: ${err.status}\n ${err.stack}`);
        }
      });
  };

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
            </p>
            {this.state.img ? (
              <div className = 'right-new'>
              <button className="loginButton" onClick = {() => this.ToggleEdit()}>Change Picture</button>
              <br/>
              <br/>
              <img
              className="newProfilePic"
              src={img}
              alt="oops, there's nothing here."
            />
            </div>
            ) : (
              <div className="right-new">
                <button className="loginButton" onClick = {() => this.nvm()}>NeverMind</button>
              <Dropzone
                onDropAccepted={this.getSignedRequest}
                style={{
                  position: "relative",
                  width: 200,
                  height: 200,
                  borderWidth: 7,
                  marginTop: 20,
                  borderColor: "rgb(102, 102, 102)",
                  borderStyle: "dashed",
                  borderRadius: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 28
                }}
                accept="image/*"
                multiple={false}
                >
                {this.state.isUploading ? (
                  <GridLoader />
                  ) : (
                    <p>Drop File or Click Here</p>
                    )}
              </Dropzone>
                    </div>
            )}
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
        <br/>
        <br/>
        <div className="new-buttons">
          <button onClick = {() => this.onCancel()}>Cancel</button>
          <button onClick={() => this.editHammer()}>Edit Hammer</button>
        </div>
        
      </>
    );
  }
}

export default EditHammer;
