import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

// Données simulées pour les utilisateurs
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' },
  { id: 4, name: 'David', email: 'david@example.com', role: 'admin' },
  { id: 5, name: 'Eve', email: 'eve@example.com', role: 'user' },
];

// Données simulées pour les commandes
const mockOrders = [
  { id: 1, user_id: 2, total_price: 100, status: 'pending', created_at: '2023-10-01T10:00:00Z' },
  { id: 2, user_id: 3, total_price: 200, status: 'confirmed', created_at: '2023-10-02T11:00:00Z' },
  { id: 3, user_id: 1, total_price: 150, status: 'pending', created_at: '2023-10-03T12:00:00Z' },
  { id: 4, user_id: 4, total_price: 250, status: 'confirmed', created_at: '2023-10-04T13:00:00Z' },
  { id: 5, user_id: 5, total_price: 300, status: 'pending', created_at: '2023-10-05T14:00:00Z' },
];  

// Données simulées pour les produits
const mockProducts = [
  { id: 1, nom: 'Produit A', prix: 50, stock: 10 },
  { id: 2, nom: 'Produit B', prix: 100, stock: 5 },
  { id: 3, nom: 'Produit C', prix: 150, stock: 20 },
  { id: 4, nom: 'Produit D', prix: 200, stock: 15 },
  { id: 5, nom: 'Produit E', prix: 250, stock: 8 },
];

// Données simulées pour les stades
const mockStades = [
  { id: 1, nom: 'Stade Alpha' },
  { id: 2, nom: 'Stade Beta' },
  { id: 3, nom: 'Stade Gamma' },
  { id: 4, nom: 'Stade Delta' },
  { id: 5, nom: 'Stade Epsilon' },
];

// Données simulées pour les réservations
const mockReservations = [
  { id: 1, stade_id: 1, user_id: 2, created_at: '2023-10-01T15:00:00Z' },
  { id: 2, stade_id: 2, user_id: 3, created_at: '2023-10-02T16:00:00Z' },
  { id: 3, stade_id: 1, user_id: 1, created_at: '2023-10-03T17:00:00Z' },
  { id: 4, stade_id: 3, user_id: 4, created_at: '2023-10-04T18:00:00Z' },
  { id: 5, stade_id: 2, user_id: 5, created_at: '2023-10-05T19:00:00Z' },
];

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DashboardCharts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    total: 0
  });

  // État pour les données des tableaux
  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const fetchUsers =async () => {
    const response = await fetch('http://localhost:8000/api/dashboard/users');
    const data= await response.json();
    setUsers(data)
  };
  const fetchProduits =async () => {
    const response = await fetch('http://localhost:8000/api/dashboard/produits');
    const data= await response.json();
    setProducts(data)
  };
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const fetchAllData = () => {
    setLoading(true);
    try {
      
      fetchUsers();
      fetchProduits();
      setOrders(mockOrders);
     
      setStades(mockStades);
      setReservations(mockReservations);
      setPendingOrders(mockOrders.filter(order => order.status === 'pending'));

      const sortedReservations = [...mockReservations]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentReservations(sortedReservations);

      const pendingCount = mockOrders.filter(order => order.status === 'pending').length;
      const confirmedCount = mockOrders.filter(order => order.status === 'confirmed').length;
      setOrderStats({
        pending: pendingCount,
        confirmed: confirmedCount,
        total: mockOrders.length,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Impossible de charger les données. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = (orderId) => {
    try {
      const updatedOrders = mockOrders.map(order =>
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      );
      setOrders(updatedOrders);
      setPendingOrders(updatedOrders.filter(order => order.status === 'pending'));

      const pendingCount = updatedOrders.filter(order => order.status === 'pending').length;
      const confirmedCount = updatedOrders.filter(order => order.status === 'confirmed').length;
      setOrderStats({
        pending: pendingCount,
        confirmed: confirmedCount,
        total: updatedOrders.length,
      });
    } catch (err) {
      console.error("Erreur lors de la confirmation de la commande:", err);
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
      { name: 'Confirmées', value: orderStats.confirmed }
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tableau de bord</h1>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Utilisateurs</div>
          <div className="text-3xl font-bold text-gray-800">{users.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Produits</div>
          <div className="text-3xl font-bold text-gray-800">{products.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Stades</div>
          <div className="text-3xl font-bold text-gray-800">{stades.length}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Réservations</div>
          <div className="text-3xl font-bold text-gray-800">{reservations.length}</div>
        </div>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique à barres des réservations par stade */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Réservations par stade</h2>
          <div className="h-64">
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
          </div>
        </div>
        
        {/* Graphique en camembert des rôles utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Distribution des rôles</h2>
          <div className="h-64">
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
          </div>
        </div>
        
        {/* Graphique en camembert des commandes par statut */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Statut des commandes</h2>
          <div className="h-64">
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
                  <Cell fill="#FFBB28" />
                  <Cell fill="#00C49F" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Graphique linéaire des activités récentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'Lun', reservations: 4, commandes: 2 },
                  { name: 'Mar', reservations: 3, commandes: 5 },
                  { name: 'Mer', reservations: 5, commandes: 3 },
                  { name: 'Jeu', reservations: 6, commandes: 4 },
                  { name: 'Ven', reservations: 8, commandes: 7 },
                  { name: 'Sam', reservations: 12, commandes: 9 },
                  { name: 'Dim', reservations: 10, commandes: 6 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reservations" stroke="#8884d8" activeDot={{ r: 8 }} name="Réservations" />
                <Line type="monotone" dataKey="commandes" stroke="#82ca9d" name="Commandes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Listes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes en attente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Commandes en attente</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucune commande en attente</td>
                  </tr>
                ) : (
                  pendingOrders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.total_price || 0} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => confirmOrder(order.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Confirmer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Réservations récentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Réservations récentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucune réservation récente</td>
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
          </div>
        </div>
        
        {/* Derniers utilisateurs inscrits */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Derniers utilisateurs inscrits</h2>
          <div>
            <table className="min-w-full max-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucun utilisateur inscrit</td>
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
          </div>
        </div>
        
        {/* Produits populaires */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Produits populaires</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucun produit disponible</td>
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
          </div>
        </div>
      </div>
    </div>
  );
}