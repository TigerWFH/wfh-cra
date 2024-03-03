/** @jsxRuntime classic */
import logo from './logo.svg';
import './App.css';
import React, { Profiler } from 'react';

// Profiler用于测试一个react tree的性能
class Child extends React.Component {
  static whyDidYouRender = true;

  onRender = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log('wfh---profiler---', id, phase, actualDuration);
  };

  render() {
    return (
      <Profiler id="child" onRender={this.onRender}>
        <div>child</div>
      </Profiler>
    );
  }
}

class Parent extends React.Component {
  static whyDidYouRender = true;

  onRender = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log('wfh---profiler---', id, phase, actualDuration);
  };

  render() {
    return (
      <Profiler id="parent" onRender={this.onRender}>
        <Child />
      </Profiler>
    );
  }
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Parent />
        <img src={logo} className="App-logo" alt="logo" />
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
