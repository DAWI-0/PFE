import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Sample data - replace with your actual data fetching
  const recentProducts = [
    { id: 1, name: 'Produit Premium', price: 49.99 },
    { id: 2, name: 'Nouvelle Collection', price: 29.99 },
    { id: 3, name: 'Best-seller', price: 39.99 }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <section className="welcome-banner">
        <h1>Bonjour, [Utilisateur]</h1>
        <p>Que souhaitez-vous faire aujourd'hui ?</p>
      </section>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <button 
          onClick={() => navigate('/magasin')}
          className="action-card shop-card"
        >
          <h2>Magasin</h2>
          <p>Parcourir tous les produits</p>
        </button>

        <button 
          onClick={() => navigate('/commandes')}
          className="action-card orders-card"
        >
          <h2>Commandes</h2>
          <p>Suivre vos achats</p>
        </button>
      </div>

      {/* Recent Products */}
      <section className="recent-section">
        <h2>Vos produits récents</h2>
        <div className="product-grid">
          {recentProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => navigate(`/produit/${product.id}`)}
            >
              <h3>{product.name}</h3>
              <p>{product.price}€</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;