
import React from 'react';
import { pol } from '../../utils/pol';
import TreeViewerControl from '../../components/tree/TreeViewer';

const datos = [
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Juan' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Ana' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Rosa' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Ana 1' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Juan 2' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Ana 3' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Centro', nombre: 'Ana 4' },
    { continente: 'Europa', pais: 'España', ciudad: 'Madrid', barrio: 'Salamanca', nombre: 'Luis' },
    { continente: 'Europa', pais: 'España', ciudad: 'Barcelona', barrio: 'Gràcia', nombre: 'Marta' },
    { continente: 'Europa', pais: 'España', ciudad: 'Barcelona', barrio: 'Eixample', nombre: 'Carlos' },
    { continente: 'Europa', pais: 'Francia', ciudad: 'París', barrio: 'Montmartre', nombre: 'Claire' },
    { continente: 'Europa', pais: 'Francia', ciudad: 'París', barrio: 'Latin', nombre: 'Luc' },
    { continente: 'Europa', pais: 'Francia', ciudad: 'Lyon', barrio: 'Presqu', nombre: 'Sophie' },
    { continente: 'Europa', pais: 'Italia', ciudad: 'Roma', barrio: 'Trastevere', nombre: 'Giulia' },
    { continente: 'Europa', pais: 'Italia', ciudad: 'Milán', barrio: 'Brera', nombre: 'Marco' },
    { continente: 'Europa', pais: 'Italia', ciudad: 'Milán', barrio: 'Navigli', nombre: 'Elena' },
    { continente: 'América', pais: 'Argentina', ciudad: 'Buenos Aires', barrio: 'Palermo', nombre: 'Carlos' },
    { continente: 'América', pais: 'Argentina', ciudad: 'Buenos Aires', barrio: 'Recoleta', nombre: 'Lucía' },
    { continente: 'América', pais: 'Argentina', ciudad: 'Córdoba', barrio: 'Nueva Córdoba', nombre: 'Martín' },
    { continente: 'América', pais: 'México', ciudad: 'CDMX', barrio: 'Polanco', nombre: 'Sofía' },
    { continente: 'América', pais: 'México', ciudad: 'CDMX', barrio: 'Roma', nombre: 'Diego' },
    { continente: 'América', pais: 'México', ciudad: 'Guadalajara', barrio: 'Zapopan', nombre: 'Andrea' },
    { continente: 'América', pais: 'EEUU', ciudad: 'Nueva York', barrio: 'Manhattan', nombre: 'John' },
    { continente: 'América', pais: 'EEUU', ciudad: 'Nueva York', barrio: 'Brooklyn', nombre: 'Emily' },
    { continente: 'América', pais: 'EEUU', ciudad: 'Los Ángeles', barrio: 'Hollywood', nombre: 'Chris' },
    { continente: 'Asia', pais: 'Japón', ciudad: 'Tokio', barrio: 'Shibuya', nombre: 'Yuki' },
    { continente: 'Asia', pais: 'Japón', ciudad: 'Tokio', barrio: 'Shinjuku', nombre: 'Hiro' },
    { continente: 'Asia', pais: 'Japón', ciudad: 'Osaka', barrio: 'Namba', nombre: 'Aiko' },
    { continente: 'Asia', pais: 'China', ciudad: 'Pekín', barrio: 'Chaoyang', nombre: 'Li' },
    { continente: 'Asia', pais: 'China', ciudad: 'Shanghái', barrio: 'Pudong', nombre: 'Mei' },
    { continente: 'Asia', pais: 'India', ciudad: 'Delhi', barrio: 'Connaught Place', nombre: 'Raj' },
    { continente: 'Asia', pais: 'India', ciudad: 'Mumbai', barrio: 'Andheri', nombre: 'Priya' },
    { continente: 'África', pais: 'Sudáfrica', ciudad: 'Ciudad del Cabo', barrio: 'Waterfront', nombre: 'Thabo' },
    { continente: 'África', pais: 'Sudáfrica', ciudad: 'Johannesburgo', barrio: 'Sandton', nombre: 'Zanele' },
    { continente: 'África', pais: 'Egipto', ciudad: 'El Cairo', barrio: 'Zamalek', nombre: 'Omar' },
    { continente: 'África', pais: 'Nigeria', ciudad: 'Lagos', barrio: 'Victoria Island', nombre: 'Ada' },
    { continente: 'Oceanía', pais: 'Australia', ciudad: 'Sídney', barrio: 'Bondi', nombre: 'Jack' },
    { continente: 'Oceanía', pais: 'Australia', ciudad: 'Melbourne', barrio: 'Fitzroy', nombre: 'Olivia' },
    { continente: 'Oceanía', pais: 'Nueva Zelanda', ciudad: 'Auckland', barrio: 'Ponsonby', nombre: 'Liam' },
    { continente: 'Europa', pais: 'Alemania', ciudad: 'Berlín', barrio: 'Kreuzberg', nombre: 'Anna' },
    { continente: 'Europa', pais: 'Alemania', ciudad: 'Múnich', barrio: 'Schwabing', nombre: 'Max' },
    { continente: 'Europa', pais: 'Alemania', ciudad: 'Hamburgo', barrio: 'Altona', nombre: 'Laura' },
    { continente: 'América', pais: 'Brasil', ciudad: 'São Paulo', barrio: 'Pinheiros', nombre: 'Bruno' },
    { continente: 'América', pais: 'Brasil', ciudad: 'Río de Janeiro', barrio: 'Copacabana', nombre: 'Fernanda' },
    { continente: 'América', pais: 'Canadá', ciudad: 'Toronto', barrio: 'Downtown', nombre: 'Alex' },
    { continente: 'América', pais: 'Canadá', ciudad: 'Vancouver', barrio: 'Gastown', nombre: 'Emma' },
    { continente: 'Asia', pais: 'Corea del Sur', ciudad: 'Seúl', barrio: 'Gangnam', nombre: 'Minho' },
    { continente: 'Asia', pais: 'Corea del Sur', ciudad: 'Busan', barrio: 'Haeundae', nombre: 'Jisoo' },
    { continente: 'Asia', pais: 'Tailandia', ciudad: 'Bangkok', barrio: 'Sukhumvit', nombre: 'Nok' },
    { continente: 'Asia', pais: 'Vietnam', ciudad: 'Hanói', barrio: 'Hoan Kiem', nombre: 'Trang' },
    { continente: 'Asia', pais: 'Vietnam', ciudad: 'Ciudad Ho Chi Minh', barrio: 'District 1', nombre: 'Nam' },
    { continente: 'Europa', pais: 'Portugal', ciudad: 'Lisboa', barrio: 'Alfama', nombre: 'Inês' },
    { continente: 'Europa', pais: 'Portugal', ciudad: 'Oporto', barrio: 'Ribeira', nombre: 'Miguel' },
    { continente: 'Europa', pais: 'Grecia', ciudad: 'Atenas', barrio: 'Plaka', nombre: 'Nikos' },
];


