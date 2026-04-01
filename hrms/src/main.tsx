import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
//import App from './App.tsx'
//import { RouterProvider } from 'react-router-dom'
//import { Router } from './router'
import { ToastContainer } from 'react-toastify'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { UserProvider } from './context/UserProvider'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
        {/* <RouterProvider router={Router}/> */}
        <AuthProvider>
        <UserProvider>

        <BrowserRouter>
          <App/>
          <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        </BrowserRouter>
        </UserProvider>
        </AuthProvider>

  </StrictMode>
)
