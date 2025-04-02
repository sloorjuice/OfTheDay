import '../css/Navbar.css';
import { Link } from 'react-router-dom';

const date_link = "https://www.google.com/search?sca_esv=b657747ebb3c27f5&sxsrf=AHTn8zq7MTJ6dSA0iuoPBp-MQ32vEXUr2g:1743553914035&q=Today%27s+date&spell=1&sa=X&ved=2ahUKEwj3kMW9jLiMAxVavokEHbX9GFkQBSgAegQICxAB";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    {/* Site name will go here */}
                    <Link to="/"><strong>Of The Day!</strong></Link>
                </div>
                
                <div className="navbar-date">
                    {/* Date will go here */}
                    <a href={date_link} target="_blank" rel="noopener noreferrer">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </a>
                </div>
                
                <div className="navbar-menu">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/music">Music</Link></li>
                        <li><Link to="/pokemon">Pokemon</Link></li>
                        <li><Link to="/games">Games</Link></li>
                        <li><Link to="/movies">Movies</Link></li>
                        <li><Link to="/tv">TV Shows</Link></li>
                        <li><Link to="/books">Books</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;