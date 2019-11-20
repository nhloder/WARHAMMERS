import React, { Component } from 'react';
import Nav from './Nav';
import '../cssFiles/header.css'

class Header extends Component {
   render() {
      return (
         <header>
            <div className="title">
            <img className = 'logo' src = 'http://icons.iconarchive.com/icons/google/noto-emoji-objects/256/62957-hammer-and-pick-icon.png'  alt = 'oops'/>
            <h1>WARHAMMERS' R' US</h1>
            </div>
            <nav>
            <Nav />
            </nav>
         </header>
      );
   }
}

export default Header;