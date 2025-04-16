import React, { useState } from 'react';
import { MapPin, Filter, Search, Trash } from 'lucide-react';

// Mock data for sports facilities
const initialFacilities = [];

function Commande() {
  const [facilities, setFacilities] = useState(initialFacilities);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("Tous les sports");
  const [selectedPrice, setSelectedPrice] = useState("Tous les prix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // ... (rest of the state management remains the same)

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
          
          {/* Reservation Cards */}
          <div className="space-y-4">
            {/* Reservation 1 */}
            <div className="flex items-center p-4 border rounded-lg">
              <img 
                src="https://via.placeholder.com/150x100" 
                alt="Stade Michel d'Ornano" 
                className="w-24 h-16 rounded-lg"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">Stade Michel d'Ornano</h3>
                <div className="flex items-center mt-2">
                  <span className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 18.293A10 10 0 016.707 2.707a1 1 0 111.414 1.414L22 11v7a1 1 0 11-2 0z" />
                    </svg>
                    2024-03-20
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16V6a2 2 0 114 0v10a2 2 0 01-4 0zM6 16V5a2 2 0 114 0v11a2 2 0 01-4 0z" />
                    </svg>
                    14:00 (2h)
                  </span>
                </div>
                <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Confirmé
                </span>
              </div>
              <div className="font-bold text-blue-600">
                160€
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>

            {/* Reservation 2 */}
            <div className="flex items-center p-4 border rounded-lg">
              <img 
                src="https://via.placeholder.com/150x100" 
                alt="Arena Basketball Center" 
                className="w-24 h-16 rounded-lg"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">Arena Basketball Center</h3>
                <div className="flex items-center mt-2">
                  <span className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 18.293A10 10 0 016.707 2.707a1 1 0 111.414 1.414L22 11v7a1 1 0 11-2 0z" />
                    </svg>
                    2024-03-22
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16V6a2 2 0 114 0v10a2 2 0 01-4 0zM6 16V5a2 2 0 114 0v11a2 2 0 01-4 0z" />
                    </svg>
                    16:00 (1h)
                  </span>
                </div>
                <span className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  En attente
                </span>
              </div>
              <div className="font-bold text-blue-600">
                60€
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the content (filters, add facility form, etc.) */}
        {/* ... */}
      </div>
    </div>
  );
}

export default Commande;