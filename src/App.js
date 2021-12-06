import React from 'react';
import chaosStar from './chaos_star.svg';
import './App.css';
import axios from 'axios';
const crypto = require("crypto");

const host = "https://kaos.pw"

const symbolMap = {
  '0': '!',
  '1': '@',
  '2': '#',
  '3': '$',
  '4': '%',
  '5': '^',
  '6': '&',
  '7': '*',
  '8': '(',
  '9': ')',
  'a': '_',
  'b': '+',
  'c': '-',
  'd': '=',
  'e': '[',
  'f': ']',
}

const randomBit = () => parseInt(crypto.randomBytes(1).toString('hex'), 16) > 127 ? 1 : 0;

const generatePassword = () => {
  let passwordBuild = crypto.randomBytes(10).toString('hex');
  for (let i = 0; i < (passwordBuild.length*.25); i++) {
    passwordBuild += symbolMap[passwordBuild[i]];
  }

  passwordBuild =  passwordBuild.split('').sort(() => 0.5 - randomBit()).join('');

  return passwordBuild;
}

const App = () => {

  let [generatedPassword, setGeneratedPassword] = React.useState('');
  let [passwordTextClassName, setPasswordTextClassName] = React.useState("generated-password-text");
  let [visitorNumber, setVisitorNumber] = React.useState("");

  React.useEffect(() => {
    setGeneratedPassword(generatePassword());
    axios.get(host + "/counter.php").then(response => {
      setVisitorNumber(response.data);
    });
  }, []);

  React.useEffect(() => {
    if (passwordTextClassName.includes('highlighter')) {
      setTimeout(() => {
        setPasswordTextClassName('generated-password-text');
      }, 1000)
    }
  }, [passwordTextClassName]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
  }

  return (
    <div className="App">
      <p className="header-text">
        kaos.pw
      </p>
      <p className="description-text">
        Cryptographically Secure Random Password Generator
      </p>
      <div className="chaos-star-container">
        <img src={chaosStar} className="chaos-star" alt="chaos star" />
      </div>
      <p 
        className={passwordTextClassName} 
        onClick={() => {
          copyToClipboard(generatedPassword);
          setPasswordTextClassName(passwordTextClassName + ' highlighter');
        }}
      >
        { generatedPassword }
      </p>
      <p className={passwordTextClassName} onClick={() => setGeneratedPassword(generatePassword())}>
        regenerate
      </p>
      <div className="page-counter">
        Visitor number: {visitorNumber}
      </div>
    </div>
  );
}

export default App;
