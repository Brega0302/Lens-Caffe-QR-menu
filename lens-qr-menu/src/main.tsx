import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./globals.css"

/**
 * APPLICATION ENTRY POINT
 *
 * Renders the root React application with BrowserRouter for client-side routing.
 * The app is wrapped in React.StrictMode for development best practices.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
