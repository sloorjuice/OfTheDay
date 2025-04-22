"use client"

import React, { useState, useEffect } from 'react';
import { getQuoteOfTheDay, getRandomQuote } from '../services/ZenQuotes';
import '../css/QuoteComponent.css';

const QuoteComponent = ({ type = 'daily' }) => {
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      try {
        let result;
        
        if (type === 'daily') {
          result = await getQuoteOfTheDay();
        } else {
          result = await getRandomQuote();
        }
        
        setQuote(result);
        setError(null);
      } catch (err) {
        setError(null);
        console.error('Error in QuoteComponent:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [type]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await getRandomQuote();
      setQuote(result);
      setError(null);
    } catch (err) {
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="quote-container loading">Loading wisdom...</div>;
  }

  if (error) {
    return <div className="quote-container error">{error}</div>;
  }

  return (
    <div className="quote-container">
      <blockquote className="quote">
        <p className="quote-text">{quote.quote}</p>
        <footer className="quote-author">— {quote.author}</footer>
      </blockquote>
      {type !== 'daily' && (
        <button className="refresh-quote-btn" onClick={handleRefresh}>
          New Quote
        </button>
      )}
    </div>
  );
};

export default QuoteComponent;