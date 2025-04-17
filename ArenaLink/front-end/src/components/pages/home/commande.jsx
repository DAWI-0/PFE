import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Search, Trash } from 'lucide-react';

function Commande() {
  const [facilities, setFacilities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("Tous les sports");
  const [selectedPrice, setSelectedPrice] = useState("Tous les prix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {user: null};

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/orders/user/${user?.id}` );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
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
    fetchOrders();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/user/${user?.id}` );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReservations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching reservations:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user?.id]);

  const cancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/annuler/${reservationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchReservations();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert('Erreur lors de l\'annulation de la réservation.');
    }
  };

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
        statusText = 'Confirmé';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        statusText = 'En attente';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = 'Annulé';
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
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">ArenaLink</h1>
          <p className="mt-2">Trouvez et réservez votre terrain de sport idéal</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Reservations Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Mes Réservations</h2>
          
          {/* Loading and error states */}
          {loading && <p className="text-center py-4">Chargement des réservations...</p>}
          {error && <p className="text-center py-4 text-red-600">Erreur: {error}</p>}
          
          {/* Reservation Cards */}
          {!loading && !error && (
            <div className="space-y-4">
              {orders.length === 0 && reservations.length === 0 ? (
                <p className="text-center py-4 text-gray-600">Aucune réservation trouvée.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="flex flex-col md:flex-row border rounded-lg shadow-sm p-4 bg-white">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">
                            Réservation #{reservation.id}
                          </h3>
                          <StatusBadge status={reservation.status} />
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-gray-500">Stade:</p>
                            <p className="font-medium">{reservation.stade?.name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Addresse:</p>
                            <p className="font-medium">{reservation.stade?.address || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date et heure:</p>
                            <p className="font-medium">{formatDate(reservation.start_time)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Durée:</p>
                            <p className="font-medium">{reservation.duration} heure(s)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end justify-between">
                        <div className="font-bold text-blue-600 text-xl">
                          {parseFloat(reservation.total_price).toFixed(2)} DH
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          {reservation.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => cancelReservation(reservation.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                Annuler
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.map(order => (
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
                        <div className="mt-2">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                      <div className="font-bold text-blue-600 md:text-right mt-3 md:mt-0">
                        {parseFloat(order.total_amount).toFixed(2)} DH
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Commande;