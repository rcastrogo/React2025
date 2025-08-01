
import { useEffect, useState } from "react";
import ReportEngine, {
    type DetailRenderContext, type GroupFooterRenderContext,
    type GroupHeaderRenderContext, type HeaderRenderContext,
    type ReportDefinition, type TotalRenderContext
} from "../../components/ReportViewer/ReportEngine"
import proveedoresApiService, { type Proveedor } from '../../services/proveedorService.js';
import PubSub from "../../components/Pubsub";
import ReportViewer from "../../components/ReportViewer/ReportViewer.js";

const ReportViewerSamplePage = () => {

    const [datos, setDatos] = useState<Proveedor[]>([]);
    const [cargando, setCargando] = useState(true);

    const PageHeader1 = ({ ctx }: { ctx: HeaderRenderContext<Proveedor>; }) => (
        <h1 key={ctx.reactkey} className="w3-teal w3-round w3-padding">Listado de proveedores</h1>
    );
    const PageHeader2 = ({ ctx }: { ctx: HeaderRenderContext<Proveedor>; }) => (
        <div key={ctx.reactkey} className="pol-separator-line" style={{ height: '5px' }}></div>
    );

    const PageTotal1 = ({ ctx }: { ctx: TotalRenderContext<Proveedor>; }) => (
        <h1 key={ctx.reactkey}>Total {ctx.recordCount} registros  total {ctx.G0.id} </h1>
    );

    const PageTotal2 = ({ ctx }: { ctx: TotalRenderContext<Proveedor>; }) => (
        <div key={ctx.reactkey} className="pol-separator-line"></div>
    );

    const PageDetail1 = ({ ctx }: { ctx: DetailRenderContext<Proveedor>; }) => (
        <div key={ctx.reactkey + ctx.id} >{ctx.data.id} - {ctx.data.descripcion} - {ctx.summary.id}</div>
    );

    const PageDetail2 = ({ ctx }: { ctx: DetailRenderContext<Proveedor>; }) => (
        <div key={ctx.reactkey + ctx.id} className="pol-separator-line"></div>
    );

    const PageG1 = ({ ctx }: { ctx: GroupHeaderRenderContext<Proveedor>; }) => (
        <h3 key={ctx.reactkey} className="w3-yellow">{ctx.id} {ctx.key}:{ctx.current}</h3>
    );
    const PageFooterG1 = ({ ctx }: { ctx: GroupFooterRenderContext<Proveedor>; }) => (
        <h3 key={ctx.reactkey} >Totales G1 {ctx.key} - {ctx.data.key} - {ctx.data.recordCount} - total: {ctx.data.summary.id}</h3>
    );

    const PageG2 = ({ ctx }: { ctx: GroupHeaderRenderContext<Proveedor>; }) => (
        <h4 key={ctx.reactkey} className="w3-gray">{ctx.id} {ctx.key}:{ctx.current}</h4>
    );
    const PageFooterG2 = ({ ctx }: { ctx: GroupFooterRenderContext<Proveedor>; }) => (
        <h4 key={ctx.reactkey} >Totales G2 {ctx.key} - {ctx.data.key} - {ctx.data.recordCount} - total: {ctx.data.summary.id}</h4>
    );

    const rd: ReportDefinition<Proveedor> = {
        sections: [
            { id: "H1", type: "header", valueProvider: (ctx) => <PageHeader2 ctx={ctx} /> },
            { id: "H2", type: "header", valueProvider: (ctx) => <PageHeader1 ctx={ctx} /> },
            { id: "H3", type: "header", valueProvider: (ctx) => <PageHeader2 ctx={ctx} /> },
            { id: "G1", type: 'group', key: "descripcion", resume: true, valueProvider: (ctx) => <PageG1 ctx={ctx} />, footerValueProvider: (ctx) => <PageFooterG1 ctx={ctx} /> },
            { id: "G2", type: 'group', key: "nif", resume: true, valueProvider: (ctx) => <PageG2 ctx={ctx} />, footerValueProvider: (ctx) => <PageFooterG2 ctx={ctx} /> },
            { id: "D1", type: 'detail', valueProvider: (ctx) => <PageDetail1 ctx={ctx} /> },
            { id: "D2", type: 'detail', valueProvider: (ctx) => <PageDetail2 ctx={ctx} /> },
            { id: "T1", type: "total", valueProvider: (ctx) => <PageTotal1 ctx={ctx} /> },
            { id: "T2", type: "total", valueProvider: (ctx) => <PageTotal2 ctx={ctx} /> }
        ],
        summary: '{ "id" : 0 }',
        "orderBy": "descripcion,nif,id desc"
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
        obtenerDatos();
    }, []);

    return (
        <>
            <div className="w3-container">
                <h4>ReportViewer</h4>
                <button className="w3-button w3-gray w3-block"
                    onClick={obtenerDatos}
                    disabled={cargando}>Volver a generar</button>
                <p>
                </p>

                {!cargando && datos.length > 0 &&
                    <ReportViewer<Proveedor> reportDefinition={rd} data={datos} renderAsTable={false} />
                }
                {!cargando && datos.length === 0 && <p>No hay datos para mostrar el reporte. Haz clic en "Generar listado".</p>}
            </div>
        </>
    )
};

export default ReportViewerSamplePage;