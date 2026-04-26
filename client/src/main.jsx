// Import React library
import React from 'react';
// Import ReactDOM for rendering React app
import ReactDOM from 'react-dom/client';
// Import main App component
import App from './App.jsx';
// Import global CSS styles
import './index.css';

// Create root element and render App component
// This is the entry point of the React application
ReactDOM.createRoot(document.getElementById('root')).render(
    // StrictMode helps identify potential problems in the application
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
