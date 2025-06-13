import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './module/context/UserInfoContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider >

    <App />
    </UserProvider>
  </React.StrictMode>,
)