const renderNode = (node: { name: string, deep: number, parent?: any }) => (
    <div style={{ border: '0px solid #ccc', padding: '0px', margin: '5px 0' }}>
        <strong>{node.name}</strong> (Profundidad: {node.deep})
        {node.parent && <span style={{ marginLeft: '0px', color: '#666' }}>Padre: {node.parent.name}</span>}
        <hr style={{ margin: '5px 0' }} />
    </div>
);

const renderLeaf = (leaf: { name: string, deep: number, rows: any[], parent?: any }) => (
    <div data-key={'Detail-' + leaf.name}>
        <div style={{ border: '1px dashed #999', padding: '8px', margin: '5px 0', backgroundColor: '#f9f9f9' }}>
            <strong>{leaf.name}</strong> (Profundidad: {leaf.deep})
            {leaf.parent && <span style={{ marginLeft: '0px', color: '#666' }}>Padre: {leaf.parent.name}</span>}
        </div>
        <div className="w3-gray">
            {leaf.rows && leaf.rows.map((row, index) => (
                <p key={index} style={{ margin: '2px 0', fontSize: '0.9em' }}>
                    {index} - ID: {row.barrio}, Valor: {row.ciudad}, Nombre {row.nombre}
                </p>
            ))}
        </div>
    </div>
);


function GroupByNestedSamplePage() {

    const grouped = pol.arr(datos).groupByNested('continente', 'pais', 'ciudad', 'barrio');

    return (
        <>
            <div className="w3-container">
                <h2 className="">Ejemplo de uso de groupByNested.</h2>
                <div className="w3-container w3-padding">
                    <TreeViewerControl
                        tree={grouped}
                        nodeContent={renderNode}
                        leafContent={renderLeaf}
                    />
                </div>
            </div>


        </>
    )
}

export default GroupByNestedSamplePage;
