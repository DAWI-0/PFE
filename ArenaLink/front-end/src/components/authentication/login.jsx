import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import Layout from '../layout/layout';





const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate()
  const URL="http://127.0.0.1:8000/api"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Step 1: Login and get the token
      const loginResponse = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: {
          "Accept": "application/json", 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;
      navigate("/interface")

      // Save the token to localStorage
      localStorage.setItem('authToken', token);
      console.log('Login successful!', loginData);

      // Step 2: Fetch user data using the token (optional)
      const userResponse = await fetch(`${URL}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('User data:', userData);

      // Redirect or handle successful login (e.g., update global state)
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen w-[600px]">
        <div className="w-full max-w-md p-5 -space-y-0 bg-green-600 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>

          {/* General error message */}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-min px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                className="ml-2 w-min px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Link to="/register">Register</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;