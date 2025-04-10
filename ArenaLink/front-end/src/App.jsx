import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Acceuil from './components/acceuil/Acceuil';


export default function App() {
  const token=localStorage.getItem('authToken')
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Acceuil />} /> {/* Home page */}
       
    
      </Routes>
    </Router>
  );
}