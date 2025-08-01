
import React, { useState, useEffect, useMemo } from 'react';
import PubSub from './Pubsub';
import { useModal } from '../hooks/useModal';
import type { Proveedor } from '../services/proveedorService';

// Datos de la tabla
export interface TableDataItem {
    id: number | string; // Cada elemento debe tener un id único
    [key: string]: any; // Propiedades adicionales de cualquier tipo
}

export interface ColumnDefinition<T = any> {
    key: keyof T | string;
    title: string;
    formatter: (value: T[keyof T]) => React.ReactNode;
    sorter: (a: T[keyof T], b: T[keyof T]) => number;

}

export interface ActionResolver {
    doLoad: (target: any, callback: CallableFunction) => void;
    doEdit: (target: any, callback: CallableFunction) => void;
    doDelete: (target: any, callback: CallableFunction) => void;
    doNew: (target: any, callback: CallableFunction) => void;
    [key: string]: (target: any, callback: CallableFunction) => void;
}

export interface TableOptions<T = any> {
    entity: string;
    columns: ColumnDefinition<T>[];
    actionResolver?: ActionResolver;
    contextMenuItems?: Map<string, string>
}

// Propiedades del componente
interface TablaPaginadaProps<T extends TableDataItem> {
    datosIniciales: T[];
    elementosPorPaginaInicial?: number,
    title?: string;
    options?: TableOptions,
    enableDoubleClickEdit?: boolean,
    loading: boolean
}

// Tipo para el estado de ordenación
type SortDirection = 'asc' | 'desc' | null;

const PAGE_SIZE = 'PageSize';

