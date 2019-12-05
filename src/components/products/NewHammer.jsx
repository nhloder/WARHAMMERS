import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { v4 as randomString } from 'uuid';
import Dropzone from 'react-dropzone';
import { GridLoader } from 'react-spinners';
import "./../style/cssFiles/newHammer.css";

class NewHammer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      item_name: "",
      price: 0,
      description: "",
      img: "",
      weight: "",
      length: "",
      material: "",
      seller_id: false
    };
  }
  componentDidMount() {
    this.getInfo();
  }

  getInfo() {
    axios
      .get("/api/userInfo")
      .then(res => {
        this.setState({
          userInfo: res.data,
          seller_id: res.data.id
        });
        // console.log(this.state.seller_id);
        //! ^^^ this console log stays I need to make sure the seller Id is correct.
      })
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: "something went wrong.",
          text: err.response.data.message,
          confirmButtonText: "Go Back."
        }).then(result => {
          if (result.value) {
            this.props.history.push("/my-profile");
          }
        });
      });
  }

  addHammer = () => {
    const {
      item_name,
      price,
      description,
      img,
      weight,
      length,
      material,
      seller_id
		} = this.state;
		if(
			item_name &&
      price &&
      description &&
      img &&
      weight &&
      length &&
      material &&
      seller_id
		){
			axios.post('/api/product', this.state)
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
	
	success(){
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
    if (event.key === 'Enter') {
      this.addHammer();
    }
  };

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
      // item_name,
      // price,
      // description,
      img,
      // weight,
      // length,
      // material
    } = this.state;
    return (
      <>
        <h1>Add New Hammer</h1>
        <hr />
        <div className="newHammer">
          <div className="left-new">
            <p>Image:</p>
          {this.state.img ? (
              <img src={img} alt="oops" />
            ) : (
              <Dropzone
                onDropAccepted={this.getSignedRequest}
                style={{
                  position: "relative",
                  width: 200,
                  height: 200,
                  borderWidth: 7,
                  marginTop: 100,
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
            )}
            
          </div>
          <div className="right-new">
            <p>
              War-Hammer Name:{" "}
              <input
                type="text"
                placeholder="Name"
                onChange={e => this.handleName(e)}
              />
            </p>
            <p>
              Price: $
              <input
                type="number"
                placeholder="Price"
                onChange={e => this.handlePrice(e)}
              />
            </p>
            <p>
              Weight:{" "}
              <input
                type="number"
                placeholder="Weight"
                onChange={e => this.handleWeight(e)}
              />
              lbs.
            </p>
            <p>
              Length:{" "}
              <input
                type="number"
                placeholder="Length"
                onChange={e => this.handleLength(e)}
              />
              in.
            </p>
            <p>
              Material:{" "}
              <input
                type="text"
                placeholder="Material"
                onChange={e => this.handleMaterial(e)}
              />{" "}
            </p>
            <p>War-Hammer Description:</p>
            <textarea
              placeholder="Description"
              onChange={e => this.handleDescription(e)}
              onKeyPress = {this.handleKeyPress}
            ></textarea>
          </div>
        </div>
        <div className="new-buttons">
          <Link to="/my-profile">
            {" "}
            <button>Cancel</button>
          </Link>
          <button onClick={() => this.addHammer()}>Add New Hammer</button>
        </div>
      </>
    );
  }
}

export default NewHammer;