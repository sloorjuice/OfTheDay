import '../css/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <p>&copy; {new Date().getFullYear()} Anthony Reynolds. All rights reserved.</p>
                </div>
                <div className="footer-right">
                    <div className="social-icons">
                        <a href="https://linktr.ee/sloorjuice" target="_blank" rel="noopener noreferrer">Follow Me!</a>
                        <p>I Need Coffee. ^</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;