import React, { useEffect, useState } from 'react';
import { MapPin, Filter, Search, Trash, MessageCircle, X, Send, Star } from 'lucide-react';

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

const currentUser = JSON.parse(localStorage.getItem('user')) ;

// Star Rating component
const StarRating = ({ rating, setRating, editable = false }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className={`${editable ? 'cursor-pointer' : 'cursor-default'} bg-transparent border-none outline-none`}
            onClick={() => editable && setRating(ratingValue)}
            onMouseEnter={() => editable && setHover(ratingValue)}
            onMouseLeave={() => editable && setHover(0)}
          >
            <Star 
              className={`w-5 h-5 ${
                ratingValue <= (hover || rating) 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        );
      })}
    </div>
  );
};

// Component for the comments modal
const CommentsModal = ({ facility, isOpen, onClose, onAddComment, onAddRating, hasRated }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((newComment.trim() || newRating > 0) && (!hasRated || newComment.trim())) {
      onAddComment(facility.id, newComment, newRating);
      setNewComment('');
      setNewRating(0);
    }
  };

  // Calculate average rating
  const averageRating = facility.comments && facility.comments.length > 0
    ? facility.comments.reduce((acc, comment) => acc + (comment.rating || 0), 0) / facility.comments.length
    : 0;

  // Vérifier si l'utilisateur actuel a déjà noté ce terrain
  const userRatingComment = facility.comments?.find(comment => comment.userId === currentUser.id && comment.rating > 0);
  const userRating = userRatingComment ? userRatingComment.rating : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Commentaires - {facility.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Average Rating Display */}
        <div className="flex items-center mb-4">
          <span className="text-gray-700 mr-2">Note moyenne :</span>
          <StarRating rating={averageRating} editable={false} />
          <span className="ml-2 text-gray-700">({averageRating.toFixed(1)})</span>
        </div>

        <div className="max-h-80 overflow-y-auto mb-4">
          {facility.comments && facility.comments.length > 0 ? (
            facility.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                <div className="flex items-center mb-1">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold ml-2">{comment.author}</span>
                  <span className="text-xs text-gray-500 ml-auto">{comment.date}</span>
                </div>
                {comment.rating > 0 && (
                  <div className="mb-1">
                    <StarRating rating={comment.rating} editable={false} />
                  </div>
                )}
                {comment.text && <p className="text-gray-700">{comment.text}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun commentaire pour le moment</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Afficher la note existante ou permettre d'en ajouter une nouvelle */}
          {hasRated ? (
            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">
                Votre note :
              </label>
              <div className="flex items-center">
                <StarRating rating={userRating} editable={false} />
                <span className="ml-2 text-gray-500 text-sm">
                  Vous avez déjà noté ce terrain
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">
                Votre note :
              </label>
              <StarRating rating={newRating} setRating={setNewRating} editable={true} />
            </div>
          )}
          
          <div className="flex">
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
        setPreviewImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('sport_type', sportType);
    formData.append('capacity', parseInt(capacity));
    formData.append('price_per_hour', parseFloat(pricePerHour));
    formData.append('user_id', currentUser.id); 
    formData.append('image', image);

    fetch('http://127.0.0.1:8000/api/stades', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    })
      .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add facility');
      }
      return response.json();
      })
      .then((data) => {
      console.log('Facility added successfully:', data);
      onAdd(data);
      setName('');
      setAddress('');
      setSportType('');
      setCapacity('');
      setPricePerHour('');
      setImage(null);
      setPreviewImage('');
      })
      .catch((error) => {
      console.error('Error adding facility:', error);
      });
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
  const [commentsModal, setCommentsModal] = useState({
    isOpen: false,
    facilityId: null
  });

  const fetchStades = async () => {
    const rep = await fetch("http://127.0.0.1:8000/api/stades");
    const data = await rep.json();
    setFacilities(data);
  };

  useEffect(() => {
    fetchStades();
  }, []);



  const handleAddFacility = (newFacility) => {
    setFacilities((prevFacilities) => [...prevFacilities, newFacility]);
    setShowAddForm(false);
  };

  const handleDeleteFacility = async (id) => {
    // Send DELETE request to the API
    const rep = await fetch(`http://127.0.0.1:8000/api/stades/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (!rep.ok) {
      console.error('Failed to delete facility:', rep.statusText);
      return;
    }
    setFacilities((prevFacilities) => prevFacilities.filter(facility => facility.id !== id));
  };

  const openCommentsModal = (facilityId) => {
    setCommentsModal({
      isOpen: true,
      facilityId
    });
  };

  const closeCommentsModal = () => {
    setCommentsModal({
      isOpen: false,
      facilityId: null
    });
  };

  const handleAddComment = (facilityId, commentText, rating) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) => {
        if (facility.id === facilityId) {
          // Vérifier si l'utilisateur a déjà noté ce terrain
          const hasUserRated = facility.rated_users?.includes(currentUser.id);
          
          // Si l'utilisateur a déjà noté et tente de noter à nouveau, ignorer la nouvelle note
          const finalRating = hasUserRated ? 0 : rating;
          
          // Créer un nouveau commentaire
          const newComment = {
            id: Date.now(),
            userId: currentUser.id,
            author: currentUser.name,
            date: new Date().toLocaleDateString(),
            text: commentText,
            rating: finalRating
          };
          
          // Si le commentaire n'est qu'une note sans texte et que l'utilisateur a déjà noté, ne pas l'ajouter
          if (!commentText.trim() && hasUserRated) {
            return facility;
          }
          
          const updatedComments = [...(facility.comments || []), newComment];
          
          // Ajouter l'utilisateur à la liste des notateurs s'il a fourni une note
          let updatedRatedUsers = [...(facility.rated_users || [])];
          if (finalRating > 0) {
            updatedRatedUsers.push(currentUser.id);
          }
          
          // Calculer la nouvelle note moyenne
          const newAverageRating = updatedComments.reduce((acc, comment) => acc + (comment.rating || 0), 0) / 
                                  updatedComments.filter(comment => comment.rating > 0).length || 0;
          
          return {
            ...facility,
            comments: updatedComments,
            average_rating: newAverageRating || 0,
            rated_users: updatedRatedUsers
          };
        }
        return facility;
      })
    );
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

  // Find the currently selected facility for comments modal
  const selectedFacility = facilities.find(f => f.id === commentsModal.facilityId) || { comments: [] };
  const hasUserRated = selectedFacility.rated_users?.includes(currentUser.id);

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
        {currentUser && (currentUser.role === 'admin' || currentUser.role === "propriétaire") && (
          <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors mb-6"
        >
          {showAddForm ? "Annuler" : "Ajouter un terrain"}
        </button>
        )
        }

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
                src={`http://127.0.0.1:8000/storage/${facility.image}`}
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{facility.name}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{facility.address}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-600">Type de sport : {facility.sport_type}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-600">Capacité : {facility.capacity}</span>
                </div>
                
                {/* Rating display */}
                <div className="flex items-center mb-4">
                  <StarRating rating={facility.average_rating || 0} editable={false} />
                  {facility.comments && facility.comments.length > 0 && facility.comments.some(c => c.rating > 0) ? (
                    <span className="ml-2 text-sm text-gray-600">
                      ({facility.average_rating.toFixed(1)}) {facility.comments.filter(c => c.rating > 0).length} avis
                    </span>
                  ) : (
                    <span className="ml-2 text-sm text-gray-600">Aucun avis</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {facility.price_per_hour} MAD<span className="text-sm">/heure</span>
                  </span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Réserver
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  {currentUser && (currentUser.role === 'admin' || currentUser.role === "propriétaire") && (
                    <button
                    onClick={() => handleDeleteFacility(facility.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <Trash className="w-4 h-4" />
                  </button>)}
                  <button
                    onClick={() => openCommentsModal(facility.id)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                    title="Commentaires"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {facility.comments && facility.comments.length > 0 && (
                      <span className="ml-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        {facility.comments.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        facility={selectedFacility}
        isOpen={commentsModal.isOpen}
        onClose={closeCommentsModal}
        onAddComment={handleAddComment}
        hasRated={hasUserRated}
      />
    </div>
  );
}

export default App;