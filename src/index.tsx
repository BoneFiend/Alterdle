import React from 'react'

import App from '@/App'
import { NextUIProvider } from '@nextui-org/react'
import { createRoot } from 'react-dom/client'

import { AlertProvider } from '@context/AlertContext'
import Theme from '@context/Theme'

import './index.css'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')!

const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <AlertProvider>
        <Theme />
        <App />
      </AlertProvider>
    </NextUIProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
