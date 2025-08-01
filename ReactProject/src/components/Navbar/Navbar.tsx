import { NavLink } from 'react-router-dom';
import configService from "../../services/configService";
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function css(value?: boolean) {
    return 'w3-bar-item w3-button' + (value ? ' w3-right' : '');
}

const Navbar = () => {

    const navigate = useNavigate();

    return (
        <nav className="navbar w3-bar w3-black">
            <button className="w3-button w3-left" style={{ padding: '8px' }}>
                <i className="w3-xlarge w3-left fa fa-bars"></i>
            </button>
            {configService.enlaces.filter(e => e.text).map(item => (
                <div key={item.id}>
                    <NavLink to={item.route} className={css(item.right)}>
                        {item.text}
                    </NavLink>
                </div>
            ))}
            <button onClick={() => authService.logout()}
                className="w3-button w3-right"
                style={{ padding: '8px' }}>
                <i className="w3-xlarge w3-left fa fa-sign-out"></i>
            </button>
            <button onClick={() => navigate('/about')}
                className="w3-button w3-right"
                style={{ padding: '8px' }}>
                <i className="w3-xlarge w3-left fa fa-question"></i>
            </button>
        </nav>
    );

};

export default Navbar;
