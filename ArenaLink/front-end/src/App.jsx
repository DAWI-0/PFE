import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Acceuil from './components/acceuil/Acceuil';
import Login from './components/authentication/login';
import Register from './components/authentication/register';
import LayoutUser from './components/layout/layoutUser';


export default function App() {
  const token=localStorage.getItem('authToken')
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Acceuil />} /> {/* Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<LayoutUser />}>
        <Route path="/home" element={<home />} />
       
        {/* other user routes */}
</Route>
    
      </Routes>
    </Router>
  );
}