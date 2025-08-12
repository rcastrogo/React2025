
import { useEffect, useRef, useState, type ComponentType } from "react";
import ReportViewerSamplePage from "./samples/ReportViewerSamplePage";
import ReportViewerTableModeSamplePage from "./samples/ReportViewerTableModeSamplePage";
import ComboBoxSamplePage from "./samples/ComboBoxSamplePage";
import ListControlSamplePage from "./samples/ListControlSamplePage";
import AutocompleteControlSamplePage from "./samples/AutocompleteControlSamplePage";
import useDebounce from "../hooks/useDebounce";
import GroupByNestedSamplePage from "./samples/GoupByNestedSamplePage";

interface SamplePageConfig {
    id: string;
    title: string;
    description: string;
    component: ComponentType<any>;
}

const samplePages: SamplePageConfig[] = [
    {
        id: 'report-viewer-basic',
        title: 'Informe',
        description: 'Visualiza un ejemplo de informe.',
        component: ReportViewerSamplePage,
    },
    {
        id: 'report-viewer-table',
        title: 'Informe (tabla)',
        description: 'Visualiza un ejemplo de informe tabla HTML.',
        component: ReportViewerTableModeSamplePage,
    },
    {
        id: 'list-combobox',
        title: 'ComboBoxControl',
        description: 'Ejemplo de uso del control comboBox.',
        component: ComboBoxSamplePage,
    },
    {
        id: 'list-list-control',
        title: 'ListControl',
        description: 'Ejemplo de uso del control lista.',
        component: ListControlSamplePage,
    },
    {
        id: 'list-autocompete-control',
        title: 'AutoCompleteControl',
        description: 'Ejemplo de uso del control autocomplete.',
        component: AutocompleteControlSamplePage,
    },
    {
        id: 'tree-viewer-control',
        title: 'TreeViewerControl',
        description: 'Ejemplo de uso del control tree.',
        component: GroupByNestedSamplePage,
    },
];

const Home = () => {

    const [ActiveSampleComponent, setActiveSampleComponent] = useState<ComponentType<any> | null>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {

    }, []);


    const handleResize = () => {
        if (listRef.current) {
            const items = listRef.current.querySelectorAll('li');
            let maxHeight = 0;
            items.forEach(item => {
                item.style.height = 'auto';
                const height = item.getBoundingClientRect().height;
                if (height > maxHeight) maxHeight = height;
            });

            items.forEach(item => item.style.height = `${maxHeight}px`);
        }
    }

    const resize = useDebounce(handleResize, 100);

    useEffect(() => {
        window.addEventListener('resize', resize);
        handleResize()
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);


    return (
        <>
            <div className="w3-container">
                <h2 className="">Página principal</h2>
                <div className="pol-separator-line"></div>
                <div className="w3-panel w3-border">
                    <h4 className="w3-center">Páginas de ejemplo</h4>
                    <ul className="w3-ul w3-border-top w3-hoverable" ref={listRef}>
                        <li
                            className="w3-bar w3-white w3-hover-light-grey w3-quarter"
                            onClick={() => setActiveSampleComponent(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="w3-bar-item">
                                <span className="w3-large">Ocultar Todos los Ejemplos</span><br />
                                <span>No mostrar ningún informe de ejemplo.</span>
                            </div>
                        </li>

                        {samplePages.map((page) => (
                            <li
                                key={page.id}
                                className="w3-bar w3-white w3-hover-light-grey w3-quarter"
                                onClick={() => setActiveSampleComponent(() => page.component)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="w3-bar-item">
                                    <span className="w3-large">{page.title}</span><br />
                                    <span>{page.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pol-separator-line" style={{ marginTop: '20px' }}></div>
            </div>
            <div className="" style={{ height: '400px', overflow: 'auto' }}>
                {ActiveSampleComponent ? (
                    <ActiveSampleComponent />
                ) : (
                    <p className="w3-center w3-text-grey">
                        Selecciona un elemento de la lista para visualizar la página correspondiente.
                    </p>
                )}
            </div>
        </>
    );

};

export default Home;