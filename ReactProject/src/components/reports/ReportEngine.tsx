

export interface Mediator {
    send: (content: string) => void;
    flush?: () => void;
    clear?: () => void;
}

export interface ReportSectionBase<T = any> {
    id: string;
    valueProvider?: (ctx: any) => string;
}

export interface ReportHeaderSection<T = any> extends ReportSectionBase<T> { 
    type: 'header'; 
    valueProvider?: (ctx: HeaderRenderContext<T>) => string;
}
export interface ReportTotalSection<T = any> extends ReportSectionBase<T> { 
    type: 'total'; 
    valueProvider?: (ctx: TotalRenderContext<T>) => string;
}
export interface ReportDetailSection<T = any> extends ReportSectionBase<T> { 
    type: 'detail'; 
    valueProvider?: (ctx: DetailRenderContext<T>) => string;
}
export interface ReportGroupSection<T = any> extends ReportSectionBase<T> {
    type: 'group';
    key: string;
    footerValueProvider?: (ctx: GroupFooterRenderContext<T>) => string;
    resume: boolean;
}

export type ReportSection<T = any> =
    | ReportHeaderSection<T>
    | ReportTotalSection<T>
    | ReportDetailSection<T>
    | ReportGroupSection<T>;

export interface ReportDefinition<T = any> {
    parseData?: (rd: ReportDefinition<T>, data: T[]) => T[]; 
    summary?: string; 
    onInitSummaryObject?: (summary: any) => any; 
    sections?: ReportSection<T>[];
    iteratefn?: (row: T) => void;        
    orderBy?: SortProperties<T>;         
    onStartfn?: (BS: any) => void;       
    onRowfn?: (BS: any) => void;         
    onGroupChangefn?: (BS: any) => void; 
    [key: string]: any;
}

export interface GroupAccumulatedData<T> {
    records: Array<T>;
    recordCount: number;    
    key: string;
    summary: Record<string, number | any>;
}

export interface GroupContext<T> {
    all: { [key: string]: GroupAccumulatedData<T>; };
}

export interface HeaderRenderContext<T>{
  id: string;
  dataSet: Array<T>;
}

export interface GroupFooterRenderContext<T>{
  id: string;
  name: string;
  key: string;
  resume:boolean,
  current:string,
  data: GroupAccumulatedData<T>;
  dataSet: Array<T>;
}

export interface GroupHeaderRenderContext<T>{
  id: string;
  name: string;
  key: string;
  resume:boolean,
  current:string,
  dataSet: Array<T>;
}

export interface DetailRenderContext<T>{
    id: string;
    data:T;
    previous:T;
    dataSet: Array<T>;
    G0:any; 
    summary:Record<string, number | any>;
    recordCount:number;
    percent:number;
    isLastRow:boolean;
    isLastRowInGroup:boolean;
}

export interface TotalRenderContext<T>{
    id: string;
    data:T;
    previous:T;
    dataSet: Array<T>;
    G0:any; 
    recordCount:number;
    percent:number;
    isLastRow:boolean;
    isLastRowInGroup:boolean;
    [key: string]: any;
}


export default class ReportEngine<T> {

    BS: any = {};

