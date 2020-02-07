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

  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleImg(url) {
    this.setState({
      img:url
    })
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
        
          alert(`ERROR: ${err.status}\n ${err.stack}`);
        
      });
  };

  render() {
    const {
      img,
    } = this.state;
    return (
      <div className = 'newHammerBody'>
        <h1>Add New Hammer</h1>
        <hr />
        <div className="newHammer">
          <div className="left-new">
            <h3>Image:</h3>
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
                  marginTop: 10,
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
                onChange={e => this.handleChange('item_name', e.target.value)}
              />
            </p>
            <p>
              Price: $
              <input
                type="number"
                placeholder="Price"
                onChange={e => this.handleChange('price', e.target.value)}
              />
            </p>
            <p>
              Weight:{" "}
              <input
                type="number"
                placeholder="Weight"
                onChange={e => this.handleChange('weight', e.target.value)}
              />
              lbs.
            </p>
            <p>
              Length:{" "}
              <input
                type="number"
                placeholder="Length"
                onChange={e => this.handleChange('length', e.target.value)}
              />
              in.
            </p>
            <p>
              Material:{" "}
              <input
                type="text"
                placeholder="Material"
                onChange={e => this.handleChange('material', e.target.value)}
              />{" "}
            </p>
            <p>War-Hammer Description:</p>
            <textarea
              placeholder="Description"
              onChange={e => this.handleChange('description', e.target.value)}
              onKeyPress = {this.handleKeyPress}
            ></textarea>
            <br/>
          </div>
        </div>
        <br/>
        <div className="new-buttons">
          <Link to="/my-profile">
            {" "}
            <button>Cancel</button>
          </Link>
          <button onClick={() => this.addHammer()}>Add New Hammer</button>
        </div>
      </div>
    );
  }
}

export default NewHammer;