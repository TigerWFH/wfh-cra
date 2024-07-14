/** @jsxRuntime classic */
import logo from './logo.svg';
import './App.css';
import React, { Profiler } from 'react';
import { io } from 'socket.io-client';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

const helper_id = 'wfh_helper_01';
let player = null;
let userId = null;

const socket = io('http://localhost:6789', {
  query: {
    helperId: 'wfh_helper_01'
  }
});

socket.on('connect', () => {
  console.log('wfh----helper-connect');
  socket.emit('register_helper', helper_id);
  socket.emit('register_helper', helper_id, () => {
    console.log('wfh----register_helper__ack');
  });
  socket.emit('get_user', (usrId) => {
    console.log('wfh---get_user-->', usrId);
    userId = usrId;
  });
});

socket.on('record', (event, ackFn) => {
  if (player) {
    player.addEvent(event);
  } else {
    player = new rrwebPlayer({
      target: document.querySelector('helper_player'), // customizable root element
      props: {
        event
      }
    });
  }
});

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
    socket.emit('start_record');
  };

  return (
    <div className="App">
      <header className="App-header">
        <Parent />
        <button onClick={onShare}>开始同屏</button>
        <div className="helper_player"></div>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
