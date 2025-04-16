import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))?.id || null;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city_state: '',
    postal_code: '',
    bio: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    profile_image: null,
  });
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      setUser(data);
      // Initialize form data with user data
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        country: data.country || '',
        city_state: data.city_state || '',
        postal_code: data.postal_code || '',
        bio: data.bio || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        linkedin: data.linkedin || '',
        twitter: data.twitter || '',
        profile_image: null, // File input starts empty
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    } else {
      setError('No user ID found');
      setLoading(false);
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const ChangeRole = async (data) => {
    fetch(`http://localhost:8000/api/changerole/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    } 
  );
  fetchUserProfile();
  }


  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_image: file, // Store the File object
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formDataObject = new FormData();

    // Append form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (key === 'profile_image' && formData[key] instanceof File) {
        formDataObject.append('profile_image', formData[key]);
      } else if (key !== 'profile_image') {
        formDataObject.append(key, formData[key] || '');
      }
    });

    try {
      const response = await fetch(`http://localhost:8000/api/modifier/${userId}`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          Accept: 'application/json',
        },
        body: formDataObject,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();

      setUser(updatedUser); 
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSavedSuccess(true);
      setEditMode(false);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {savedSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Profile updated successfully!</span>
            </div>
            <button onClick={() => setSavedSuccess(false)} className="text-green-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 left-0 h-full opacity-10">
              <div className="h-full w-full bg-pattern"></div>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-white">
                    {user.profile_image ? (
                      <img
                        src={
                          formData.profile_image instanceof File
                            ? URL.createObjectURL(formData.profile_image) 
                            : `http://localhost:8000/storage/${user.profile_image}`
                        }
                        alt="Profile"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-blue-600 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {editMode && (
                    <button
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
                    >
                      <label htmlFor="profile-image-upload" className="cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <input
                          id="profile-image-upload"
                          type="file"
                          className="hidden"
                          onChange={handleProfileImageUpload}
                          accept="image/*"
                        />
                      </label>
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <div className="flex items-center mt-2 text-blue-100">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p>{user.email}</p>
                  </div>
                  {user.city_state && (
                    <div className="flex items-center mt-1 text-blue-100">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p>
                        {user.city_state}
                        {user.country ? `, ${user.country}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 sm:mt-0">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition shadow-md flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          country: user.country || '',
                          city_state: user.city_state || '',
                          postal_code: user.postal_code || '',
                          bio: user.bio || '',
                          facebook: user.facebook || '',
                          instagram: user.instagram || '',
                          linkedin: user.linkedin || '',
                          twitter: user.twitter || '',
                          profile_image: null,
                        });
                      }}
                      className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isUploading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition shadow-md flex items-center"
                    >
                      {isUploading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'personal'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } focus:outline-none`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'social'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } focus:outline-none`}
              >
                Social Links
              </button>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {editMode ? (
              <form onSubmit={handleSubmit}>
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City/State</label>
                        <input
                          type="text"
                          name="city_state"
                          value={formData.city_state}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <input
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us a little about yourself"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {['facebook', 'instagram', 'linkedin', 'twitter'].map((platform) => (
                        <div key={platform} className="flex flex-col sm:flex-row sm:items-center">
                          <div className="sm:w-1/4">
                            <label className="block text-sm font-medium text-gray-700 capitalize">{platform}</label>
                          </div>
                          <div className="mt-1 sm:mt-0 sm:w-3/4">
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                {platform === 'facebook' && 'fb.com/'}
                                {platform === 'instagram' && 'instagram.com/'}
                                {platform === 'linkedin' && 'linkedin.com/in/'}
                                {platform === 'twitter' && 'twitter.com/'}
                              </span>
                              <input
                                type="text"
                                name={platform}
                                value={formData[platform]}
                                onChange={handleInputChange}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="username"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div>
                {activeTab === 'personal' && (
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-lg text-gray-900">{user.name}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-lg text-gray-900">{user.email}</dd>
                          </div>
                          {user.phone && (
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Phone</dt>
                              <dd className="mt-1 text-lg text-gray-900">{user.phone}</dd>
                            </div>
                          )}
                          {(user.city_state || user.country || user.postal_code) && (
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">Location</dt>
                              <dd className="mt-1 text-lg text-gray-900">
                                {user.city_state}
                                {user.country && `, ${user.country}`}
                                {user.postal_code && ` ${user.postal_code}`}
                              </dd>
                            </div>
                          )}
                          {user.bio && (
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">About</dt>
                              <dd className="mt-1 text-lg text-gray-900 whitespace-pre-line">{user.bio}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Member since</dt>
                            <dd className="mt-1 text-lg text-gray-900">
                              {new Date(user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                                {user && user.role === 'utilisateur' ?(
                                <>
                                  <dt className="text-sm font-medium text-gray-500">Changer mon role</dt>
                                  <dd className="mt-1 text-lg text-gray-900">
                                      <select
                                        name="role"
                                        value={formData.role || ''}
                                        onChange={(e) => ChangeRole({ role: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      >
                                        <option value="" disabled>
                                          choisir un role
                                        </option>
                                        <option value="propriétaire">Propriétaire</option>
                                        <option value="vendeur">Vendeur</option>
                                      </select>
                                  </dd>
                                </>
                                ) : user && user.role !== "admin" && user.is_confirmed == 0? (
                                  <>
                                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                                    <dd className="mt-1 text-lg text-gray-900">
                                      <span className="text-gray-500">en attant de confirmation</span>
                                    </dd>
                                  </>
                                 ) :  (
                                  <>
                                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                                    <dd className="mt-1 text-lg text-gray-900">
                                      <span className="text-gray-500">{user.role}</span>
                                    </dd>
                                  </>
                                )} 
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Social Links</h3>

                    {(user.facebook || user.instagram || user.linkedin || user.twitter) ? (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {user.facebook && (
                            <a
                              href={`https://facebook.com/${user.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                            >
                              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-500 text-white rounded-full">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Facebook</h4>
                                <p className="text-sm text-gray-500">{user.facebook}</p>
                              </div>
                            </a>
                          )}

                          {user.instagram && (
                            <a
                              href={`https://instagram.com/${user.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                            >
                              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Instagram</h4>
                                <p className="text-sm text-gray-500">{user.instagram}</p>
                              </div>
                            </a>
                          )}

                          {user.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${user.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                            >
                              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-700 text-white rounded-full">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">LinkedIn</h4>
                                <p className="text-sm text-gray-500">{user.linkedin}</p>
                              </div>
                            </a>
                          )}

                          {user.twitter && (
                            <a
                              href={`https://twitter.com/${user.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                            >
                              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-400 text-white rounded-full">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Twitter</h4>
                                <p className="text-sm text-gray-500">{user.twitter}</p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-16-7l4.586 4.586a2 2 0 002.828 0L20 9"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No social links added yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Add your social media profiles to connect with others
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;