import React, { useState } from 'react';
import { authAPI } from '../services/api'; // ✅ Added import

const Login = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // ✅ Updated handleSubmit function to use email-based authentication
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Client-side validation for email domain
        if (!formData.email.endsWith('@iiitbh.ac.in')) {
          alert('Please use your IIIT Bhilai email address (@iiitbh.ac.in)');
          return;
        }

        // Sign up with backend
        const signupData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        };

        const response = await authAPI.signup(signupData);

        if (response.success) {
          const userData = {
            id: response.userId,
            name: response.fullName,
            email: response.email,
            initials: generateInitials(response.fullName)
          };
          onLogin(userData);
        } else {
          alert(response.message || 'Signup failed');
        }
      } else {
        // Login with backend
        const loginData = {
          email: formData.email,
          password: formData.password
        };

        const response = await authAPI.login(loginData);

        if (response.success) {
          const userData = {
            id: response.userId,
            name: response.fullName,
            email: response.email,
            initials: generateInitials(response.fullName)
          };
          onLogin(userData);
        } else {
          alert(response.message || 'Login failed');
        }
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isSignUp ? 'Sign Up' : 'Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={isSignUp ? "Enter your IIIT Bhilai email (@iiitbh.ac.in)" : "Enter your email"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-600 hover:underline"
          >
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
