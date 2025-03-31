import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AllProvider } from './AllContext';
import { BrowserRouter as Router , Route, Routes} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AllProvider>
    <Router>
      <App/>
    </Router>
    </AllProvider>
  </React.StrictMode>
);

