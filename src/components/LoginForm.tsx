import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../types/form';
import { createUser } from '../services/api';
import { UserCircle2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserData>({
    rollNumber: '',
    name: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Disable scrolling when the component is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable scrolling
    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when the component is unmounted
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUser(formData);
      localStorage.setItem('rollNumber', formData.rollNumber);
      localStorage.setItem('userName', formData.name);
      navigate('/form');
    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Image and Text */}
      <div className="w-2.5/5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col justify-center items-center p-12">
        <div className="flex flex-1 items-center justify-center mb-4">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkvL9cDdyifUx2siGR7mJ85xUN7RgajkSYQg&s" 
            alt="Welcome"
            className="w-32 h-32 object-cover rounded-full shadow-lg"
          />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Dynamic Form</h1>
          <p className="text-lg">Your portal to easily submit forms</p>
          <a
            href="https://github.com/Aviral-Saxenaa/bajaj-final-form"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-lg hover:text-gray-300 transition"
          >
            Visit GitHub Repository
          </a>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-3/5 bg-gray-100 flex items-center justify-center p-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-md mb-4">
              <UserCircle2 className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Student Login</h2>
            <p className="text-gray-600 mt-2">Enter your details to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={formData.rollNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl shadow-md transition duration-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
