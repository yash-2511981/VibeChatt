import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <App />
    <Toaster closeButton/>
  </>
  // </StrictMode>,
)
