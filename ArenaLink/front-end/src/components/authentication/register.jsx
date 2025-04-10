import React, { useState } from 'react';
import Layout from '../layout/layout';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate=useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors

        // Client-side validation: Check if passwords match
        if (password !== passwordConfirmation) {
            setErrors({ password_confirmation: ['Passwords do not match.'] });
            return;
        }

        setIsLoading(true); // Set loading state

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                    address,
                    gender,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/interface') ; // Redirect to dashboard
            } else {
                setErrors(data.errors || {}); // Set validation errors
            }
        } catch (error) {
            setErrors({ general: ['An error occurred. Please try again later.'] }); // Handle server errors
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen w-[600px] ">
                <div className="w-full max-w-md p-5 -space-y-0  bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Create an Account</h1>
                    
                    {/* General error message */}
                    {errors.general && <p className="text-sm text-center text-red-500">{errors.general}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                        </div>

                        {/* Password Confirmation Field */}
                        <div>
                            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="passwordConfirmation"
                                placeholder="Confirm your password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation[0]}</p>}
                        </div>

                        {/* Address Field */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                id="address"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.address && <p className="text-sm text-red-500">{errors.address[0]}</p>}
                        </div>

                        {/* Gender Field */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <p className="text-sm text-red-500">{errors.gender[0]}</p>}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                
                                className="w-min px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                            <button 
                              type="submit"
                                className="ml-px w-min px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                                <Link to={"/login"}>login</Link> </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Register;