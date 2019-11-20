import React, { Component } from 'react';
import Nav from './Nav'
import '../cssFiles/footer.css'
class Footer extends Component {
   render() {
      return (
         <footer>
            <div className="title">
            <img className = 'logo' src = 'http://icons.iconarchive.com/icons/google/noto-emoji-objects/256/62957-hammer-and-pick-icon.png'  alt = 'oops'/>
            <h1>WARHAMMERS' R' US</h1>
            </div>
            <nav>
            <Nav />
            </nav>
         </footer>
      );
   }
}

export default Footer;