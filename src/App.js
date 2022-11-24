//importing required libraries
import React, { useState, useEffect } from "react";
import './App.css';
import twitterLogo from "./assets/twitter-logo.svg";
import splashScreen from "./assets/gto6.webp"

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <div className="logo-container">
            {/* <img src="./logo.png" className="flow-logo" alt="flow logo"/> */}
            <p className="header">🚓 Grand Theft Office 🏢</p>
          </div>
          <br/>
          <center>
            <img height="600" width="400" src={splashScreen} alt="grand theft office loading screen"/>
          </center>
          <p className="sub-text">Can you survive the streets of Scranton?</p>
        </div>

        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;