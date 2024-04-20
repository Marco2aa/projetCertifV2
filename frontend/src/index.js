import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import CryptoContext from './CryptoContext.js';
import 'react-alice-carousel/lib/alice-carousel.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CryptoContext>
      <App />
    </CryptoContext>
);

