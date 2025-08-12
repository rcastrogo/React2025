
import { useEffect, useState } from "react";
import useCachedData from "../../hooks/useCachedData";


type TarjetaDinamicaProps<T> = {
    data: T[] | null;
};

const TarjetaDinamica = <T,>({ data }: TarjetaDinamicaProps<T>) => {
    if (!data || data.length === 0) return <p>No hay datos para mostrar.</p>;

    const headers = Object.keys(data[0] as object);

    return (
        <div className="pol-master-table-container">
            {data?.map((item, index) => (
                <div key={index} className="w3-quarter pol-master-table-item">
                    {headers.map(header => (
                        <div key={header} className="campo-tarjeta">
                            <span>{header}:</span>{" "}
                            {typeof item[header as keyof T] === "boolean"
                                ? item[header as keyof T]
                                    ? "✅"
                                    : "❌"
                                : String(item[header as keyof T])}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


const MasterTablesSamplePage = () => {

    const {
        initCache, clearCache,
        getCategoriasProducto, getDepartamentos, getEstadosPedido, getMonedas,
        getPaises, getRolesUsuario, getTiposDocumento, getTiposTransaccion
    } = useCachedData();
    const [progress, setProgress] = useState(0);
    const [cacheVersion, setCacheVersion] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Iniciando...');
    const [isLoaded, setIsLoaded] = useState(false);

    const onFinishLoading = () => { setIsLoaded(true) };

    useEffect(() => {
        const init = async () => {
            try {
                await initCache((progress, message) => {
                    setProgress(progress);
                    setLoadingMessage(message);
                });
                setTimeout(onFinishLoading, 500);
            } catch (error) {
                console.error('Error al cargar datos maestros:', error);
                setLoadingMessage('Error al cargar datos. Por favor, reinicie la app.');
            }
        };

        init();
    }, [cacheVersion]);

    const reloadCache = () => {
        setIsLoaded(false);
        setProgress(0);
        setLoadingMessage('Inicializando');
        clearCache();
        setCacheVersion(prev => prev + 1);
    }

    useEffect(() => {

    }, []);


    if (!isLoaded)
        return (
            <div className="w3-container">
                <h2 className="">Cache de tablas maestras</h2>
                <div className="w3-border w3-round-large w3-center">
                    <p style={{margin: 0, marginLeft: '10%', width: '80%', marginTop: '10px' }}>{loadingMessage}</p>
                    <div style={{
                        width: '80%', height: '30px', backgroundColor: '#e0e0e0', borderRadius: '10px',
                        marginTop: '0', overflow: 'hidden', marginLeft: '10%'
                    }}>
                        <div style={{
                            width: `${progress}%`, height: '100%', backgroundColor: '#007bff',
                            transition: 'width 0.3s ease-in-out'
                        }}></div>
                    </div>
                    <p style={{ marginTop: '10px' }}>{progress}%</p>
                </div>
            </div>
        );

    return (
        <>
            <div className="w3-container">
                <h2 className="">Cache de tablas maestras</h2>

                <button type="button" onClick={() => reloadCache()} className="w3-button w3-red">Recargar la cache</button>

                <h3>CategoriasProducto</h3>
                <TarjetaDinamica data={getCategoriasProducto()} />

                <h3>Paises</h3>
                <TarjetaDinamica data={getPaises()} />

                <h3>TiposTransaccion</h3>
                <TarjetaDinamica data={getTiposTransaccion()} />

                <h3>Monedas</h3>
                <TarjetaDinamica data={getMonedas()} />

                <h3>Departamentos</h3>
                <TarjetaDinamica data={getDepartamentos()} />

                <h3>EstadosPedido</h3>
                <TarjetaDinamica data={getEstadosPedido()} />

                <h3>TiposDocumento</h3>
                <TarjetaDinamica data={getTiposDocumento()} />

                <h3>RolesUsuario</h3>
                <TarjetaDinamica data={getRolesUsuario()} />
            </div>
        </>
    )
};

export default MasterTablesSamplePage;