    generateReport(rd: ReportDefinition, data: Array<any>, mediator: Mediator) {
        var __that = this;
        var __rd = rd;
        // ======================================================================================
        // Transformar los datos
        // ======================================================================================
        var __dataSet = __rd.parseData ? __rd.parseData(__rd, data) : data;
        // ======================================================================================
        // Generación de las secciones de cabecera de las agrupaciones
        // ======================================================================================
        function __groupsHeaders() {
            __groups.forEach(function (g: any, ii: number) {
                if (ii < __breakIndex) return;
                const { id, name, resume, current, definition } = g;
                if (definition.valueProvider) {
                    const { key } = definition;
                    const ctx:GroupHeaderRenderContext<T> = {
                        id, name, key, resume, current,
                        dataSet: __dataSet
                    };
                    mediator.send(definition.valueProvider(ctx));
                }
            });
        }
        // ======================================================================================
        // Generación de las secciones de resumen de las agrupaciones
        // ======================================================================================
        function __groupsFooters(index?: number) {
            var __gg = __groups.map(function (g) { return g; });
            if (index) __gg.splice(0, index);
            __gg.reverse().forEach(function (g) {
                const { id, name, resume, current, definition } = g;
                const { key } = definition;
                const data = (__that.BS[name] as GroupContext<T>);
                if (definition.footerValueProvider) {
                    const ctx:GroupFooterRenderContext<T> = {
                        id, name, key, resume, current,
                        data: data.all[current],
                        dataSet: __dataSet
                    };
                    mediator.send(definition.footerValueProvider(ctx));
                }
            });
        }
        // ======================================================================================
        // Generación de las secciones de detalle
        // ======================================================================================
        function __detailsSections() {
            __details.forEach(function (d: ReportDetailSection<T>) {
                if (d.valueProvider) {
                    const bs = __that.BS;
                    const { recordCount, dataSet, G0, isLastRow, 
                            isLastRowInGroup, percent, previous, 
                            data } = bs;
                    const last = __groups[__groups.length - 1];
                    const summary = (bs[last.name] as GroupContext<T>).all[last.current].summary;
                    const ctx:DetailRenderContext<T> = { 
                        id: d.id,
                        data, previous, dataSet, G0, summary,
                        recordCount, percent,
                        isLastRow, 
                        isLastRowInGroup
                    };
                    return mediator.send(d.valueProvider(ctx));
                }
            })
        }
        // ======================================================================================
        // Generación de las secciones de total general
        // ======================================================================================
        function __grandTotalSections() {
            __totals.forEach(function (t: ReportTotalSection<T>) {
                if (t.valueProvider) {
                    const bs = __that.BS;
                    const { id } = t;
                    const { recordCount, dataSet, G0, isLastRow, 
                            isLastRowInGroup, percent, previous, 
                            data } = bs;
                    const groups = __groups.reduce( (acc, g) => {                     
                            acc[g.name] = (bs[g.name] as GroupContext<T>).all;
                            return acc;
                        }, 
                        {} as Record<string, Record<string, GroupAccumulatedData<T>>>
                    );
                    const ctx:TotalRenderContext<T> = { 
                        id,
                        data, previous, dataSet, G0,
                        recordCount, percent,
                        isLastRow, 
                        isLastRowInGroup,
                        ...groups
                    };

                    return mediator.send(t.valueProvider(ctx));
                }
            })
        }
        // ======================================================================================
        // Generación de las secciones de cabecera del informe
        // ======================================================================================
        function __reportHeaderSections() {
            __headers.forEach(function (t: ReportHeaderSection<T>) {
                if (t.valueProvider) {
                    const ctx:HeaderRenderContext<T> = { 
                        id: t.id,
                        dataSet: __dataSet 
                    };
                    return mediator.send(t.valueProvider(ctx));
                }
            })
        }
        // ======================================================================================
        // Inicializar el objeto que sirve de acumulador
        // ======================================================================================
        function __resolveSummaryObject() {
            var __summary = JSON.parse(__rd.summary || '{}');
            if (__rd.onInitSummaryObject)
                return __rd.onInitSummaryObject(__summary);
            return __summary;
        }

        var __breakIndex = -1;
        var __summary = __resolveSummaryObject();
        const __headers: Array<ReportHeaderSection<T>> = (__rd.sections || []).filter((s) => s.type == 'header');
        const __totals: Array<ReportTotalSection<T>> = (__rd.sections || []).filter((s) => s.type == 'total');
        const __details: Array<ReportDetailSection<T>> = (__rd.sections || []).filter((s) => s.type == 'detail');
        const __groups_temp = (__rd.sections || []).filter((s): s is ReportGroupSection<T> => s.type === 'group');
        var __groups = __groups_temp.map(function (group, i: number) {

            return {
                name: 'G' + (i + 1),
                id: group.id,
                resume: group.resume,
                rd: __rd,
                definition: group,
                current: '',
                init: function (value: any) {
                    var key = value[this.definition.key!].toString();
                    const groupData: { [key: string]: GroupAccumulatedData<T> } = (__that.BS[this.name] as GroupContext<T>).all;
                    groupData[key] = {
                        records: [],
                        recordCount: 0,
                        key: key,
                        summary: __that.cloneSummaryTemplate(__summary)
                    };
                    groupData[key].records.push(value);
                    groupData[key].recordCount = 1
                    __that.copy(value, groupData[key].summary);
                },
                sum: function (value: any) {
                    var key = value[this.definition.key!].toString();

                    const groupData: { [key: string]: GroupAccumulatedData<T> } = (__that.BS[this.name] as GroupContext<T>).all;
                    groupData[key] = groupData[key] || {
                        records: [],
                        recordCount: 0,
                        summary: __that.cloneSummaryTemplate(__summary),
                        key: key
                    };
                    groupData[key].records.push(value);
                    groupData[key].recordCount += 1;
                    __that.sum(value, groupData[key].summary)
                },
                test: function (value: any) {
                    return value[this.definition.key!] == this.current;
                }
            }
        }) || [];
        __that.BS = { reportDefinition: __rd };
        // =================================================================================
        // Ordenar los datos
        // =================================================================================
        if (__rd.iteratefn) __dataSet.forEach(__rd.iteratefn);
        if (__rd.orderBy) __dataSet = sortBy(__dataSet, __rd.orderBy, true);
        // =================================================================================
        // Inicializar
        // =================================================================================
        __that.BS = {
            recordCount: 0,
            G0: __that.clone(__summary),
            dataSet: __dataSet,
            reportDefinition: __rd
        };
        __groups.forEach(function (g, i) {
            g.current = (__dataSet && __dataSet[0]) ? __dataSet[0][g.definition.key!] : '';
            __that.BS[g.name] = { all: {} } as GroupContext<T>;
        });
        if (__rd.onStartfn) __rd.onStartfn(__that.BS);
        // =================================================================================
        // Cabeceras del informe
        // =================================================================================
        __reportHeaderSections();
        // =================================================================================
        // Cabeceras iniciales
        // =================================================================================
        if (__dataSet.length > 0) __groupsHeaders();
        // =================================================================================
        // Iterar sobre los elementos
        // =================================================================================
        __dataSet.forEach(function (r: any, i: number) {
            // ============================================================================
            // Procesar el elemento
            // ============================================================================         
            __that.BS.recordCount++;
            __that.BS.isLastRow = __dataSet.length === __that.BS.recordCount;
            __that.BS.isLastRowInGroup = __that.BS.isLastRow;
            __that.BS.percent = (__that.BS.recordCount / __dataSet.length) * 100;
            __that.BS.previous = __that.BS.data || r;
            __that.BS.data = r;
            __that.sum(r, __that.BS.G0);
            if (__rd.onRowfn) __rd.onRowfn(__that.BS);
            // ============================================================================
            // Determinar si hay cambio en alguna de las claves de agrupación
            // ============================================================================
            if (__groups.every(function (g) { return g.test(r) })) {
                __groups.forEach(function (g) { g.sum(r); });
            } else {
                __groups.some(function (g, i) {
                    if (!g.test(r)) {
                        __breakIndex = i;
                        // ============================================
                        // Pies de grupo de los que han cambiado
                        // ============================================
                        __groupsFooters(__breakIndex);
                        // ============================================
                        // Actualizar los grupos
                        // ============================================
                        __groups.forEach(function (grupo, ii) {
                            if (ii >= __breakIndex) {
                                // ========================================
                                // Inicializar los que han cambiado
                                // ========================================
                                grupo.init(r)
                                __breakIndex = i;
                            } else {
                                // ========================================
                                // Acumular valores de los que siguen igual
                                // ========================================
                                grupo.sum(r);
                            }
                        });
                        return true;
                    }
                    return false;
                })
                // ==========================================================
                // Notificar del evento onGroupChange
                // ==========================================================
                __groups.forEach(function (g) {
                    g.current = r[g.definition.key!];
                });
                if (__rd.onGroupChangefn) __rd.onGroupChangefn(__that.BS);
                // ==========================================================
                // Cabeceras
                // ==========================================================
                __groupsHeaders();
            }
            // ============================================================
            // Determinar si este es el último elemento de la agrupación 
            // ============================================================
            if (__groups.length && !__that.BS.isLastRow) {
                var __next = __dataSet[__that.BS.recordCount];
                __that.BS.isLastRowInGroup = !__groups.every(function (g) {
                    var key = g.definition.key!;
                    return __next[key] === __that.BS.data[key];
                });
            }
            // ============================================================
            // Secciones de detalle
            // ============================================================
            __detailsSections()
        });

        if (__dataSet.length > 0) {
            __that.BS.previous = __that.BS.data;
            __groupsFooters();// Pies de grupo
        }
        __grandTotalSections(); // Total general
        if (mediator.flush) mediator.flush();
    }

