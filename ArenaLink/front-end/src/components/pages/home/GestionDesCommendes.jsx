import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Search, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function GestionDesCommendes() {
  const [facilities, setFacilities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("Tous les sports");
  const [selectedPrice, setSelectedPrice] = useState("Tous les prix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {user: null};
  const {t}=useTranslation();

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/orders/status/pending` );
      
      if (!response.ok) {
        throw new Error(`t(HTTP error! Status:) ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };
  useEffect(() => {

    fetchOrders();
  }, []);

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    let statusText = '';

    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'complete':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        statusText = t('Confirmé');
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        statusText = t('En attente');
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = t('Annulé');
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        statusText = status;
    }

    return (
      <span className={`mt-2 inline-block px-3 py-1 ${bgColor} ${textColor} rounded-full text-sm`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Reservations Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">{t("Gestion des commendes")}</h2>
          
          {/* Loading and error states */}
          {loading && <p className="text-center py-4">{t("Chargement des commendes...")}</p>}
          {error && <p className="text-center py-4 text-red-600">Erreur: {error}</p>}
          
          {/* Reservation Cards */}
          {!loading && !error && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center py-4 text-gray-600">{t("Aucune commende trouvée.")}</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="flex flex-col md:flex-row p-4 border rounded-lg">
                    <div className="w-full md:w-auto">
                      {order.products && order.products.length > 0 && (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${order.products[0].image_url}`} 
                          alt={order.products[0].name} 
                          className="w-full md:w-24 h-auto md:h-16 rounded-lg object-cover"
                          onError={(e) => {e.target.src = "https://via.placeholder.com/150x100"}}
                        />
                      )}
                    </div>
                    <div className="flex-1 mt-3 md:mt-0 md:ml-4">
                      <h3 className="text-lg font-semibold">
                        {order.products && order.products.map(p => p.name).join(', ')}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 18.293A10 10 0 016.707 2.707a1 1 0 111.414 1.414L22 11v7a1 1 0 11-2 0z" />
                          </svg>
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="font-bold text-blue-600 md:text-right mt-3 md:mt-0">
                      {parseFloat(order.total_amount).toFixed(2)} {t("DH")}
                      <div className="text-sm text-gray-500">{t("Total")}</div>
                    </div>

                    <div className="mt-4 md:mt-3 md:ml-4">
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(`http://127.0.0.1:8000/api/orders/confirmer/${order.id}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    });

                                    if (!response.ok) {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }

                                    fetchOrders();
                                } catch (err) {
                                    console.error('Error confirming order:', err);
                                    alert('Erreur lors de la confirmation de la commande.');
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {t("Confirmer")}
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionDesCommendes;