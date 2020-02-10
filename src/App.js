import React, { Component } from "react";
import "./App.css";
import routes from "./routes";
import Header from "./components/header-footer/Header";
import Backdrop from "./components/side-drawer/Backdrop.jsx";
import SideDrawer from "./components/side-drawer/SideDrawer";

class App extends Component {
  state = {
    sideDrawerOpen: false
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  render() {
    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <div className="App">
        {/* <link
          href="https://fonts.googleapis.com/css?family=Alfa+Slab+One|Gupter|Indie+Flower|Lora|Permanent+Marker&display=swap"
          rel="stylesheet"
        /> */}

        <header className="App-header">
          <Header drawerClickHandler={this.drawerToggleClickHandler} />
        </header>
        <SideDrawer show={this.state.sideDrawerOpen} click = {this.drawerToggleClickHandler}/>
        {backdrop}

        <div>{routes}</div>
      </div>
    );
  }
}

export default App;
