import React, { useState } from 'react';
import { MapPin, Filter, Search, Trash } from 'lucide-react';

// Mock data for sports facilities (empty array to remove existing facilities)
const initialFacilities = [];
const cities = ["Paris", "Caen", "Lyon", "Marseille"];
const sports = [
  "Football",
  "Basketball",
  "Tennis",
  "Volleyball",
  "Handball",
  "Rugby",
  "Athlétisme",
  "Badminton",
  "Paddle",
];
const priceRanges = ["Tous les prix", "0-50 MAD", "50-100 MAD", "100 MAD+"];

const AddFacilityForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sportType, setSportType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [image, setImage] = useState(null); // Stocke le fichier image
  const [previewImage, setPreviewImage] = useState(''); // Stocke l'URL de prévisualisation

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Prévisualisation en Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && address && sportType && capacity && pricePerHour && image) {
      onAdd({
        id: Date.now(), // Use a unique ID, such as the current timestamp
        name,
        address,
        sport_type: sportType,
        capacity: parseInt(capacity),
        price_per_hour: parseFloat(pricePerHour),
        user_id: 1, // Replace with the logged-in user's ID (handled backend)
        image: previewImage, // Stocker l'image en Base64
      });
      setName('');
      setAddress('');
      setSportType('');
      setCapacity('');
      setPricePerHour('');
      setImage(null);
      setPreviewImage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Ajouter un nouveau terrain</h2>

      {/* Champ : Nom */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
          Nom
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Champ : Adresse */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
          Adresse
        </label>
        <input
          type="text"
          id="address"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Champ : Type de sport */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="sportType">
          Type de sport
        </label>
        <select
          id="sportType"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
        >
          <option value="">Sélectionnez un sport</option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Champ : Capacité */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="capacity">
          Capacité
        </label>
        <input
          type="number"
          id="capacity"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </div>

      {/* Champ : Prix par heure */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="pricePerHour">
          Prix par heure (MAD)
        </label>
        <input
          type="number"
          step="0.01"
          id="pricePerHour"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={pricePerHour}
          onChange={(e) => setPricePerHour(e.target.value)}
        />
      </div>

      {/* Champ : Image */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          onChange={handleImageChange}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Prévisualisation"
            className="mt-2 w-full h-32 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Bouton d'ajout */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ajouter
      </button>
    </form>
  );
};

function App() {
  const [facilities, setFacilities] = useState(initialFacilities);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("Tous les sports");
  const [selectedPrice, setSelectedPrice] = useState("Tous les prix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddFacility = (newFacility) => {
    setFacilities((prevFacilities) => [...prevFacilities, newFacility]);
    setShowAddForm(false);
  };

  const handleDeleteFacility = (id) => {
    setFacilities((prevFacilities) => prevFacilities.filter(facility => facility.id !== id));
  };

  const filteredFacilities = facilities.filter((facility) => {
    const matchesCity =
      !selectedCity || facility.address.toLowerCase().includes(selectedCity.toLowerCase());

    const matchesSport =
      selectedSport === "Tous les sports" || facility.sport_type === selectedSport;

    const matchesPrice =
      selectedPrice === "Tous les prix" ||
      (selectedPrice === "0-50 MAD" && facility.price_per_hour <= 50) ||
      (selectedPrice === "50-100 MAD" && facility.price_per_hour > 50 && facility.price_per_hour <= 100) ||
      (selectedPrice === "100 MAD+" && facility.price_per_hour > 100);

    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesSport && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">ArenaLink</h1>
          <p className="mt-2">Trouvez et réservez votre terrain de sport idéal</p>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un terrain..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {/* Ville (champ de texte libre) */}
              <input
                type="text"
                placeholder="Entrez une ville..."
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />

              {/* Type de sport */}
              <select
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                <option value="Tous les sports">Tous les sports</option>
                {sports.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>

              {/* Plage de prix */}
              <select
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Facility Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors mb-6"
        >
          {showAddForm ? "Annuler" : "Ajouter un terrain"}
        </button>

        {/* Add Facility Form */}
        {showAddForm && <AddFacilityForm onAdd={handleAddFacility} />}

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]"
            >
              {/* Image */}
              <img
                src={facility.image}
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{facility.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{facility.address}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-gray-600">Type de sport : {facility.sport_type}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-gray-600">Capacité : {facility.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {facility.price_per_hour} MAD<span className="text-sm">/heure</span>
                  </span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Réserver
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleDeleteFacility(facility.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;