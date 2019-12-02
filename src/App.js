import React from 'react';
import './App.css';
import routes from './routes'
import Header from './components/style/OmniPresent/Header';
// import Footer from './components/style/OmniPresent/Footer';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      {routes}
      
    </div>
  );
}

export default App;
