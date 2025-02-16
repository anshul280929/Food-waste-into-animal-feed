import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Home, User, Mail, LogOut } from 'lucide-react';

// Farm theme colors
const colors = {
  primary: '#2F5233',    // Deep forest green
  secondary: '#8B4513',  // Saddle brown
  accent: '#556B2F',     // Dark olive green
  highlight: '#8F9779',  // Sage green
  background: '#F5F5DC', // Beige
  lightAccent: '#A9B388', // Light sage
  text: '#463E3F',       // Dark brown text
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="shadow-md" style={{ backgroundColor: colors.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-2">
              <Leaf size={24} className="text-white" />
              <span className="font-bold text-xl text-white">FarmNutrition</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/home" 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <User size={18} />
              <span>Portfolio</span>
            </Link>
            
            <Link 
              to="/contact" 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <Mail size={18} />
              <span>Contact</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition-colors"
              style={{ backgroundColor: colors.secondary }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;