import './index.css'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/Authcontext.tsx'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AuthProvider>
    <QueryProvider>
    <App />
    </QueryProvider>
  
  </AuthProvider>
  
  </BrowserRouter>
)
