import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './components/acceuil/Acceuil';
import Login from './components/authentication/login';
import Register from './components/authentication/register';
import LayoutUser from './components/layout/layoutUser';
import ResetPassword from './components/authentication/ResetPassword';
import Home from './components/pages/home/home'; // Import home.jsx
import Store from './components/pages/home/store'; // Import store.jsx
import Commande from './components/pages/home/commande'; // Import commande.jsx
import Profile from './components/pages/profile/profile'; // Import profile.jsx
import NotFound from './components/pages/NotFound'; // Create a 404 page

export default function App() {
  const token = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Acceuil />} /> {/* Home page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />

        {/* Protected routes with LayoutUser */}
        <Route
          element={token ? <LayoutUser /> : <Navigate to="/login" replace />}
        >
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/commande" element={<Commande />} />
          
        </Route>
        <Route path="/profile" element={<Profile />} />

        {/* Fallback route for invalid URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}