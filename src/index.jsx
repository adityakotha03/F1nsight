import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import './index.css';

// Global configuration for model-viewer decoders
if (typeof window !== 'undefined') {
  window.ModelViewerElement = window.ModelViewerElement || {};
  window.ModelViewerElement.dracoDecoderLocation = '/decoders/draco/';
  window.ModelViewerElement.meshoptDecoderLocation = '/decoders/meshopt/meshopt_decoder.js';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