    private copy(source: any, dest: any) {
        for (var p in dest) {
            if (dest.hasOwnProperty(p)) {
                if (source.hasOwnProperty(p)) {
                    dest[p] = source[p];
                    continue;
                }
                if (p === '_max_' || p === '_mim_') {
                    var __max = dest[p];
                    for (var m in __max) {
                        if (__max.hasOwnProperty(m) && source.hasOwnProperty(m))
                            __max[m] = source[m];
                    }
                }
                if (p === '_values_') {
                    var __agregate = dest[p];
                    for (var m in __agregate) {
                        if (__agregate.hasOwnProperty(m) && source.hasOwnProperty(m))
                            __agregate[m] = [source[m]];
                    }
                }
            }
        }
    };

    private sum(source: any, dest: any) {
        for (var p in dest) {
            if (dest.hasOwnProperty(p)) {
                if (source.hasOwnProperty(p)) {
                    dest[p] += source[p];
                    continue;
                }
                if (p === '_max_' || p === '_min_') {
                    var target = dest[p];
                    for (var m in target) {
                        if (target.hasOwnProperty(m) && source.hasOwnProperty(m)) {
                            if (p == '_max_')
                                target[m] = source[m] > target[m] ? source[m] : target[m];
                            else
                                target[m] = source[m] < target[m] ? source[m] : target[m];
                        }
                    }
                }
                if (p === '_values_') {
                    var __agregate = dest[p];
                    for (var m in __agregate) {
                        if (__agregate.hasOwnProperty(m) && source.hasOwnProperty(m))
                            __agregate[m].push(source[m]);
                        //if(__agregate[m].length == 13) debugger;
                    }
                }
            }
        }
    };

