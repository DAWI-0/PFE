import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff4d4f'];

export default function DashboardCharts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {t}=useTranslation();
  const [chartLoading, setChartLoading] = useState({
    users: true,
    products: true,
    stades: true,
    reservations: true,
    orders: true
  });
  
  // États pour les données
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stades, setStades] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Statistiques dérivées
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    confirmed: 0,
    canceled: 0,
    total: 0
  });

  // État pour les données des tableaux
  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setChartLoading(prev => ({ ...prev, users: false }));
    }
  };
  
  const fetchProduits = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/produits');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      setError("Impossible de charger les produits.");
    } finally {
      setChartLoading(prev => ({ ...prev, products: false }));
    }
  };
  
  const fetchStades = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/stades');
      const data = await response.json();
      setStades(data);
    } catch (err) {
      console.error("Erreur lors du chargement des stades:", err);
      setError("Impossible de charger les stades.");
    } finally {
      setChartLoading(prev => ({ ...prev, stades: false }));
    }
  };
  
  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      console.error("Erreur lors du chargement des réservations:", err);
      setError("Impossible de charger les réservations.");
    } finally {
      setChartLoading(prev => ({ ...prev, reservations: false }));
    }
  };
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/orders');
      const data = await response.json();
      setOrders(data);
      processOrderData(data);
    } catch (err) {
      console.error("Erreur lors du chargement des commandes:", err);
      setError("Impossible de charger les commandes.");
    } finally {
      setChartLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Fonction pour traiter les données des commandes
  const processOrderData = (ordersData) => {
    const pendingCount = ordersData.filter(order => order.status === 'pending').length;
    const confirmedCount = ordersData.filter(order => order.status === 'confirmed').length;
    const canceledCount = ordersData.filter(order => order.status === 'canceled').length;
    
    setPendingOrders(ordersData.filter(order => order.status === 'pending'));
    
    setOrderStats({
      pending: pendingCount,
      confirmed: confirmedCount,
      canceled: canceledCount,
      total: ordersData.length,
    });
  };
  
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    // Vérifier si toutes les données sont chargées
    if (!Object.values(chartLoading).some(loading => loading)) {
      setLoading(false);
    }
  }, [chartLoading]);

  useEffect(() => {
    // Traiter les données de réservations une fois chargées
    if (reservations.length > 0) {
      const sortedReservations = [...reservations]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentReservations(sortedReservations);
    }
  }, [reservations]);

  const fetchAllData = () => {
    setLoading(true);
    // Réinitialiser le statut de chargement pour chaque source de données
    setChartLoading({
      users: true,
      products: true,
      stades: true,
      reservations: true,
      orders: true
    });
    
    fetchUsers();
    fetchProduits();
    fetchStades();
    fetchReservations();
    fetchOrders();
  };

  const confirmOrder = (orderId) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      );
      setOrders(updatedOrders);
      processOrderData(updatedOrders);
    } catch (err) {
      console.error("Erreur lors de la confirmation de la commande:", err);
    }
  };

  const cancelOrder = (orderId) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: 'canceled' } : order
      );
      setOrders(updatedOrders);
      processOrderData(updatedOrders);
    } catch (err) {
      console.error("Erreur lors de l'annulation de la commande:", err);
    }
  };

  // Préparer les données pour le graphique des réservations par stade
  const prepareReservationsByStade = () => {
    if (!stades.length || !reservations.length) return [];
    
    const reservationCounts = {};
    stades.forEach(stade => {
      reservationCounts[stade.id] = {
        name: stade.nom || `Stade ${stade.id}`,
        count: 0
      };
    });

    reservations.forEach(reservation => {
      if (reservationCounts[reservation.stade_id]) {
        reservationCounts[reservation.stade_id].count++;
      }
    });

    return Object.values(reservationCounts);
  };

  // Préparer les données pour le graphique des rôles utilisateurs
  const prepareUserRoleData = () => {
    if (!users.length) return [];
    
    const roles = {};
    users.forEach(user => {
      const role = user.role || 'user';
      roles[role] = (roles[role] || 0) + 1;
    });

    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  };

  // Préparer les données pour le graphique des commandes par statut
  const prepareOrderStatusData = () => {
    return [
      { name: 'En attente', value: orderStats.pending },
      { name: 'Confirmées', value: orderStats.confirmed },
      { name: 'Annulées', value: orderStats.canceled }
    ];
  };

  // Préparer les données pour le graphique d'activité récente
  const prepareActivityData = () => {
    // Créer les 7 derniers jours
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();
    const activityData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const dayReservations = reservations.filter(r => {
        const resDate = new Date(r.created_at);
        return resDate.toDateString() === date.toDateString();
      }).length;
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate.toDateString() === date.toDateString();
      }).length;
      
      activityData.push({
        name: days[date.getDay()],
        reservations: dayReservations,
        commandes: dayOrders
      });
    }
    
    return activityData;
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <div className="text-lg font-semibold text-gray-700">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Erreur</h3>
        <p>{error}</p>
        <button 
          onClick={() => fetchAllData()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen w-[370px] md:w-full p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t("Tableau de bord")}</h1>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">{t("Total Utilisateurs")}</div>
          <div className="text-3xl font-bold text-gray-800">{users.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">{t("Total Produits")}</div>
          <div className="text-3xl font-bold text-gray-800">{products.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">{t("Total Stades")}</div>
          <div className="text-3xl font-bold text-gray-800">{stades.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">{t("Total Réservations")}</div>
          <div className="text-3xl font-bold text-gray-800">{reservations.length}</div>
        </div>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique à barres des réservations par stade */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Réservations par stade")}</h2>
          <div className="h-64">
            {chartLoading.stades || chartLoading.reservations ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareReservationsByStade()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0088FE" name="Réservations" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Graphique en camembert des rôles utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Distribution des rôles")}</h2>
          <div className="h-64">
            {chartLoading.users ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareUserRoleData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareUserRoleData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Graphique en camembert des commandes par statut */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Statut des commandes")}</h2>
          <div className="h-64">
            {chartLoading.orders ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareOrderStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#FFBB28" /> {/* En attente */}
                    <Cell fill="#00C49F" /> {/* Confirmées */}
                    <Cell fill="#FF8042" /> {/* Annulées */}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        {/* Graphique linéaire des activités récentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Activités récentes (7 derniers jours)")}</h2>
          <div className="h-64">
            {chartLoading.orders || chartLoading.reservations ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareActivityData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reservations" stroke="#8884d8" activeDot={{ r: 8 }} name="Réservations" />
                  <Line type="monotone" dataKey="commandes" stroke="#82ca9d" name="Commandes" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      
      {/* Listes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes en attente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Derniers Commandes")}</h2>
          <div className="overflow-x-auto">
            {chartLoading.orders ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("ID")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Client")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Total")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">{t("Aucune commande en attente")}</td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total_price || 0} DH
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Réservations récentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Réservations récentes")}</h2>
          <div className="overflow-x-auto">
            {chartLoading.reservations ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("ID")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Stade")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Utilisateur")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Date")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReservations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">{t("Aucune réservation récente")}</td>
                    </tr>
                  ) : (
                    recentReservations.map(reservation => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.stade_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(reservation.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Derniers utilisateurs inscrits */}
        <div className="bg-white p-6 overflow-x-auto rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Derniers utilisateurs inscrits")}</h2>
          <div>
            {chartLoading.users ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full max-w-full overflow-x-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("ID")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Nom")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Email")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Rôle")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">{t("Aucun utilisateur inscrit")}</td>
                    </tr>
                  ) : (
                    users.slice(0, 5).map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Produits populaires */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("Produits populaires")}</h2>
          <div className="overflow-x-auto">
            {chartLoading.products ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("ID")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Nom")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Prix")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("Stock")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">{t("Aucun produit disponible")}</td>
                    </tr>
                  ) : (
                    products.slice(0, 5).map(product => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.nom || product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.prix || product.price || 0} DH
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stock || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}