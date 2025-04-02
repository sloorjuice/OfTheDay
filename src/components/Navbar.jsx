import '../css/Navbar.css';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const date_link = "https://www.google.com/search?sca_esv=b657747ebb3c27f5&sxsrf=AHTn8zq7MTJ6dSA0iuoPBp-MQ32vEXUr2g:1743553914035&q=Today%27s+date&spell=1&sa=X&ved=2ahUKEwj3kMW9jLiMAxVavokEHbX9GFkQBSgAegQICxAB";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/"><strong>Of The Day!</strong></Link>
                </div>
                
                <div className="navbar-date">
                    <a href={date_link} target="_blank" rel="noopener noreferrer">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </a>
                </div>
                
                <div className="navbar-menu">
                    <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
                        <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    
                    <ul className={menuOpen ? 'open' : ''}>
                        <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
                        <li><NavLink to="/music" onClick={() => setMenuOpen(false)}>Music</NavLink></li>
                        <li><NavLink to="/pokemon" onClick={() => setMenuOpen(false)}>Pokemon</NavLink></li>
                        <li><NavLink to="/games" onClick={() => setMenuOpen(false)}>Games</NavLink></li>
                        <li><NavLink to="/movies" onClick={() => setMenuOpen(false)}>Movies</NavLink></li>
                        <li><NavLink to="/tv" onClick={() => setMenuOpen(false)}>TV Shows</NavLink></li>
                        <li><NavLink to="/books" onClick={() => setMenuOpen(false)}>Books</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;