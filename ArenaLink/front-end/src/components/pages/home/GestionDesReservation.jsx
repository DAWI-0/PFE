import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Search, Calendar, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function GestionDesReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedStadeId, setSelectedStadeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous les statuts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stades, setStades] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {user: null};
  const { t } = useTranslation();

  // Fetch reservations from the API
  const fetchReservations = async (id) => {
    try {
      setLoading(true);
      setError(null);
      let response;
        if (user?.role === "admin") {
          response = await fetch(`http://127.0.0.1:8000/api/ReservationadminControlle`);
        } else if (user?.role === "propriétaire") {
            response = await fetch(`http://127.0.0.1:8000/api/reservations/${id}`);
        }
      if (!response.ok) {
          setReservations([]);
          setFilteredReservations([]);
          setLoading(false);
          return;
      }
      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setReservations([]);
      setFilteredReservations([]);
      console.error('Error fetching reservations:', err);
    }
  };
  const fetchReservationsStade = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/stade/${id}`);
      if (!response.ok) {
          setReservations([]);
          setFilteredReservations([]);
          setLoading(false);
          return;
      }
      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setReservations([]);
      setFilteredReservations([]);
      console.error('Error fetching reservations:', err);
    }
  };

  useEffect(() => {
    if(selectedStadeId !== "") {
      fetchReservationsStade(selectedStadeId);
    }
    else {
      fetchReservations()}
  }, [selectedStadeId]);


  // Fetch stades for admin filtering
  const fetchStades = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/stades`);
      if (!response.ok) {
        throw new Error(`t(HTTP error! Status:) ${response.status}`);
      }
      const data = await response.json();
      setStades(data);
    } catch (err) {
      console.error('Error fetching stades:', err);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchStades();
    }
    if(user?.role === "propriétaire") {
      fetchReservations(user?.id);
    }
  }, [user?.role]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [selectedStadeId, startDate, endDate, selectedStatus, reservations]);

  // Function to apply all filters
  const applyFilters = () => {
    let filtered = [...reservations];

    // Filter by stade if selected
    if (selectedStadeId) {
      filtered = filtered.filter(reservation => 
        reservation.stade_id.toString() === selectedStadeId
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(reservation => 
        new Date(reservation.start_time) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      filtered = filtered.filter(reservation => 
        new Date(reservation.start_time) <= new Date(endDate + 'T23:59:59')
      );
    }

    // Filter by status
    if (selectedStatus !== "Tous les statuts") {
      const statusMap = {
        "Confirmé": "confirmed",
        "En attente": "pending",
        "Annulé": "cancelled"
      };
      filtered = filtered.filter(reservation => 
        reservation.status === statusMap[selectedStatus]
      );
    }

    setFilteredReservations(filtered);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedStadeId("");
    setStartDate("");
    setEndDate("");
    setSelectedStatus("Tous les statuts");
  };

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const confirmReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/confirmer/${reservationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`t(HTTP error! Status:) ${response.status}`);
      }

      if(user?.role === "admin") {
        fetchReservations(selectedStadeId);
      }
        if(user?.role === "propriétaire") {
        fetchReservations(user?.id);
      }
    } catch (err) {
      console.error('Error confirming reservation:', err);
      alert(t('Erreur lors de la confirmation de la réservation.'));
    }
  };

  // Function to cancel a reservation
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

      if(user?.role === "admin") {
        fetchReservations(selectedStadeId);
      }
        if(user?.role === "propriétaire") {
        fetchReservations(user?.id);
      }
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert(t("Erreur lors de l'annulation de la réservation."));
    }
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
      <span className={`inline-block px-3 py-1 ${bgColor} ${textColor} rounded-full text-sm`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className={`min-h-screen md:w-full bg-gray-50 ${user.role === 'admin' ? 'w-[370px]' : ''}`}>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Reservations Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">{t("Gestion des réservations")}</h2>
          
          {/* Filters Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Stade Filter - Admin Only */}
              {user?.role === "admin" && (
                <div className="w-full md:w-1/4">
                  <label htmlFor="stadeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("Stade")}
                  </label>
                  <select
                    id="stadeSelect"
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    onChange={(e) => setSelectedStadeId(e.target.value)}
                    value={selectedStadeId}
                  >
                    <option value="">{t("Tous les stades")}</option>
                    {stades.map((stade) => (
                      <option key={stade.id} value={stade.id}>
                        {stade.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Date Range Filters */}
              <div className="w-full md:w-1/4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Date de début")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="w-full md:w-1/4">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Date de fin")}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="endDate"
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="w-full md:w-1/4">
                <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Statut")}
                </label>
                <select
                  id="statusSelect"
                  className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  value={selectedStatus}
                >
                  <option value="Tous les statuts">{t("Tous les statuts")}</option>
                  <option value="En attente">{t("En attente")}</option>
                  <option value="Confirmé">{t("Confirmé")}</option>
                  <option value="Annulé">{t("Annulé")}</option>
                </select>
              </div>
              
              {/* Reset Filters Button */}
              <div className="w-full md:w-auto">
                <button 
                  onClick={resetFilters}
                  className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t("Réinitialiser")}
                </button>
              </div>
            </div>
          </div>
          
          {/* Loading and error states */}
          {loading && <p className="text-center py-4">{t("Chargement des réservations...")}</p>}
          {error && <p className="text-center py-4 text-red-600">{t("Erreur:")} {error}</p>}
          
          {/* Reservations List */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredReservations.length === 0 ? (
                <p className="text-center py-4 text-gray-600">{t("Aucune réservation trouvée.")}</p>
              ) : (
                filteredReservations.map(reservation => (
                  <div key={reservation.id} className="flex flex-col md:flex-row border rounded-lg shadow-sm p-4 bg-white">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">
                          {t("Réservation")} #{reservation.id}
                        </h3>
                        <StatusBadge status={reservation.status} />
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">{t("Client:")}</p>
                          <p className="font-medium">{reservation.user?.name || t("N/A")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t("Téléphone:")}</p>
                          <p className="font-medium">{reservation.user?.phone || t("N/A")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t("Date et heure:")}</p>
                          <p className="font-medium">{formatDate(reservation.start_time)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t("Durée:")}</p>
                          <p className="font-medium">{reservation.duration} {t("heure(s)")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end justify-between">
                      <div className="font-bold text-blue-600 text-xl">
                        {parseFloat(reservation.total_price).toFixed(2)} {t("DH")}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        {reservation.status === "pending" && (
                          <>
                            <button
                              onClick={() => confirmReservation(reservation.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              {t("Confirmer")}
                            </button>
                            <button
                              onClick={() => cancelReservation(reservation.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              {t("Annuler")}
                            </button>
                          </>
                        )}
                      </div>
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

export default GestionDesReservations;