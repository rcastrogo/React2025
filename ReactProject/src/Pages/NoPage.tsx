
import { useNavigate } from "react-router-dom";

const NoPage = () => {

    const navigate = useNavigate();

    return (
            <div className="w3-display-middle w3-center w3-padding-large">
                <img
                    src="https://icon.icepanel.io/Technology/svg/Vite.js.svg"
                    alt="App Logo"
                    className="w3-image w3-round-xxlarge w3-margin-bottom w3-animate-zoom"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />

                <h1 className="w3-jumbo w3-animate-top pol-app-title">
                    React-App
                </h1>

                <h3 className="">
                    Error 404<br></br><small>Página no encontrada</small>
                </h3>
                <button className="w3-button" onClick={() => navigate('/')}>
                    <i className="w3-xlarge fa  fa-home"></i>
                </button>
            </div>
    )
};

export default NoPage;