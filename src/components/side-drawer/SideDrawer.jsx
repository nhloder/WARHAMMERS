import React from 'react'
import Link from 'react-router-dom'

import './SideDrawer.css'

const SideDrawer = props => {
  let drawerClasses = 'side-drawer';
  if (props.show) {
    drawerClasses = 'side-drawer open'
  }

  return (
    <div className={drawerClasses}>
        <nav className="drawer-bar">
          <Link to="/">
            <button className="drawer-navButtons">Home</button>
          </Link>

          <button className="drawer-navButtons" onClick={() => this.holUpProfile()}>
            My Profile
          </button>

          <button className="drawer-navButtons" onClick={() => this.holUpCart()}>
            Cart
          </button>

          {!this.state.username ? (
            <Link to="/login">
              <button className="drawer-navButtons">Login</button>
            </Link>
          ) : (
            <button onClick={() => this.logout()} className="drawer-navButtons">
              Logout
            </button>
          )}
        </nav>
        {this.state.username ? (
          <div className="drawer-user">
            <Link to="/my-profile">
              <img
                className="drawer-profilePicHead"
                src={this.state.profile}
                alt="oops"
              />
            </Link>
            <p>
              {" "}
              Welcome Back: <br />
              {this.state.username}
            </p>
          </div>
        ) : null}
    </div>
  )
}

export default SideDrawer