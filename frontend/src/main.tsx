import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/Router/Routes.tsx'
import AuthProvider from './app/context/authProvider.tsx'
import TravelProvider from './app/context/travelProvider.tsx'
import SocketProvider from './app/context/socketProvider.tsx'
import { ChatProvider } from './app/context/chatProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <TravelProvider>
            <RouterProvider router={router}/>   
          </TravelProvider>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)
