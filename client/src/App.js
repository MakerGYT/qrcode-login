import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import QRCode from 'qrcode.react';
import { basicUrl } from './config';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      uuid: "",
      key: "",
      error: null,
      isLoaded: false,
    }
  }
  
  componentDidMount(){
    var uuid = uuidv1();
    var url = basicUrl + '?uuid=' + uuid;
    fetch(
      url,{
        mode: 'cors'
      }
    )
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            uuid: uuid,
            key: result.key
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            uuid: uuid,
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, key } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
       <div>
       <ul>
          <li>UUID: {this.state.uuid}</li>
          <li>KEY: {this.state.key}</li>
        </ul>
          <QRCode size={150} value={key}/> 
        </div>
      );
    }
  }
}

export default App;