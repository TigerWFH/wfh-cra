/** @jsxRuntime classic */
import logo from './logo.svg';
import './App.css';
import React, { Profiler } from 'react';

let timer = null;
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
  constructor(props) {
    super(props);

    this.state = {
      name: 'default'
    };
  }

  componentDidMount() {
    if (timer === null) {
      timer = setTimeout(() => {
        this.setState({
          name: 'didMount'
        });
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

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

  changeState = () => {
    this.setState({
      name: 'monkey'
    });
  };

  render() {
    return (
      <Profiler id="parent" onRender={this.onRender}>
        <div onClick={this.changeState}>change state</div>
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
      </header>
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
