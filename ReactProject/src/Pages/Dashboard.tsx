
import PubSub from "../components/Pubsub";
import { useModal } from '../hooks/useModal';

const Dashboard = () => {

    const { showModal, closeModal, showNotification } = useModal();

    const showMessage = () => {
        PubSub.publish('MSG_INFO', 'Los datos se han guardado');
    }

    const openConfirmDialog = () => {
        showModal({
            title: 'Confirmación',
            content: (
                <div>
                    <h4>Grabar elemento</h4>
                    <p>¿Estás seguro de guardar los cambios?</p>
                </div>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>,
                <button className="w3-button w3-gray" onClick={showMessage}>Grabar</button>
            ],
            beforeClose: () => {
                return true;
            },
            allowManualClose: false
        });
    };

    const openConfirmDialogNoTitle = () => {
        showModal({
            title: '',
            content: (
                <div>
                    <h4>Grabar elemento</h4>
                    <p>¿Estás seguro de guardar los cambios?</p>
                </div>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>,
                <button className="w3-button w3-gray" onClick={showMessage}>Grabar</button>
            ],
            beforeClose: () => {
                return true;
            },
            allowManualClose: true
        });
    };

    const loginDialogContent = (
        <form className="w3-container" action="/action_page.php">
            <div className="w3-section">
                <label><b>Username</b></label>
                <input className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Username" name="usrname" required></input>
                <label><b>Password</b></label>
                <input className="w3-input w3-border" type="password" placeholder="Enter Password" name="psw" required></input>
                <button className="w3-button w3-block w3-green w3-section w3-padding" type="submit">Login</button>
                <input className="w3-check w3-margin-top" type="checkbox"></input> Remember me
                <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
                    <button type="button" className="w3-button w3-red">Cancel</button>
                    <span className="w3-right w3-padding w3-hide-small">Forgot <a href="#">password?</a></span>
                </div>
            </div>
        </form>
    );

    const openConfirmDialog2 = () => {
        showModal({
            title: 'Confirmación',
            content: (
                <p>¿Deseas continuar con la acción?</p>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>,
                <button className="w3-button w3-gray" onClick={showMessage}>Grabar</button>,
                <button className="w3-button w3-gray" onClick={() => alert('Limpiado')}>Limpiar</button>
            ],
            beforeClose: () => {
                const close = window.confirm('¿Estás seguro de cerrar el diálogo?');
                return close;
            },
            allowManualClose: false
        });
    };

    const openInfoDialog = () => {
        showModal({
            title: 'Informacion',
            content: loginDialogContent,
            showCloseButton: true,
            allowManualClose: true
        });
    };

    const openInfoDialog2 = () => {
        showModal({
            title: 'Informacion',
            content: (
                <p>Los datos están en el repositorio</p>
            ),
            showCloseButton: false,
            allowManualClose: true
        });
    };

    const openNoTitleDialog = () => {
        showModal({
            title: '',
            content: (
                <p>Los datos están en el repositorio</p>
            ),
            showCloseButton: false,
            allowManualClose: true
        });
    };

    return (
        <>
            <div className="w3-container">
                <h2 className="">Panel de control</h2>
                <div className="w3-bar">
                    <button onClick={openConfirmDialog} className="w3-button w3-black">
                        Confirmación
                    </button>
                    <button onClick={openConfirmDialogNoTitle} className="w3-button w3-black">
                        Confirmación sin título
                    </button>
                    <button onClick={openConfirmDialog2} className="w3-button w3-teal">
                        LoginDlg
                    </button>
                    <button onClick={openInfoDialog} className="w3-button w3-blue">
                        Confirm
                    </button>
                    <button onClick={openInfoDialog2} className="w3-button w3-red">
                        Mensaje
                    </button>
                    <button onClick={() => showNotification('Hola', 1000)} className="w3-button w3-yellow">
                        Notificación con título
                    </button>
                    <button onClick={openNoTitleDialog} className="w3-button w3-yellow">
                        Notificación sin título
                    </button>
                </div>
            </div>

        </>
    )

}

export default Dashboard;