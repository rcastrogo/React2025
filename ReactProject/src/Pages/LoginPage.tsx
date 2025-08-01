
import React, { useCallback, useState } from 'react';
import authService from '../services/authService';


function LoginPage() {

    const [username, setUsername] = useState('user');
    const [password, setPassword] = useState('123');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>('');

    const handleLoginSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(
            <>
                Validando credenciales...
            </>
        );
        setIsLoading(true);
        const result = await authService.login(username, password);
        if (result.success) {
            setMessage(
                <>
                    <i className="w3-xlarge fa fa-check animated-check-icon"> </i> 
                    <span className="animated-check-icon"> Acceso concedido!</span> 
                </>
            )
        } else {
            setIsLoading(false);
            setMessage(result.error);
        }
    };

    const handleOlvideMiPassword = () => {
        setMessage(
            <>
                <b>Usuario: </b>user<br></br>
                <b>Contraseña: </b>123
            </>
        );
        setUsername('user');
        setPassword('123');
    }

    return (

        <div
            className="w3-display-container w3-teal"
            style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 999 }}
        >
            <div className="w3-display-middle w3-center w3-animate-opacity" style={{ minWidth: '300px', maxWidth: '500px', width: '50%' }}>
                <div className="w3-card-4 w3-white w3-round-large w3-padding-large">
                    <img
                        src="https://icon.icepanel.io/Technology/svg/Vite.js.svg"
                        alt="App Logo"
                        className="w3-image w3-round-xxlarge w3-animate-zoom"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h2 className="w3-text-dark-grey">Inicio de sesión</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <p>
                            <input
                                className="w3-input w3-border w3-round-large"
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onFocus={() => setMessage('')}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </p>
                        <p>
                            <input
                                className="w3-input w3-border w3-round-large"
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onFocus={() => setMessage('')}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </p>
                        {message && (
                            <div className="w3-panel">
                                {message}
                            </div>
                        )}
                        <p>
                            <button
                                className="w3-button w3-block w3-green w3-round-large w3-padding-large w3-margin-top"
                                type="submit"
                                disabled={isLoading}
                            >
                                Acceder
                            </button>
                        </p>
                    </form>

                    <p className="w3-small w3-text-dark-grey">
                        <a href="#"
                            onClick={() => handleOlvideMiPassword()}
                            className="w3-text-teal">¿Olvidaste tu contraseña?</a>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;