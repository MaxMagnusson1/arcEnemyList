import {Link} from 'react-router-dom';
import './Components.css'; 

function Navigation() {
    return (
        <nav className="navigation">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Enemies</Link>
                </li>
                <li className="nav-item">
                    <Link to="/Friends" className="nav-link">Friends</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;