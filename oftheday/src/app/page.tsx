"use client"

import React from 'react';
import QuoteComponent from '../components/QuoteComponent';
import '../css/Home.css'; // Import the Home-specific styles
// Import other components as needed

export default function Home() {
  return (
    <div className="home-page">
    <h1 className="welcome-heading">
      Welcome to <span className="highlight-text">Of The Day</span>!
    </h1>
    
    {/* Quote of the Day Section */}
    <section className="quote-section">
      <h2>Quote of the Day:</h2>
      <QuoteComponent type="daily" />
    </section>
    
    {/* Other sections of your homepage */}
    </div>
  );
}
