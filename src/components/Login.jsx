import React, { useState } from 'react';
import { authAPI } from '../services/api'; // ✅ Added import

const Login = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Real-time validation for confirm password
    if (name === 'confirmPassword' && isSignUp) {
      if (value !== formData.password && value !== '') {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
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
    
    // Clear previous errors
    setErrors({});

    try {
      if (isSignUp) {
        // Validation
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        
        if (!formData.email.endsWith('@gmail.com')) {
          newErrors.email = 'Please use a Gmail address';
        }
        
        if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
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
        // Login validation
        const newErrors = {};
        
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        }
        
        if (!formData.password.trim()) {
          newErrors.password = 'Password is required';
        }
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md transform transition-all duration-300 mx-2 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {isSignUp ? 'Sign Up' : 'Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-light transition-colors duration-200 hover:rotate-90 transform"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          {isSignUp && (
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
                className={`w-full p-2 sm:p-3 border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none bg-gray-50 focus:bg-white peer text-sm sm:text-base ${
                  errors.fullName 
                    ? 'border-red-400 focus:border-red-500' 
                    : focusedField === 'fullName' || formData.fullName
                      ? 'border-orange-400 focus:border-orange-500' 
                      : 'border-gray-200 focus:border-orange-400'
                }`}
                placeholder=" "
                required
              />
              <label className={`absolute transition-all duration-300 pointer-events-none text-xs sm:text-sm ${
                focusedField === 'fullName' || formData.fullName
                  ? 'left-3 sm:left-4 -top-2 sm:-top-2.5 bg-white px-1 sm:px-2 text-orange-600 font-medium'
                  : 'left-3 sm:left-4 top-3 sm:top-4 text-gray-500'
              }`}>
                Full Name
              </label>
              {errors.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.fullName}</p>
              )}
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              className={`w-full p-2 sm:p-3 border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none bg-gray-50 focus:bg-white peer text-sm sm:text-base ${
                errors.email 
                  ? 'border-red-400 focus:border-red-500' 
                  : focusedField === 'email' || formData.email
                    ? 'border-orange-400 focus:border-orange-500' 
                    : 'border-gray-200 focus:border-orange-400'
              }`}
              placeholder=" "
              required
            />
            <label className={`absolute transition-all duration-300 pointer-events-none text-xs sm:text-sm ${
              focusedField === 'email' || formData.email
                ? 'left-3 sm:left-4 -top-2 sm:-top-2.5 bg-white px-1 sm:px-2 text-orange-600 font-medium'
                : 'left-3 sm:left-4 top-3 sm:top-4 text-gray-500'
            }`}>
              Email Address
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              className={`w-full p-2 sm:p-3 pr-8 sm:pr-10 border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none bg-gray-50 focus:bg-white peer text-sm sm:text-base ${
                errors.password 
                  ? 'border-red-400 focus:border-red-500' 
                  : focusedField === 'password' || formData.password
                    ? 'border-orange-400 focus:border-orange-500' 
                    : 'border-gray-200 focus:border-orange-400'
              }`}
              placeholder=" "
              required
            />
            <label className={`absolute transition-all duration-300 pointer-events-none text-xs sm:text-sm ${
              focusedField === 'password' || formData.password
                ? 'left-3 sm:left-4 -top-2 sm:-top-2.5 bg-white px-1 sm:px-2 text-orange-600 font-medium'
                : 'left-3 sm:left-4 top-3 sm:top-4 text-gray-500'
            }`}>
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors duration-200"
            >
              <img 
                src={showPassword ? "/eye-close.svg" : "/eye-open.svg"} 
                alt={showPassword ? "Hide password" : "Show password"}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.password}</p>
            )}
          </div>

          {isSignUp && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField('')}
                className={`w-full p-2 sm:p-3 pr-8 sm:pr-10 border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none bg-gray-50 focus:bg-white peer text-sm sm:text-base ${
                  errors.confirmPassword 
                    ? 'border-red-400 focus:border-red-500' 
                    : focusedField === 'confirmPassword' || formData.confirmPassword
                      ? 'border-orange-400 focus:border-orange-500' 
                      : 'border-gray-200 focus:border-orange-400'
                }`}
                placeholder=" "
                required
              />
              <label className={`absolute transition-all duration-300 pointer-events-none text-xs sm:text-sm ${
                focusedField === 'confirmPassword' || formData.confirmPassword
                  ? 'left-3 sm:left-4 -top-2 sm:-top-2.5 bg-white px-1 sm:px-2 text-orange-600 font-medium'
                  : 'left-3 sm:left-4 top-3 sm:top-4 text-gray-500'
              }`}>
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                <img 
                  src={showConfirmPassword ? "/eye-close.svg" : "/eye-open.svg"} 
                  alt={showConfirmPassword ? "Hide password" : "Show password"}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 animate-pulse">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            {isSignUp
              ? 'Already have an account?'
              : "Don't have an account?"
            }
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: ''
              });
              setErrors({});
              setFocusedField('');
            }}
            className="text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base transition-colors duration-200 hover:underline"
          >
            {isSignUp ? 'Login here' : 'Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
