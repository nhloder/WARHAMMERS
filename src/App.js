import React from "react";
import "./App.css";
import routes from "./routes";
import Header from "./components/header-footer/Header";

function App() {
  return (
    <div className="App">
      <link
        href="https://fonts.googleapis.com/css?family=Alfa+Slab+One|Gupter|Indie+Flower|Lora|Permanent+Marker&display=swap"
        rel="stylesheet"
      />

      <header className="App-header">
        <Header />
      </header>
      <div>{routes}</div>
    </div>
  );
}

export default App;
