import React, { useEffect, useState } from 'react';
import { MapPin, Filter, Search, Trash, MessageCircle, X, Send, Star, Calendar, Clock } from 'lucide-react';

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

const currentUser = JSON.parse(localStorage.getItem('user'));

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

// New component for reservation modal
const ReservationModal = ({ facility, isOpen, onClose }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingReservations, setExistingReservations] = useState([]);

  useEffect(() => {
    if (isOpen && facility) {
      // Reset form when modal opens
      setDate('');
      setStartTime('');
      setDuration(1);
      setTotalPrice(facility.price_per_hour);
      setReservationSuccess(false);
      setError('');
      
      // Get today's date in YYYY-MM-DD format for min attribute
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('reservation-date').min = today;
      
      // Fetch existing reservations for this facility
      fetchExistingReservations(facility.id);
    }
  }, [isOpen, facility]);

  // Update total price when duration changes
  useEffect(() => {
    if (facility) {
      setTotalPrice(facility.price_per_hour * duration);
    }
  }, [duration, facility]);

  const fetchExistingReservations = async (stadeId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reservations/stade/${stadeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch existing reservations');
      }
      const data = await response.json();
      data.forEach(reservation => {
        if(reservation.status === 'confirmed') {  
          setExistingReservations(prev => [...prev, reservation]);
        }});
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  // Check if selected time slot is available
  const isTimeSlotAvailable = () => {
    if (!date || !startTime) return true;
    
    const selectedDateTime = new Date(`${date}T${startTime}`);
    const selectedEndTime = new Date(selectedDateTime);
    selectedEndTime.setHours(selectedEndTime.getHours() + parseInt(duration));
    
    return !existingReservations.some(reservation => {
      const reservationStartTime = new Date(reservation.start_time);
      const reservationEndTime = new Date(reservationStartTime);
      reservationEndTime.setHours(reservationEndTime.getHours() + parseInt(reservation.duration));
      
      // Check if there's any overlap between the selected time and existing reservations
      return (
        (selectedDateTime < reservationEndTime && selectedEndTime > reservationStartTime)
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Vous devez être connecté pour effectuer une réservation');
      return;
    }
    
    if (!date || !startTime) {
      setError('Veuillez sélectionner une date et une heure');
      return;
    }
    
    // Check if the selected time slot is available
    if (!isTimeSlotAvailable()) {
      setError('Ce créneau est déjà réservé. Veuillez choisir un autre horaire.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Format startTime for API
    const formattedStartTime = `${date}T${startTime}:00`;
    
    try {
      const response = await fetch('http://localhost:8000/api/reservations/stade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          stade_id: facility.id,
          start_time: formattedStartTime,
          duration: parseInt(duration),
          total_price: totalPrice,
          status : "pending",
        })
      });
      
      if (!response.ok) {
        throw new Error('Échec de la réservation');
      }
      
      const data = await response.json();
      setReservationSuccess(true);
      
      // Refresh the reservations list
      fetchExistingReservations(facility.id);
      
    } catch (error) {
      console.error('Error making reservation:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Réserver - {facility.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {reservationSuccess ? (
          <div className="text-center py-8">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
              <p className="font-semibold">Réservation confirmée !</p>
              <p>Votre terrain a été réservé avec succès.</p>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Date selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="reservation-date">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="reservation-date"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Time selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="reservation-time">
                Heure de début
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  id="reservation-time"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Duration selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="reservation-duration">
                Durée (heures)
              </label>
              <select
                id="reservation-duration"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                {[1, 2, 3, 4].map((hours) => (
                  <option key={hours} value={hours}>
                    {hours} {hours === 1 ? 'heure' : 'heures'}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Display existing reservations if any */}
            {existingReservations.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 mb-2">Créneaux déjà réservés:</h3>
                <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                  {existingReservations.map((reservation, index) => {
                    const startDate = new Date(reservation.start_time);
                    const endDate = new Date(startDate);
                    endDate.setHours(endDate.getHours() + parseInt(reservation.duration));
                    
                    return (
                      <div key={index} className="text-sm text-gray-600 mb-1">
                        {startDate.toLocaleDateString()} - {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} à {endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Total price */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold">Prix total:</span>
                <span className="text-2xl font-bold text-blue-600">{totalPrice} MAD</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {facility.price_per_hour} MAD/heure × {duration} {duration === 1 ? 'heure' : 'heures'}
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Traitement en cours...' : 'Confirmer la réservation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Component for the comments modal
const CommentsModal = ({ facility, isOpen, onClose, onAddComment, onAddRating, hasRated, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && facility && facility.id) {
      fetchComments(facility.id);
    }
  }, [isOpen, facility]);

  const fetchComments = async (stadeId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reviews/${stadeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((newComment.trim() || newRating > 0) && (!hasRated || newComment.trim())) {
      const commentData = {
        user_id: currentUser.id,
        stade_id: facility.id,
        rating: newRating,
        comment: newComment,
      };

      fetch(`http://127.0.0.1:8000/api/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(commentData),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        return response.json();
      })
      .then((data) => {
        // Refresh comments after adding a new one
        fetchComments(facility.id);
        onAddComment(facility.id, newComment, newRating);
        setNewComment('');
        setNewRating(0);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
    }
  };

  // Function to handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // Refresh comments after deletion
      fetchComments(facility.id);
      // Also update the parent component state
      onDeleteComment(facility.id, commentId);
      
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Calculate average rating from fetched comments
  const averageRating = comments.length > 0
    ? comments.reduce((acc, comment) => acc + (comment.rating || 0), 0) / comments.length
    : 0;

  // Check if current user has already rated this facility
  const userRatingComment = comments.find(comment => comment.user_id === currentUser?.id && comment.rating > 0);
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
          {loading ? (
            <p className="text-center py-4">Chargement des commentaires...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                <div className="flex items-center mb-1">
                  {comment.user?.profile_image ? (
                    <img
                      src={`http://localhost:8000/storage/${comment?.user.profile_image}`}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/32?text=U";
                      }}
                    />
                  ) : (
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="font-semibold ml-2">{comment.user?.name || 'Utilisateur'}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Delete button - only visible to admins */}
                  {currentUser && currentUser.role === 'admin' && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Supprimer ce commentaire"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {comment.rating > 0 && (
                  <div className="mb-1">
                    <StarRating rating={comment.rating} editable={false} />
                  </div>
                )}
                {comment.comment && <p className="text-gray-700">{comment.comment}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun commentaire pour le moment</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Display existing rating or allow adding a new one */}
          {userRating > 0 ? (
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
  const [image, setImage] = useState(null); // Store image file
  const [previewImage, setPreviewImage] = useState(''); // Store preview URL

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

      {/* Field: Name */}
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
          required
        />
      </div>

      {/* Field: Address */}
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
          required
        />
      </div>

      {/* Field: Sport Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="sportType">
          Type de sport
        </label>
        <select
          id="sportType"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
          required
        >
          <option value="">Sélectionnez un sport</option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Field: Capacity */}
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
          required
        />
      </div>

      {/* Field: Price per hour */}
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
          required
        />
      </div>

      {/* Field: Image */}
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
          required
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Prévisualisation"
            className="mt-2 w-full h-32 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Add button */}
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
  const [reservationModal, setReservationModal] = useState({
    isOpen: false,
    facilityId: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReservations, setUserReservations] = useState([]);

  const fetchStades = async () => {
    setLoading(true);
    setError(null);
    try {
      const rep = await fetch("http://127.0.0.1:8000/api/stades");
      if (!rep.ok) {
        throw new Error(`Failed to fetch facilities: ${rep.status}`);
      }
      const data = await rep.json();
      setFacilities(data);
    } catch (err) {
      console.error("Error fetching facilities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStades();
  }, []);

  const handleAddFacility = (newFacility) => {
    setFacilities((prevFacilities) => [...prevFacilities, newFacility]);
    setShowAddForm(false);
  };

  const handleDeleteFacility = async (id) => {
    try {
      const rep = await fetch(`http://127.0.0.1:8000/api/stades/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!rep.ok) {
        throw new Error(`Failed to delete facility: ${rep.status} ${rep.statusText}`);
      }
      
      // Update state after successful deletion
      setFacilities((prevFacilities) => prevFacilities.filter(facility => facility.id !== id));
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert(`Erreur lors de la suppression: ${error.message}`);
    }
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

  const openReservationModal = (facilityId) => {
    setReservationModal({
      isOpen: true,
      facilityId
    });
  };

  const closeReservationModal = () => {
    setReservationModal({
      isOpen: false,
      facilityId: null
    });
    // Refresh user reservations when modal closes
    fetchUserReservations();
  };

  const handleAddComment = (facilityId, commentText, rating) => {
    // This function will now be called after a successful backend update
    // It updates the local state to reflect changes in the UI
    setFacilities((prevFacilities) => 
      prevFacilities.map((facility) => {
        if (facility.id === facilityId) {
          // Since we're now fetching real comments from the backend,
          // we just need to mark the facility for re-render
          return { ...facility, commentCount: (facility.commentCount || 0) + 1 };
        }
        return facility;
      })
    );
  };

  const handleDeleteComment = (facilityId, commentId) => {
    // This function will be called after a successful backend deletion
    // It updates the local state to reflect changes in the UI
    setFacilities((prevFacilities) => 
      prevFacilities.map((facility) => {
        if (facility.id === facilityId) {
          // Since we're now fetching real comments from the backend,
          // we just need to mark the facility for re-render
          return { ...facility, commentCount: Math.max((facility.commentCount || 0) - 1, 0) };
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

  // Find the currently selected facility for modals
  const selectedFacility = facilities.find(f => f.id === commentsModal.facilityId || f.id === reservationModal.facilityId) || { comments: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">ArenaLink</h1>
          <p className="mt-2">Trouvez et réservez votre terrain de sport idéal</p>
        </div>
      </header>

      {/* User Reservations Section (if user is logged in) */}
      {currentUser && userReservations.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Mes réservations</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Terrain</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Heure</th>
                    <th className="px-4 py-2 text-left">Durée</th>
                    <th className="px-4 py-2 text-left">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {userReservations.map((reservation) => {
                    const startTime = new Date(reservation.start_time);
                    const facility = facilities.find(f => f.id === reservation.stade_id);
                    
                    return (
                      <tr key={reservation.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{facility ? facility.name : `Terrain #${reservation.stade_id}`}</td>
                        <td className="px-4 py-3">{startTime.toLocaleDateString()}</td>
                        <td className="px-4 py-3">{startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="px-4 py-3">{reservation.duration} {reservation.duration === 1 ? 'heure' : 'heures'}</td>
                        <td className="px-4 py-3">{reservation.total_price} MAD</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
              {/* City (free text field) */}
              <input
                type="text"
                placeholder="Entrez une ville..."
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />

              {/* Sport type */}
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

              {/* Price range */}
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
        )}

        {/* Add Facility Form */}
        {showAddForm && <AddFacilityForm onAdd={handleAddFacility} />}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Chargement des terrains...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>Erreur lors du chargement des terrains: {error}</p>
            <button 
              className="underline mt-2"
              onClick={fetchStades}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Aucun terrain trouvé</p>
          </div>
        )}

        {/* Facilities Grid */}
        {!loading && !error && (
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+non+disponible";
                  }}
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
                  {/* <div className="flex items-center mb-4">
                    <StarRating rating={facility.average_rating || 0} editable={false} />
                    <span className="ml-2 text-sm text-gray-600">
                      {facility.average_rating ? 
                        `(${parseFloat(facility.average_rating).toFixed(1)})` : 
                        "Aucun avis"}
                    </span>
                  </div> */}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {facility.price_per_hour} MAD<span className="text-sm">/heure</span>
                    </span>
                    <button 
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => openReservationModal(facility.id)}
                    >
                      Réserver
                    </button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {/* Delete button - only visible to admins and owners */}
                    {currentUser && (currentUser.role === 'admin' || 
                      (currentUser.role === "propriétaire" && currentUser.id === facility.user_id)) && (
                      <button
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        title="Supprimer"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Comments button */}
                    <button
                      onClick={() => openCommentsModal(facility.id)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                      title="Commentaires"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {facility.comment_count > 0 && (
                        <span className="ml-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          {facility.comment_count}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Modal */}
      <CommentsModal
        facility={selectedFacility}
        isOpen={commentsModal.isOpen}
        onClose={closeCommentsModal}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        hasRated={selectedFacility.user_has_rated}
      />

      {/* Reservation Modal */}
      <ReservationModal
        facility={selectedFacility}
        isOpen={reservationModal.isOpen}
        onClose={closeReservationModal}
      />
    </div>
  );
}

export default App;