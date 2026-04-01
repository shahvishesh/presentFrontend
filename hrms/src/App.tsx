//import { useState } from 'react'
import { useEffect } from 'react';
import AppRoutes from './AppRoutes'
import { useUser } from './context/UseUser';
import { getCurrentUser } from './api/auth.api';
//import './App.css'

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
    if (!token) return; 

    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (err) {
      console.log("User not logged in");
    }
  };

    init();
  }, [setUser]);

  return (
    <>
       <AppRoutes />
    </>
  )
}

export default App
