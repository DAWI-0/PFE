import React, { useState } from 'react';
import Layout from '../layout/layout';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const URL = 'http://127.0.0.1:8000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Réinitialiser les erreurs

    // Validation côté client : Vérifier si les mots de passe correspondent
    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: ['Les mots de passe ne correspondent pas.'] });
      return;
    }

    setIsLoading(true); // Définir l'état de chargement

    try {
      const response = await fetch(`${URL}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/login');
      } else {
        // Gérer correctement les erreurs
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: ['Une erreur est survenue. Veuillez réessayer plus tard.'] });
        }
      }
    } catch (error) {
      setErrors({ general: ['Une erreur est survenue. Veuillez réessayer plus tard.'] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md p-6 space-y-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Créer un compte</h1>

        {/* Message d'erreur général */}
        {errors.general && <p className="text-sm text-center text-red-300">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Champ Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Nom
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder="Entrez votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-white"
                required
              />
              <span className="absolute right-3 top-3 text-gray-300">👤</span>
            </div>
            {errors.name && <p className="text-sm text-red-300">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>}
          </div>

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-white"
                required
              />
              <span className="absolute right-3 top-3 text-gray-300">📧</span>
            </div>
            {errors.email && <p className="text-sm text-red-300">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-white"
                required
              />
              <span className="absolute right-3 top-3 text-gray-300">🔒</span>
            </div>
            {errors.password && <p className="text-sm text-red-300">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</p>}
          </div>

          {/* Champ Confirmation du mot de passe */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-white">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                id="password_confirmation"
                placeholder="Confirmez votre mot de passe"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border-b border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-white"
                required
              />
              <span className="absolute right-3 top-3 text-gray-300">🔒</span>
            </div>
            {errors.password_confirmation && (
              <p className="text-sm text-red-300">{Array.isArray(errors.password_confirmation) ? errors.password_confirmation[0] : errors.password_confirmation}</p>
            )}
          </div>

          {/* Bouton d'envoi */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </div>

          {/* Lien de connexion */}
          <p className="text-sm text-center text-white">
            Vous avez déjà un compte ? <Link to="/login" className="text-blue-300 hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Register;