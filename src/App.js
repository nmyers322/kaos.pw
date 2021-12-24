import React from 'react';
import './App.css';
import axios from 'axios';

const passwordLength = 10;
const symbolRatio = .2;
const numberRatio = .2;
const symbolLength = Math.floor(passwordLength*symbolRatio);
const numberLength = Math.floor(passwordLength*numberRatio);

const host = "https://kaos.pw"

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const symbols = "!@#$^&*-_=+<>?";

const randomBit = () => window.crypto.getRandomValues(new Uint8Array(1)) < 128 ? 0 : 1;

const random0To = (max) => {
  let result = 0;
  for (let i = 0; i < max; i++) {
    result += randomBit();
  }
  return result;
}

const generatePassword = () => {
  let result = "", i = 0;
  
  for (i = 0; i < (passwordLength - (symbolLength + numberLength)); i++) {
    result += letters[random0To(letters.length-1)];
  }

  for (i = 0; i < symbolLength; i++) {
    result += symbols[random0To(symbols.length-1)];
  }

  for (i = 0; i < numberLength; i++) {
    result += random0To(9).toString();
  }

  result =  result.split('').sort(() => 0.5 - randomBit()).join('');

  return result;
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
        <a href="https://w3c.github.io/webcrypto/#Crypto-method-getRandomValues">Cryptographically Secure</a> Random Password Generator
      </p>
      <p 
        className={passwordTextClassName} 
        onClick={() => {
          copyToClipboard(generatedPassword);
          setPasswordTextClassName(passwordTextClassName + ' highlighter');
        }}
      >
        { generatedPassword }
      </p>
      <p className="regenerate-button" onClick={() => setGeneratedPassword(generatePassword())}>
        &#8635; Regenerate
      </p>
      <div className="page-counter">
        Visitor number: {visitorNumber}
      </div>
    </div>
  );
}

export default App;
