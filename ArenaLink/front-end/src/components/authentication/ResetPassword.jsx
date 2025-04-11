import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const URL = 'http://127.0.0.1:8000/api';

  const { token: tokenParam } = useParams(); // Route: /password-reset/:token
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');

    console.log('Parsed:', { emailParam, tokenParam }); // Debug

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    } else {
      setError('Invalid reset link. Please try again.');
    }
  }, [location, tokenParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending:', { token, email, password, password_confirmation: passwordConfirmation }); // Debug
      const response = await fetch(`${URL}/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Ensure JSON response
          // Add 'X-CSRF-TOKEN': 'your-token' if required by backend
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
        redirect: 'manual', // Prevent auto-redirect
      });

      console.log('Response status:', response.status, 'Type:', response.type); // Debug

      if (response.status === 302) {
        const locationHeader = response.headers.get('Location');
        throw new Error(`Unexpected redirect to: ${locationHeader || 'unknown URL'}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData); // Debug
        throw new Error(
          errorData.errors?.email?.[0] ||
          errorData.message ||
          `Server error: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log('Success response:', responseData); // Debug
      setSuccess(responseData.data?.status || responseData.message || 'Password reset successfully!');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      console.error('Fetch error:', err); // Debug
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
            <a href="/login" className="text-indigo-600 hover:underline">
              Go to Login
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;