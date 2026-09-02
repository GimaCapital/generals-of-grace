import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'


// ✅ React 19 specific mounting
const root = ReactDOM.createRoot(document.getElementById('root'))

// ✅ Use flushSync for React 19 if needed
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