const TablaPaginada = <T extends TableDataItem>(
    {
        datosIniciales,
        elementosPorPaginaInicial = 5,
        options = {
            entity: '',
            columns: [
                { key: 'id', title: 'Id', formatter: (v) => v, sorter: (a: number, b: number) => a - b }
            ],
            contextMenuItems: new Map<string, string>()
        },
        enableDoubleClickEdit = false,
        loading = false
    }: TablaPaginadaProps<T>
) => {
    const [cargando, setCargando] = useState(loading);
    const [datos, setDatos] = useState<T[]>(datosIniciales);
    const [paginaActual, setPaginaActual] = useState<number>(1);
    const [elementosPorPagina, setElementosPorPagina] = useState<number>(() => {
        return ~~(localStorage.getItem(PAGE_SIZE) || elementosPorPaginaInicial);
    });
    const [seleccionados, setSeleccionados] = useState<Set<string | number>>(new Set()); // IDs de los elementos seleccionados
    const [columnaOrdenacion, setColumnaOrdenacion] = useState<keyof T | null>(null);
    const [direccionOrdenacion, setDireccionOrdenacion] = useState<SortDirection>(null);
    const [textoBusqueda, setTextoBusqueda] = useState('');

    const { showNotification, confirm } = useModal();

    // ============================================================================================================
    // Filtrado de elementos 
    // ============================================================================================================
    const datosFiltrados = useMemo(() => {
        if (!textoBusqueda.trim()) return datos;
        const lower = textoBusqueda.toLowerCase();
        const items = datos.filter(item => {
            return Object.values(item).some(
                val => String(val).toLowerCase()
                    .includes(lower)
            );
        });
        const newSel = items.filter(item => seleccionados.has(item.id))
            .map(item => item.id);
        setSeleccionados(new Set(newSel));
        return items;
    }, [textoBusqueda, datos]);

    // ============================================================================================================
    // Ordenación de elementos 
    // ============================================================================================================
    const datosOrdenados = useMemo(() => {
        if (!columnaOrdenacion || !direccionOrdenacion)
            return datosFiltrados;
        const sorter = options.columns.filter(c => c.key === columnaOrdenacion)[0].sorter;
        const sorted = [...datosFiltrados].sort((a, b) => {
            return direccionOrdenacion === 'asc' ?
                sorter(a[columnaOrdenacion], b[columnaOrdenacion]) :
                sorter(b[columnaOrdenacion], a[columnaOrdenacion]);
        });
        return sorted;
    }, [datosFiltrados, columnaOrdenacion, direccionOrdenacion]);
    const handleSort = (column: keyof T) => {
        if (columnaOrdenacion === column) {
            setDireccionOrdenacion(prev => {
                if (prev === 'asc') return 'desc';
                if (prev === 'desc') return null;
                return 'asc';
            });
        } else {
            setColumnaOrdenacion(column);
            setDireccionOrdenacion('asc');
        }
        setPaginaActual(1);
    };

    // ============================================================================================================
    // Lógica de Paginación 
    // ============================================================================================================
    const totalPaginas = Math.ceil(datosOrdenados.length / elementosPorPagina);
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = datosOrdenados.slice(indicePrimerElemento, indiceUltimoElemento);
    const irAPrimeraPagina = () => setPaginaActual(1);
    const irAPaginaAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));
    const irASiguientePagina = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
    const irAUltimaPagina = () => setPaginaActual(totalPaginas);
    const handleCambioPaginaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = parseInt(e.target.value);
        if (!isNaN(valor) && valor >= 1 && valor <= totalPaginas) {
            setPaginaActual(valor);
        }
    };
    const handleElementosPorPaginaChange = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        const value = parseInt(target.textContent || elementosPorPaginaInicial.toString());
        setElementosPorPagina(value);
        localStorage.setItem(PAGE_SIZE, value.toString());
        setPaginaActual(1);
    };

    // Asegurar que la página actual no exceda el total de páginas
    useEffect(() => {
        if (paginaActual > totalPaginas && totalPaginas > 0) {
            setPaginaActual(totalPaginas);
        } else if (paginaActual === 0 && totalPaginas > 0) {
            setPaginaActual(1);
        }
    }, [datos, totalPaginas, paginaActual]);

    // ============================================================================================================
    // Lógica de Selección 
    // ============================================================================================================
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const handleSeleccionar = (id: string | number, checked: boolean) => {
        setSeleccionados(prev => {
            const newSeleccionados = new Set(prev);
            if (checked) {
                newSeleccionados.add(id);
            } else {
                newSeleccionados.delete(id);
            }
            return newSeleccionados;
        });
    };
    const handleSeleccionarTodo = (checked: boolean) => {
        if (checked) {
            const ids = new Set(datosOrdenados.map(item => item.id));
            setSeleccionados(ids);
        } else {
            setSeleccionados(new Set());
        }
    };
    const handleInvertirSeleccion = () => {
        setSeleccionados(prev => {
            const targets = new Set<number | string>();
            datosOrdenados.forEach(item => {
                if (!prev.has(item.id)) {
                    targets.add(item.id);
                }
            });
            return targets;
        });
    };

    let clickTimer: any;
    const handleRowClick = (e: React.MouseEvent, index: number, id: string | number) => {
        const isCtrl = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;

        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
            return;
        }

        clickTimer = setTimeout(() => {
            setSeleccionados(prev => {
                const selected = new Set(prev);
                if (isShift && lastSelectedIndex !== null) {
                    const start = Math.min(lastSelectedIndex, index);
                    const end = Math.max(lastSelectedIndex, index);
                    for (let i = start; i <= end; i++) {
                        selected.add(elementosActuales[i].id);
                    }
                } else if (isCtrl) {
                    if (selected.has(id)) {
                        selected.delete(id);
                    } else {
                        selected.add(id);
                    }
                    setLastSelectedIndex(index);
                } else {
                    if (selected.has(id) && selected.size === 1) {
                        selected.clear();
                    } else {
                        selected.clear();
                        selected.add(id);
                    }
                    setLastSelectedIndex(index);
                }
                return selected;
            });
        }, 200);
    };

    const onDoubleClick = (e: any, item: T) => {
        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
        }
        if (enableDoubleClickEdit && options.actionResolver?.doEdit) {
            options.actionResolver.doEdit(item, (result: any) => {
                const updated = { ...item, ...result };
                const nuevosDatos = datos.map(d => d.id === item.id ? updated : d) as T[];
                setDatos(nuevosDatos);
            });
        }
    }

    // ============================================================================================================
    // Insertar
    // ============================================================================================================
    const handleInsertar = () => {
        options.actionResolver?.doNew('', (result: any) => {
            if (result) {
                setDatos(prev => [...prev, result]);
                const page = Math.ceil((datos.length + 1) / elementosPorPagina);
                if (paginaActual != page) {
                    setPaginaActual(page);
                }
            }
        })
    };

    // ================================================================================================
    // Borrar
    // ================================================================================================
    const handleDeleteSelected = async () => {
        if (seleccionados.size === 0) {
            PubSub.publish(PubSub.messages.SHOW_INFO, "Debe seleccionar al menos un elemento de la lista.");
            return;
        }
        const result = await confirm(
            `¿Estás seguro de que quieres borrar ${seleccionados.size} registro(s) seleccionado(s)?`,
            'Borrar proveedores'
        );
        if (result) {
            setCargando(true);
            const keys = seleccionados.keys();
            options.actionResolver?.doDelete(keys, () => {
                setDatos(prevDatos => prevDatos.filter(item => !seleccionados.has(item.id)));
                setSeleccionados(new Set()); // Limpiar selección después de borrar
                if (elementosActuales.length === seleccionados.size && paginaActual > 1) {
                    setPaginaActual(paginaActual - 1);
                }
                showNotification(seleccionados.size + ' elemento(s) eliminados!', 1500);
                setCargando(false);
            });
        }
    };

    // ================================================================================================
    // Editar
    // ================================================================================================
    const handleEditSelected = () => {

        if (seleccionados.size !== 1) {
            const msg = seleccionados.size === 0
                ? "Debe seleccionar un elemento de la lista."
                : "Debe seleccionar un solo elemento de la lista.";
            PubSub.publish(PubSub.messages.SHOW_INFO, msg);
            return;
        }
        const id = seleccionados.values().next().value;
        const target = datos.find(item => item.id === id);
        options.actionResolver?.doEdit(target, (result: Proveedor) => {
            const updated = { ...target, ...result };
            const nuevosDatos = datos.map(item =>
                item.id === id ? updated : item
            ) as T[];
            setDatos(nuevosDatos);
        });
    };

    // ================================================================================================
    // Actualizar
    // ================================================================================================
    const handleRefresh = () => {
        options.actionResolver?.doLoad('', (result: any) => {
            irAUltimaPagina();
        });
    }

    const showHideMenu = () => {
        const target = document.querySelector('div.w3-jj');
        if (target) {
            let names = target.classList;
            function close() {
                names.remove('w3-show');
                document.removeEventListener('click', close);
            }
            if (names.contains('w3-show'))
                close()
            else {
                names.add('w3-show');
                setTimeout(function () { document.addEventListener('click', close); }, 50);
            }
        };
    }

    // ============================================================================================================
    // CustomActions
    // ============================================================================================================
    const handleCustomAction = (action: string) => {
        if(!action.startsWith('#')) setCargando(true);
        options.actionResolver?.doAction &&
            options.actionResolver?.doAction({ action, selected: seleccionados, datos }, (result: any) => {
                setDatos(result);
                if(!action.startsWith('#')) setCargando(false);
            });
    }



    const skeletonRows = Array.from({ length: elementosPorPagina }, (_, i) => (
        <tr key={`skeleton-${i}`}>
            <td><div className="skeleton" /></td>
            {options.columns.map(column => <td><div className="skeleton" /></td>)}
        </tr>
    ));



    return (
        <div>
            <div
                className="w3-bar w3-border-top w3-border-left w3-border-right">
                <button className="w3-button w3-left w3-border-right" title="Cargar" onClick={handleRefresh}>
                    <i className={"w3-xlarge w3-left fa fa-refresh" + (cargando == true ? ' w3-spin' : '')}></i>
                </button>
                <span className="w3-left pol-paginator-label">
                    {options.entity}: {datos.length} elementos
                    {datosFiltrados.length != datos.length && ` (${datosFiltrados.length} filtrados/s)`}
                    {seleccionados.size > 0 && ` (${seleccionados.size} seleccionado/s)`} - Página {paginaActual}/{totalPaginas}
                </span>
                <div data-menu-wrapper="" className="w3-dropdown-click w3-right">
                    <button className="w3-button w3-xlarge w3-right fa fa-caret-down w3-border-left w3-border-right" onClick={showHideMenu} style={{ padding: '7px 4px' }}>
                    </button>
                    <div data-menu="" className="w3-dropdown-content w3-bar-block w3-right w3-card-2 w3-jj">
                        {options.contextMenuItems?.size! > 0 && (
                            <>
                                {Array.from(options.contextMenuItems!.entries())
                                      .filter(e => e[0].startsWith('#'))
                                      .map(([accion, titulo]) => (
                                    <button
                                        key={accion}
                                        className="w3-bar-item w3-button"
                                        disabled={datosFiltrados.length === 0}
                                        onClick={() => handleCustomAction(accion)}>{titulo}</button>
                                ))}
                                <div className="menu-item-separator"></div>
                            </>
                        )}
                        {seleccionados.size == 0 && <button className="w3-bar-item w3-button" onClick={() => handleSeleccionarTodo(true)}>Seleccionar todo</button>}
                        {seleccionados.size > 0 && <button className="w3-bar-item w3-button" onClick={() => handleSeleccionarTodo(false)}>Quitar la selección</button>}
                        <button className="w3-bar-item w3-button" onClick={() => handleInvertirSeleccion()} disabled={seleccionados.size === 0}>Invertir la selección</button>
                        <div className="menu-item-separator"></div>
                        <div className="w3-bar-item w3-show">
                            Paginación:
                            <div className="w3-bar-item w3-center">
                                <div className="w3-bar" style={{ padding: 0 }}>
                                    <button className={'items-per-page' + (elementosPorPagina == 5 ? ' w3-gray' : '')} onClick={handleElementosPorPaginaChange}>5</button>
                                    <button className={'items-per-page' + (elementosPorPagina == 10 ? ' w3-gray' : '')} onClick={handleElementosPorPaginaChange}>10</button>
                                    <button className={'items-per-page' + (elementosPorPagina == 25 ? ' w3-gray' : '')} onClick={handleElementosPorPaginaChange}>25</button>
                                    <button className={'items-per-page' + (elementosPorPagina == 50 ? ' w3-gray' : '')} onClick={handleElementosPorPaginaChange}>50</button>
                                    <button className={'items-per-page' + (elementosPorPagina == 100 ? ' w3-gray' : '')} onClick={handleElementosPorPaginaChange}>100</button>
                                </div>
                            </div>
                        </div>
                        {options.contextMenuItems?.size! > 0 && (
                            <>
                                <div className="menu-item-separator"></div>
                                {Array.from(options.contextMenuItems!.entries())
                                      .filter(e => !e[0].startsWith('#'))
                                      .map(([accion, titulo]) => (
                                    <button
                                        key={accion}
                                        className="w3-bar-item w3-button"
                                        disabled={seleccionados.size === 0}
                                        onClick={() => handleCustomAction(accion)}>{titulo}</button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                <button className="w3-button w3-xlarge w3-right fa fa-plus w3-border-left" title="Insertar" onClick={handleInsertar}></button>
                <button className="w3-button w3-xlarge w3-right fa fa-trash w3-border-left" title="Eliminar" onClick={handleDeleteSelected} disabled={seleccionados.size === 0}></button>
                <button className="w3-button w3-xlarge w3-right fa fa-edit w3-border-left" title="Editar" onClick={handleEditSelected} disabled={seleccionados.size !== 1}></button>
                <button className="w3-button w3-right w3-border-left" onClick={irAUltimaPagina} disabled={paginaActual === totalPaginas}>&#10095;&#10095;</button>
                <button className="w3-button w3-right w3-border-left" onClick={irASiguientePagina} disabled={paginaActual === totalPaginas}>&#10095;</button>
                <input
                    type="number"
                    className="w3-right w3-center"
                    style={{ width: '3em', padding: '8px', border: 'none' }}
                    value={paginaActual}
                    min="1"
                    max={totalPaginas}
                    onChange={handleCambioPaginaInput}
                    disabled={1 === totalPaginas}
                />
                <button className="w3-button w3-right w3-border-left w3-border-right" onClick={irAPaginaAnterior} disabled={paginaActual === 1}>&#10094;</button>
                <button className="w3-button w3-right w3-border-left" onClick={irAPrimeraPagina} disabled={paginaActual === 1}>&#10094;&#10094;</button>
                <div className="w3-right w3-border-left" style={{ margin: 0, padding: 0 }}>
                    <input
                        type="text"
                        className="w3-right"
                        style={{ padding: '8px', border: 'none' }}
                        placeholder="Buscar..."
                        value={textoBusqueda}
                        onChange={(e) => {
                            setTextoBusqueda(e.target.value);
                            setPaginaActual(1);
                        }}
                    />
                </div>
            </div>

            {/* Tabla */}
            <table className="w3-table-all pol-table">
                <thead>
                    <tr>
                        <th style={{ width: '1%' }}>
                            <input
                                type="checkbox"
                                onChange={(e) => handleSeleccionarTodo(e.target.checked)}
                                checked={seleccionados.size === datosFiltrados.length && datosFiltrados.length > 0}
                                // Indeterminate state if some but not all are selected
                                ref={el => {
                                    if (el) {
                                        el.indeterminate = seleccionados.size > 0 &&
                                            seleccionados.size < datosFiltrados.length;
                                    }
                                }}
                            />
                        </th>
                        {options.columns
                            .map(column => (
                                <th key={column.key as string} onClick={() => handleSort(column.key as keyof T)} className="w3-hover-gray sorteable w3-border-right">
                                    {column.title}
                                    {columnaOrdenacion === column.key && (
                                        <span>
                                            {direccionOrdenacion === 'asc' && <i className="fa fa-angle-up w3-large w3-right"></i>}
                                            {direccionOrdenacion === 'desc' && <i className="fa fa-angle-down w3-large w3-right"></i>}
                                        </span>
                                    )}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {cargando && skeletonRows.map((row) => (row))}
                    {!cargando && elementosActuales.map((item, index) => (

                        <tr key={item.id}
                            className={`fila-hover ${seleccionados.has(item.id) ? 'fila-seleccionada' : ''}`}
                            onClick={(e) => handleRowClick(e, index, item.id)}
                            onDoubleClick={(e) => onDoubleClick(e, item)}>
                            <td className="w3-border-right">
                                <input
                                    type="checkbox"
                                    checked={seleccionados.has(item.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleSeleccionar(item.id, e.target.checked)}
                                />
                            </td>
                            {options.columns
                                .map(column => (
                                    <td key={`${item.id}-${String(column.key)}`}>
                                        {column.formatter(item[column.key as keyof T])}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaPaginada;
