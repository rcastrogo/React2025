import { NavLink } from 'react-router-dom';
import configService from "../../services/configService";
import './Navbar.css';

function css(value?: boolean) {
    return 'w3-bar-item w3-button' + (value ? ' w3-right' : '');
}

const Navbar = () => {
    return (
        <nav className="navbar w3-bar w3-black">
            <button className="w3-button w3-left">
                <i className="w3-xlarge w3-left fa fa-bars"></i>
            </button>
            {configService.enlaces.map(item => (
                <div key={item.id}>
                    <NavLink to={item.route} className={css(item.right)}>
                        {item.text}
                    </NavLink>
                </div>
            ))}
        </nav>
    );
};

export default Navbar;
