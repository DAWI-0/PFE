import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Acceuil from './components/acceuil/Acceuil';
import Login from './components/authentication/login';
import Register from './components/authentication/register';
import LayoutUser from './components/layout/layoutUser';
import ResetPassword from './components/authentication/ResetPassword';
import Home from './components/pages/home/home'; // Import home.jsx
import Magasin from './components/pages/home/magasin'; 
import Commande from './components/pages/home/commande'; // Import commande.jsx
import Profile from './components/pages/profile/profile'; // Import profile.jsx
import NotFound from './components/pages/NotFound'; // Create a 404 page
import UserRoleConfirmation from './components/pages/home/GestionDesRoles';
import GestionDesCommendes from './components/pages/home/GestionDesCommendes';
import GestionDesReservations from './components/pages/home/GestionDesReservation';
import DashboardCharts from './components/pages/home/Dashboard';


export default function App() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
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
          <Route path="/home" element={userData?.role === "admin" ? <DashboardCharts /> : <Home />} />
          <Route path="/stades" element={<Home />} />
          <Route path="/magasin" element={<Magasin />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gestion_des_role" element={<UserRoleConfirmation />} />
          <Route path="/gestion_des_commendes" element={<GestionDesCommendes />} />
          <Route path="/gestion_des_reservation" element={<GestionDesReservations />} />
          
        </Route>

        {/* Fallback route for invalid URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}