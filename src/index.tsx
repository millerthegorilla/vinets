import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Garden from './Vine/Garden';
import * as serviceWorker from './serviceWorker';
import Bark from './media/bark.png';

const styles = {
		display: "none"
} as React.CSSProperties


const garden = new Garden({});

ReactDOM.render(
  <React.StrictMode>
    <Garden />
    <img id="bark" src={Bark} alt="bark" style={styles} onLoad={() => garden.digFlowerBed()} />
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
