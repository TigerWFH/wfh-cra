/** @jsxRuntime classic */
import logo from './logo.svg';
import './App.css';
import React, { Profiler } from 'react';
import { io } from 'socket.io-client';
import rrwebPlayer from 'rrweb-player';
import { Replayer } from 'rrweb';
import 'rrweb-player/dist/style.css';

const helperId = 'helperId';
let player = null;
let userId = 'wfh';

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
  const onShare = () => {
    const socket = io('http://localhost:6789/helpers', {
      query: {
        helperId,
        userId
      }
    });

    socket.on('connect', () => {
      socket.emit(
        'request_sharing',
        {
          userId,
          helperId
        },
        () => {}
      );
    });

    socket.on('active_page', (data, ackFn) => {
      console.log('wfh---active_page', data);
      if (player === null) {
        player = new Replayer([], {
          root: document.querySelector('.helper_player'),
          liveMode: true
        });
        player.startLive();
      }

      ackFn();
    });
    socket.on('user_interact', (data, ackFn) => {
      console.log('user_interact', data);
      const { event } = data;
      if (player !== null) {
        player.addEvent(event);
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Parent />
        <button onClick={onShare}>开始同屏</button>
        <div className="helper_player"></div>
      </header>
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
