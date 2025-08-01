
import { useEffect, useState, type ReactNode } from "react";
import ReportEngine, {
    type DetailRenderContext, type GroupFooterRenderContext,
    type GroupHeaderRenderContext, type HeaderRenderContext,
    type ReportDefinition, type TotalRenderContext
} from "../../components/ReportViewer/ReportEngine"
import proveedoresApiService, { type Proveedor } from '../../services/proveedorService.js';
import PubSub from "../../components/Pubsub";
import ReportViewer from "../../components/ReportViewer/ReportViewer.js";
import React from "react";

const ReportViewerTableModeSamplePage = () => {

    const [datos, setDatos] = useState<Proveedor[]>([]);
    const [cargando, setCargando] = useState(true);

    const RowWrapper = ({ children }: { children: ReactNode }) => {
        return (
            <tr>
                <td colSpan={5}>
                    {children}
                </td>
            </tr>
        );
    };

    const PageHeader1 = ({ ctx }: { ctx: HeaderRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <h1 key={ctx.reactkey} className="w3-teal w3-round w3-padding">Listado de proveedores</h1>
        </RowWrapper>
    );
    const PageHeader2 = ({ ctx }: { ctx: HeaderRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <div key={ctx.reactkey} className="pol-separator-line" style={{ height: '3px' }}></div>
        </RowWrapper>
    );

    const PageTotal1 = ({ ctx }: { ctx: TotalRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <h1 key={ctx.reactkey}>{ctx.recordCount} registros listados. ({ctx.G0.id})</h1>
        </RowWrapper>
    );

    const PageTotal2 = ({ ctx }: { ctx: TotalRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <div key={ctx.reactkey} className="pol-separator-line"></div>
        </RowWrapper>
    );

    const PageDetail1 = ({ ctx }: { ctx: DetailRenderContext<Proveedor>; }) => (
        <tr key={ctx.reactkey + '_' + ctx.id} className="pol-table-row">
            <td>{ctx.data.id}</td>
            <td>{ctx.data.nif}</td>
            <td>{ctx.data.nombre}</td>
            <td>{ctx.data.descripcion}</td>
            <td>{ctx.data.fechaDeAlta}</td>
        </tr>
    );

    const PageG1 = ({ ctx }: { ctx: GroupHeaderRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <span key={ctx.reactkey} className="">Descripción: {ctx.current}</span>
        </RowWrapper>
    );
    const PageFooterG1 = ({ ctx }: { ctx: GroupFooterRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <h3 key={ctx.reactkey} className="w3-right-align" >{ctx.data.recordCount} registros ({ctx.data.summary.id})</h3>
        </RowWrapper>
    );

    const PageG2 = ({ ctx }: { ctx: GroupHeaderRenderContext<Proveedor>; }) => (
        <React.Fragment key={ctx.reactkey + '_' + ctx.current}>
            <RowWrapper>
                <span className="w3-right-left">NIF: {ctx.current}</span>
            </RowWrapper>
            <tr className="pol-table-row-header w3-teal">
                <td>Id</td>
                <td>Nif</td>
                <td>Nombre</td>
                <td>Descripcion</td>
                <td>FechaDeAlta</td>
            </tr>
        </React.Fragment>

    );
    const PageFooterG2 = ({ ctx }: { ctx: GroupFooterRenderContext<Proveedor>; }) => (
        <RowWrapper>
            <h4 key={ctx.reactkey} className="w3-right-align">{ctx.data.recordCount} registros ({ctx.data.summary.id})</h4>
        </RowWrapper>
    );

    const rd: ReportDefinition<Proveedor> = {
        sections: [
            { id: "H1", type: "header", valueProvider: (ctx) => <PageHeader2 ctx={ctx} /> },
            { id: "H2", type: "header", valueProvider: (ctx) => <PageHeader1 ctx={ctx} /> },
            { id: "H3", type: "header", valueProvider: (ctx) => <PageHeader2 ctx={ctx} /> },
            {
                id: "G1", type: 'group', key: "descripcion", resume: true,
                valueProvider: (ctx) => <PageG1 ctx={ctx} />,
                footerValueProvider: (ctx) => <PageFooterG1 ctx={ctx} />
            },
            {
                id: "G2", type: 'group', key: "nif", resume: true,
                valueProvider: (ctx) => <PageG2 ctx={ctx} />,
                footerValueProvider: (ctx) => <PageFooterG2 ctx={ctx} />
            },
            { id: "D1", type: 'detail', valueProvider: (ctx) => <PageDetail1 ctx={ctx} /> },
            { id: "T1", type: "total", valueProvider: (ctx) => <PageTotal1 ctx={ctx} /> },
            { id: "T2", type: "total", valueProvider: (ctx) => <PageTotal2 ctx={ctx} /> }
        ],
        summary: '{ "id" : 0 }',
        "orderBy": "descripcion,nif,id"
    };

    const obtenerDatos = async () => {
        PubSub.publish(PubSub.messages.SHOW_LAYER, "Recuperando datos");
        try {
            setCargando(true);
            const respuesta = await proveedoresApiService.getAll()
            setDatos(respuesta);
        } catch (err: any) {
        } finally {
            setCargando(false);
            PubSub.publish(PubSub.messages.HIDE_LAYER);
        }
    };

    useEffect(() => {
        obtenerDatos()
    }, []);

    return (
        <>
            <div className="w3-container">
                <h4>ReportViewer (renderAsTable=true)</h4>
                <button className="w3-button w3-gray w3-block"
                    onClick={obtenerDatos}
                    disabled={cargando}>Volver a generar</button>
                <p>
                </p>
                {!cargando && datos.length > 0 &&
                    <ReportViewer<Proveedor> reportDefinition={rd} data={datos} renderAsTable={true} />
                }
                {!cargando && datos.length === 0 && <p>No hay datos para mostrar el reporte. Haz clic en "Generar listado".</p>}
            </div>
        </>
    )
};

export default ReportViewerTableModeSamplePage;