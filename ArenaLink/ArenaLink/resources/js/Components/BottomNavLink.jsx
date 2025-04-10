// resources/js/Components/BottomNavLink.jsx
import React from 'react';

const BottomNavLink = ({ name, icon, active, onClick }) => {
  return (
    <div
      className={`icon ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default BottomNavLink;