    private clone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    private cloneSummaryTemplate(template: Record<string, any>): Record<string, any> {
        return this.clone(template);
    }

}


export type SortProperties<T> = string | string[];

function sortBy<T>(array: T[], properties: SortProperties<T>, desc?: boolean): T[] {

    const newArray = [...array];

    const order: number[] = [];
    const parts: string[] = (Array.isArray(properties) ? properties : (properties as string).split(','))
        .map((token: string, i: number) => {
            const pair = token.trim().split(' ');
            order[i] = (pair[1] && pair[1].toUpperCase() === 'DESC') ? -1 : 1;
            return pair[0].trim();
        });
    if (desc !== undefined) order[0] = (desc ? -1 : 1);
    newArray.sort((a: T, b: T) => {

        let i = 0;

        const compareRecursive = (itemA: T, itemB: T): number => {
            const propName = parts[i];
            const valA = (itemA as any)[propName];
            const valB = (itemB as any)[propName];
            if (valA < valB) {
                return -1 * order[i]; // Aplica el orden (ASC/DESC)
            }
            if (valA > valB) {
                return 1 * order[i]; // Aplica el orden (ASC/DESC)
            }
            i++;
            if (i < parts.length) {
                return compareRecursive(itemA, itemB);
            }
            return 0;
        };
        return compareRecursive(a, b);
    });

    return newArray;
}