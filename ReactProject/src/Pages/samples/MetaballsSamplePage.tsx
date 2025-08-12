
import { useEffect, useState, type ReactNode } from "react";
import CreditsScreen from "../../components/forms/CreditsScreen";


const MetaballsSamplePage = () => {

    const [content, setContent] = useState<ReactNode>(null);

    const handleExitCredits = () => {
        setContent(null);
    };

    function create() {
        return (
            <div className="w3-display-middle w3-center" style={{ width: '100%', height: '100%' }}>
                <CreditsScreen
                    onExit={handleExitCredits}
                    gameWidth={900}
                    gameHeight={900}
                    particleSize={.8325}
                    particleDensity={1.525} // Menor valor = más partículas
                    metaballCount={7} // Más metaballs
                    textScale={30}
                    fadeDurationEnter={1500}
                    fadeDurationLeave={2000}
                    titleText="R e a c t"
                    showPaticles={true}

                />
            </div>
        )
    };

    const handleButtonClick = () => {
        setContent(create());
    }

    useEffect(() => {
        setContent(create());
    }, []);

    return (
        <>
            <div className="w3-container">
                <h2 className="">Metaballs</h2>
                <p>
                    Los "metaballs" son una técnica de representación gráfica que crea formas suaves y orgánicas,
                    similares a gotas de líquido o nubes, a partir de la suma de funciones matemáticas.
                    Estas funciones, a menudo esferas o curvas, se combinan para generar una superficie que
                    se ve como si estuviera hecha de una sustancia viscosa.
                    La técnica es popular en gráficos 3D para crear efectos visuales atractivos y orgánicos.
                </p>
                <button className="w3-button w3-gray" onClick={() => handleButtonClick()}>Mostrar</button>
            </div>
            {content}
        </>
    )

}

export default MetaballsSamplePage;