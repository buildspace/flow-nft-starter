//importing required libraries
import React, { useState, useEffect } from "react";
import './App.css';
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

// Assets
import twitterLogo from "./assets/twitter-logo.svg";
import splashScreen from "./assets/gto6.webp"

// Contracts 
import { mintNFT } from "./cadence/transactions/mintNFT_tx";
import { getIDs } from "./cadence/scripts/getID_script";
import { getMetadata } from "./cadence/scripts/getMetadata_script";
import { getTotalSupply } from "./cadence/scripts/getTotalSupply_script";

// Constants
const TWITTER_HANDLE = "Atemosta";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// FCL Config
fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "BottomShot", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});

function App() {
  const [ images, setImages ] = useState([])
  // const [network, setNetwork] = useState("");
  const [ user, setUser ] = useState();
  
  // FCL Integration
  const logIn = () => {
    fcl.authenticate();
  };
  const logOut = () => {
      setImages([]);
      fcl.unauthenticate();
  };
  const mint = async() => {

    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`
      })
    } catch(err) {console.log(err)}
    
    const _id = parseInt(_totalSupply) + 1;
    
    try {
      const transactionId = await fcl.mutate({
        cadence: `${mintNFT}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), //address to which the NFT should be minted
          arg("Dundies # "+_id.toString(), types.String), // Name
          arg("Dundies on the blockchain", types.String), // Description
          arg("ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/"+_id+".png", types.String),
          // arg("ipfs://bafkreienxcqmtthsppd5inceh5pcsvy4j37ar5ytxlghlypmpjvpyindmy", types.String), // TODO
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        limit: 99
      })
      console.log("Minting NFT now with transaction ID", transactionId);
      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
      console.log(transaction);
      alert("NFT minted successfully!")
    } catch (error) {
      console.log(error);
      alert("Error minting NFT, please check the console for error details!")
    }
  }

  const fetchNFTs = async () => {
    // Empty the images array
    setImages([]);
    let IDs = [];
    
    // Fetch the IDs with our script (no fees or signers necessary)
    try {
      IDs = await fcl.query({
        cadence: `${getIDs}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), 
        ],
      })
    } catch(err) {
      console.log("No NFTs Owned")
    }
    
    let _imageSrc = []
    try{
      for(let i=0; i<IDs.length; i++) {
        const result = await fcl.query({
          cadence: `${getMetadata}`,
          args: (arg, t) => [
            arg(user.addr, types.Address), 
            arg(IDs[i].toString(), types.UInt64),
          ],
        })
        // If the source is an IPFS link, remove the "ipfs://" prefix
        if (result["thumbnail"].startsWith("ipfs://")) {
          _imageSrc.push(result["thumbnail"].substring(7))
          // Add a gateway prefix
          _imageSrc[i] = "https://nftstorage.link/ipfs/" + _imageSrc[i]
        }
        else {
          _imageSrc.push(result["thumbnail"])
        }
      }
    } catch(err) {
      console.log(err)
    }
    
    if(images.length < _imageSrc.length) {
      setImages((Array.from({length: _imageSrc.length}, (_, i) => i).map((number, index)=>
        <img style={{margin:"10px", height: "150px"}} src={_imageSrc[index]} key={number} alt={"NFT #"+number}
        />
      )))
    }
  }

  // Use Effects
  useEffect(() => {
    // This listens to changes in the user objects
    // and updates the connected user
    fcl.currentUser().subscribe(setUser);
  }, [])

  // Lilico Integration
  // useEffect(()=>{
  //   // This is an event listener for all messages that are sent to the window
  //   window.addEventListener("message", d => {
  //   // This only works for Lilico testnet to mainnet changes
  //     if(d.data.type==='LILICO:NETWORK') setNetwork(d.data.network)
  //   })
  // }, [])

  useEffect(() => {
    if (user && user.addr) {
      fetchNFTs();
    }
  }
  , [user]);

  // const RenderGif = () => {
  //   const gifUrl = user?.addr
  //       ? "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy-downsized.gif"
  //       : "https://i.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.webp";
  //   return <img className="gif-image" src={gifUrl} height="300px" alt="Funny gif"/>;
  // };
  
  // Render Components 
  const RenderLogin = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    );
  };
  const RenderLogout = () => {
    if (user && user.addr) {
      return (
        <div className="logout-container">
          <button className="cta-button logout-btn" onClick={() => logOut()}>
            ❎ {"  "}
            {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
          </button>
        </div>
      );
    }
    return undefined;
  };
  const RenderMintButton = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => mint()}>
          Mint
        </button>
        {images.length > 0 ? 
          <>
            <h2>Your NFTs</h2>
              <div className="image-container">
                {images}
              </ div>
          </> 
        : ""}
      </div>
    );
  }

  return (
    <div className="App">
      <RenderLogout />
      <div className="container">
        <div className="header-container">
          <div className="logo-container">
            {/* <img src="./logo.png" className="flow-logo" alt="flow logo"/> */}
            <p className="header">🚓 Grand Theft Office 🏢</p>
          </div>
          <br/>
          <center>
            <img height="300" width="200" src={splashScreen} alt="grand theft office loading screen"/>
          </center>
          {/* <RenderGif/> */}
          <p className="sub-text">Can you survive the streets of Scranton?</p>
        </div>

        {/* If not logged in, render login button */}
        {user && user.addr ? <RenderMintButton /> : <RenderLogin />}

        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;