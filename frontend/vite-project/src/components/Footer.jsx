import React from 'react';
import { Link } from 'react-router-dom';

const colors = {
  primary: '#2F5233',    // Deep forest green
  secondary: '#8B4513',  // Saddle brown
  accent: '#556B2F',     // Dark olive green
  highlight: '#8F9779',  // Sage green
  background: '#F5F5DC', // Beige
  lightAccent: '#A9B388', // Light sage
  text: '#463E3F',       // Dark brown text
};

const Footer = () => (
  <footer style={{ backgroundColor: colors.primary }} className="text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <p className="text-gray-300">
            Providing innovative solutions for farm nutrition management and animal welfare.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/home" className="text-gray-300 hover:text-white">Home</Link></li>
            <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Portfolio</Link></li>
            <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            <li><Link to="/nutrition-chart" className="text-gray-300 hover:text-white">Nutrition Analysis</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Email: info@farmnutrition.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: 123 Farm Road, Rural County</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 flex-grow"
            />
            <button
              style={{ backgroundColor: colors.secondary }}
              className="px-4 py-2 rounded-lg hover:bg-brown-700 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-300">
        <p>&copy; 2024 FarmNutrition. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;