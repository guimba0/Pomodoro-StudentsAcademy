import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'

// 1. Renderiza o App dentro do StrictMode (detecta problemas em desenvolvimento)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
