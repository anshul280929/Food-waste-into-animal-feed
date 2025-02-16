import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import CSS file
import farmImage from '../assets/farm-background.jpg'; // Example image
import foodWasteImage from 'D:\\testing weird ass codes\\food.jpg';
import sustainabilityImage from '../assets/sustainability.jpeg';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="header">
        <h1>Food Waste to Animal Feed</h1>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src={farmImage} alt="Farm" className="hero-image"/>
        <div className="hero-text">
          <h2>Transforming Waste into Sustainable Nutrition</h2>
          <p>Every year, millions of tons of food go to waste. Instead of landfilling, we can convert this waste into nutritious feed for livestock, reducing environmental impact and improving food security.</p>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="info-section">
        <h2>Why Convert Food Waste into Animal Feed?</h2>
        <div className="info-cards">
          <div className="card">
            <img src={foodWasteImage} alt="Food Waste" />
            <h3>Reduces Waste</h3>
            <p>Food waste makes up 30% of global waste. Repurposing it for feed minimizes landfill overflow and methane emissions.</p>
          </div>
          <div className="card">
            <img src={sustainabilityImage} alt="Sustainability" />
            <h3>Supports Sustainability</h3>
            <p>Recycling nutrients back into the food chain promotes a circular economy and reduces the need for artificial feed production.</p>
          </div>
          <div className="card">
            <h3>Economic Benefits</h3>
            <p>Farmers can save on feed costs while food businesses find sustainable waste management solutions.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Join the Movement</h2>
        <p>Take action by adopting food waste conversion techniques and supporting sustainable feed solutions.</p>
        <button className="cta-button" onClick={() => navigate('/learn-more')}>Learn More</button>
      </section>
    </div>
  );
};

export default Dashboard;
