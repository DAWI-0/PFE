// resources/js/Components/BottomNav.jsx
import React, { useState } from 'react';
import BottomNavLink from './BottomNavLink';
import { FaShoppingBag, FaTh, FaShoppingCart, FaReceipt, FaUser } from 'react-icons/fa';

const BottomNav = () => {
  const [activeIcon, setActiveIcon] = useState('bag');

  const icons = [
    { name: 'bag', icon: <FaShoppingBag /> },
    { name: 'grid', icon: <FaTh /> },
    { name: 'cart', icon: <FaShoppingCart /> },
    { name: 'receipt', icon: <FaReceipt /> },
    { name: 'person', icon: <FaUser /> },
  ];

  return (
    <div className="bottom-bar">
      {icons.map((item) => (
        <BottomNavLink
          key={item.name}
          name={item.name}
          icon={item.icon}
          active={activeIcon === item.name}
          onClick={() => setActiveIcon(item.name)}
        />
      ))}
    </div>
  );
};

export default BottomNav;