import React from 'react';
import foot from '../../assets/authBg/foot.jpg';

const Layout = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        <img
          src={foot}
          alt="ArenaLink"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <main className="relative z-10 w-full h-full flex items-center justify-end p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;