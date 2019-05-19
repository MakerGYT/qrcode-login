import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import uuidv1 from 'uuid/v1';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';

import { serverUrl, basicUrl } from './config';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: "",
      error: null,
      isLoaded: false,
    }
  }
  componentDidMount() {
    var uuid = uuidv1();
    this.fetchQrCode(uuid, 'login');
    //this.createConnect(uuid);
  }

  createConnect(channel) {
    var url = serverUrl + '?channel=' + channel;
    const socket = (this.socket = io(
      url,
    ))
    socket.on('connect', () => {
      socket.emit('listen', channel, function (res) {
        console.log('client is listening', res);
      });

    });
    socket.on('isScan', (res) => {
      console.log('isScan', res);
      this.setState({
        qrCodeContent: 'scaned'
      });
    });
    socket.on('auth result', (res) => {
      console.log('auth result', res);
      this.setState({
        qrCodeContent: JSON.stringify(res)
      });
      this.disconnectSocket();
    });
    socket.on('expired', () => {
      this.setState({
        qrCodeContent: 'expired'
      });
      this.disconnectSocket();
    });
    socket.on('sys', (msg) => {
      console.log('sys', msg);
    });
  }
  disconnectSocket() {
    this.socket.emit('leave', 'client');
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
  fetchQrCode(uuid, action) {
    var url = serverUrl + 'qrcode';
    fetch(
      url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uuid: uuid,
          action: action
        })
      }
    ).then(res => res.json())
      .then(
        (result) => {
          if (result.code === 1 && result.uuid === uuid) {
            this.setState({
              uuid: result.uuid,
              isLoaded: true,
              qrCodeContent: result.qrCodeContent,
              qrCodeUrl: basicUrl + result.qrCodeContent
            });
            this.createConnect(uuid);
          } else {
            console.log('render error', result);
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
          console.log('fetch error', error);
        }
      )
  }
  refresh = () => {
    if (this.socket) {
      this.socket.emit('leave', 'client');
    }
    var uuid = uuidv1();
    this.fetchQrCode(uuid, 'login');
  }
  render() {
    const { error, isLoaded, uuid, qrCodeUrl, qrCodeContent } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <ul>
            <li>uuid: {uuid}</li>
            <li>qrCodeContent: {qrCodeContent}</li>
            <li>qrCodeUrl: {qrCodeUrl}</li>
            <QRCode size={150} value={qrCodeUrl} />
          </ul>
          <button onClick={this.refresh}>refresh</button>
        </div>
      );
    }
  }
}
function Weapp() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Please use weapp to scan</h2>
      <img src="https://sustcs-cdn.makergyt.com/weapp-qrcode.png" alt="weapp-qrcode" width='50%'
      ></img>
    </div>
  );
}
class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Index} />
        <Route path="/weapp" component={Weapp} />
      </Router>
    );
  }
}

export default App;