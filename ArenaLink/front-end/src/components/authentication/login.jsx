import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layout/layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const URL = "http://127.0.0.1:8000/api";
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginResponse = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Connexion échouée');
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;
      navigate("/home");
      localStorage.setItem('authToken', token);
      console.log('Connexion réussie!', loginData);

      const userResponse = await fetch(`${URL}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Échec de récupération des données utilisateur');
      }

      const userData = await userResponse.json();
      console.log('Données utilisateur:', userData);
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
      console.error('Erreur:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');

    try {
      const response = await fetch(`${URL}/password/reset`, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!response.ok) {
        throw new Error('Échec d\'envoi du lien de réinitialisation');
      }

      setShowForgotPasswordModal(false);
    } catch (err) {
      setResetError('Échec d\'envoi du lien de réinitialisation. Veuillez réessayer.');
      console.error('Erreur:', err.message);
    }
  };

  return (
    <Layout>
      {/* Modal backdrop */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 space-y-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white tracking-wide">Réinitialiser le mot de passe</h2>
            <p className="text-sm text-center text-gray-200 leading-relaxed">
              Entrez votre email pour recevoir les instructions de réinitialisation.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-base font-medium text-white tracking-tight transition-all duration-300 ease-in-out hover:text-blue-300">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  placeholder="Entrez votre email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 mt-1 bg-transparent border border-gray-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none transition-all duration-300 ease-in-out"
                  onClick={() => setShowForgotPasswordModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                >
                  Envoyer le lien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className={`w-full max-w-md p-6 space-y-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg transition-all duration-300 ease-in-out ${showForgotPasswordModal ? 'opacity-0 pointer-events-none' : ''}`}>
        <h1 className="text-3xl font-bold text-center text-white tracking-wide">Connexion</h1>

        {error && <p className="text-sm text-center text-red-300">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-base font-medium text-white tracking-tight transition-all duration-300 ease-in-out hover:text-blue-300">
              Adresse email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                required
              />
              <span className="absolute right-4 top-3 text-gray-300">📧</span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-medium text-white tracking-tight transition-all duration-300 ease-in-out hover:text-blue-300">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3 text-gray-300 hover:text-blue-300 transition-all duration-300 ease-in-out"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-white transition-all duration-300 ease-in-out hover:text-blue-300">
              <input type="checkbox" className="mr-2 accent-blue-500" />
              Se souvenir de moi
            </label>
            <button
              type="button"
              className="text-sm text-white hover:underline transition-all duration-300 ease-in-out"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>

          <p className="text-sm text-center text-white leading-relaxed">
            Vous n'avez pas de compte ? <Link to="/register" className="text-blue-300 hover:underline transition-all duration-300 ease-in-out">S'inscrire</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;