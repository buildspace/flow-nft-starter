//importing required libraries
import React, { useState, useEffect } from "react";
import './App.css';
import twitterLogo from "./assets/twitter-logo.svg";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {

  //creating the state variables
  const [ network, setNetwork ] = useState();

  useEffect(()=>{
    //adding an event listener to check for network changes
    //only works for lilico - testnet to mainnet - changes
    window.addEventListener("message", d => {
      if(d.data.type==='LILICO:NETWORK') setNetwork(d.data.network)
    })
  }, [])

  return (
    <div className="App">
      {network === "mainnet" ? alert("You're on Mainnet. Please change it to Testnet") : ""}

      <div className="container">
        <div className="header-container">
          <div className="logo-container">
            <img src="./logo.png" className="flow-logo" alt="flow logo"/>
            <p className="header">Flow</p>
          </div>

          <p className="sub-text">Built for the next generation of apps and games</p>
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