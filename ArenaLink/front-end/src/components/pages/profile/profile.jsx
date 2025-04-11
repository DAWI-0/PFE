import React from 'react';

const Profile = () => {
  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      
      <div className="profile-section">
        <div className="profile-card">
          <h2>Informations Personnelles</h2>
          {/* Profile form would go here */}
        </div>
        
        <div className="profile-card">
          <h2>Paramètres</h2>
          {/* Settings would go here */}
        </div>
      </div>
    </div>
  );
};

export default Profile;