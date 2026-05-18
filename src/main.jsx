import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import App from './App'
import './index.css'
import { AuthProvider } from './NewResellar/Context/MyContext'
import { Toaster } from 'react-hot-toast'

// Create Query Client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a0800', color: '#fff',
                border: '1px solid rgba(249,115,22,0.35)',
                borderRadius: '12px', fontSize: '13px',
              },
              success: { iconTheme: { primary: '#f97316', secondary: '#1a0800' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#1a0800' } },
              loading: { iconTheme: { primary: '#f97316', secondary: '#1a0800' } },
            }}
          />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)