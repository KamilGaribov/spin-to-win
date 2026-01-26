import "styles/navbar.css";


export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="https://balique.az" className="navbar-logo" target="_blank" rel="noreferrer">
                    <img
                        src="logo.png"
                        alt="Logo"
                    />
                </a>
                <h1 className="navbar-title">Balique</h1>
            </div>

            <ul className="navbar-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
}
