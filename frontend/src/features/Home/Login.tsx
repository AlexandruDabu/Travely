import React, { useEffect, useState } from 'react';
import useAuth from '../../app/hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoggedInHomePage from './HomePage';
import Select from 'react-select';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import axios from 'axios';
import useSocket from '../../app/hooks/useSocket';

const images = [
  { src: './image1.jpg' },
  { src: './image2.jpg' },
  { src: './imageTravel.jpg' }
];

function Login() {
  const { login, isLoggedIn, register } = useAuth();
  const { reconnectSocket } = useSocket();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [countryOptions, setCountryOptions] = useState<{ value: string, label: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(''); // state for selected random image
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    city: '',
    country: '' || null,
  });

  // Select a random image once when component is mounted
  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)].src;
    setSelectedImage(randomImage);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    setUserData({
      ...userData,
      [name]: e.target.value,
    });
  };

  const handleCountryChange = (selectedOption: any) => {
    setUserData({
      ...userData,
      country: selectedOption.label
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (userData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (isRegister) {
        await register(userData);
      } else {
        await login(userData);
      }
      navigate('/travels');
    } catch (err) {
      if (isRegister) {
        setError('An account with this email already exists!');
      } else {
        setError('Incorrect email or password');
      }
    } finally {
      reconnectSocket(localStorage.getItem('authToken'));
    }
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataCountries = await axios.get('https://api.countrystatecity.in/v1/countries', {
          headers: {
            'X-CSCAPI-KEY': 'Z2RYZGRKWkpUZHNwWFJ3MnQ3NjdVVTA1NkRIc3dEdTd2YzliVTJWWQ=='
          }
        });
        setCountryOptions(dataCountries.data.map((country: any) => ({
          value: country.iso2,
          label: country.name
        })));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isLoggedIn) {
    return <LoggedInHomePage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-100">
      <div className="bg-white bg-opacity-90 flex w-full max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden min-h-[85vh]">
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-800 mb-6">
            {isRegister ? 'Create an Account' : 'Sign In to Your Account'}
          </div>
          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 text-sm text-red-600">
                {error}
              </div>
            )}
            {isRegister && (
              <>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    onChange={onChange}
                    value={userData.firstName}
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    onChange={onChange}
                    value={userData.lastName}
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">
                    Country
                  </label>
                  <Select
                    value={countryOptions.length == 0 ? '' : countryOptions.find(option => option.label == userData.country)}
                    onChange={handleCountryChange}
                    options={countryOptions}
                    placeholder="Select a country"
                    className="mt-1 text-xs"
                    isSearchable
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">
                    City
                  </label>
                  <input
                    onChange={onChange}
                    value={userData.city}
                    type="text"
                    name="city"
                    id="city"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700">
                Email Address
              </label>
              <input
                onChange={onChange}
                value={userData.email}
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <input
                onChange={onChange}
                value={userData.password}
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                min={8}
                required
              />
            </div>
            {!isRegister && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-xs text-gray-600">
                    Remember me
                  </label>
                </div>
                <div className="text-xs">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md text-xs font-semibold hover:bg-indigo-700 transition duration-300"
            >
              {isRegister ? 'Register' : 'Sign In'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-600">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleRegister}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Not a member?{' '}
                <button
                  onClick={toggleRegister}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Register
                </button>
              </>
            )}
          </p>
          {!isRegister && (
            <div className="mt-4">
              <div className="flex items-center justify-center">
                <span className="border-t border-gray-300 w-full"></span>
                <span className="px-2 text-xs text-gray-600 flex-shrink-0">
                  Or continue with
                </span>
                <span className="border-t border-gray-300 w-full"></span>
              </div>
              <div className="flex mt-3 space-x-2">
                <a
                  href="#"
                  className="flex-1 bg-white text-gray-600 border border-gray-300 p-2 rounded-md flex items-center justify-center hover:bg-gray-50 transition duration-300 text-xs"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="h-4 w-4 mr-2"
                  />
                  Google
                </a>
                <a
                  href="#"
                  className="flex-1 bg-white text-gray-600 border border-gray-300 p-2 rounded-md flex items-center justify-center hover:bg-gray-50 transition duration-300 text-xs"
                >
                  <img
                    src="https://www.svgrepo.com/show/349375/github.svg"
                    alt="GitHub"
                    className="h-4 w-4 mr-2"
                  />
                  GitHub
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src={selectedImage} // Use the selected image
            alt="Travel"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
