/** @jsxRuntime classic */
import logo from './logo.svg';
import './App.css';
import React from 'react';

class Child extends React.Component {
  static whyDidYouRender = true;

  render() {
    return <div>child</div>;
  }
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Child />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
