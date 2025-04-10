import React, { useState } from 'react';
import { 
  FaShoppingBag, 
  FaTh, 
  FaShoppingCart, 
  FaReceipt, 
  FaUser 
} from 'react-icons/fa';
import '../../index.css';

const LayoutUser = ({ children }) => {
  const [activeIcon, setActiveIcon] = useState('bag');

  const icons = [
    { name: 'bag', icon: <FaShoppingBag />, label: 'Shop' },
    { name: 'grid', icon: <FaTh />, label: 'Categories' },
    { name: 'cart', icon: <FaShoppingCart />, label: 'Cart' },
    { name: 'receipt', icon: <FaReceipt />, label: 'Orders' },
    { name: 'person', icon: <FaUser />, label: 'Profile' }
  ];

  return (
    <div className="user-layout">
      <main className="user-content">
        {children}
      </main>
      
      <nav className="bottom-bar">
        {icons.map((item) => (
          <button
            key={item.name}
            className={`nav-icon ${activeIcon === item.name ? 'active' : ''}`}
            onClick={() => setActiveIcon(item.name)}
            aria-label={item.label}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default LayoutUser;