
export type SortDirection = 'asc' | 'desc';
export type ValueSelector<T> = keyof T | ((item: T) => any);
export type SortCriterion<T> = {
    key: ValueSelector<T>;
    direction?: SortDirection;
};

interface Config {
    write(key: string, value: string): Config;
    read(key: string): string | null;
    remove(key:string): Config;
}

interface StringBuilder {
    value: string;
    append(s: string): StringBuilder;
    appendLine(s?: string): StringBuilder;
}


/**
 * Rellena una cadena a la izquierda con un carácter hasta alcanzar un tamaño determinado.
 * @param val La cadena a rellenar.
 * @param size El tamaño final deseado de la cadena.
 * @param ch El carácter de relleno (por defecto, espacio).
 * @returns La cadena rellenada.
 */
export function stringLeftPad(val: string, size: number, ch: string = ' '): string {
    let result = String(val);
    while (result.length < size) result = ch + result;
    return result;
}

/**
 * Elimina espacios en blanco de los elementos de un array de cadenas.
 * @param values Un array de cadenas.
 * @returns Un nuevo array con las cadenas recortadas.
 */
export function stringTrimValues(values: string[]): string[] {
    return values.map(s => s.trim());
}

/**
 * Formatea una cadena de plantilla con valores proporcionados.
 * Soporta placeholders {0}, {key}, {key:fn}, {index|path}, {index|path:fn}
 * y funciones con parámetros.
 *
 * @param template La cadena de plantilla a formatear.
 * @param values Los valores a insertar en la plantilla (pueden ser argumentos variables).
 * @returns La cadena formateada.
 */
export function formatString(template: string, ...values: any[]): string {
    const __context = values[values.length - 1] || self;
    const __call_fn = (fn: Function, params: string[], base: any[]): any => {
        const _args = stringTrimValues(params).reduce((a: any[], p: string) => {
            a.push(p.charAt(0) === '@' ? core.getValue(p.slice(1), __context) : p);
            return a;
        }, base);
        return fn.apply(__context, _args);
    };

    return template.replace(/\{(\d+|[^{]+)\}/g, (m: string, k: string) => {
        let [key, fnName] = stringTrimValues(k.split(':'));
        let value: any;

        if (/^\d+/.test(key)) {
            let tokens = stringTrimValues(key.split('|'));
            let index = parseInt(tokens[0], 10);
            let name = tokens.length === 0 ? 'data' : ['data'].concat(tokens.slice(1)).join('|');
            let scope = { data: values[index], outerScope: __context };
            value = core.getValue(name, scope);
        } else {
            value = core.getValue(key, __context);
        }

        if (core.isFunction(value)) {
            return __call_fn(value, fnName ? stringTrimValues(fnName.split(/[\s;]/)) : [], []);
        }

        if (fnName) {
            let [name, params] = stringTrimValues(fnName.split(/=>/));
            return __call_fn(core.getValue(name, __context), params ? stringTrimValues(params.split(/[\s;]/)) : [], [value]);
        }
        return value;
    });
}

/**
 * Reemplaza todas las ocurrencias de un patrón en una cadena.
 * @param str La cadena original.
 * @param pattern El patrón a buscar.
 * @param replacement La cadena de reemplazo.
 * @returns La cadena con todas las ocurrencias reemplazadas.
 */
export function stringReplaceAll(str: string, pattern: string, replacement: string): string {
    return str.split(pattern).join(replacement);
}

/**
 * Extrae la parte de la fecha de una cadena de fecha y hora.
 * @param str La cadena de fecha y hora.
 * @returns La parte de la fecha.
 */
export function stringFixDate(str: string): string {
    return str.split(' ')[0];
}

/**
 * Extrae la parte de la hora de una cadena de fecha y hora.
 * @param str La cadena de fecha y hora.
 * @returns La parte de la hora.
 */
export function stringFixTime(str: string): string {
    return str.split(' ')[1];
}

/**
 * Extrae el año de una cadena de fecha.
 * @param str La cadena de fecha.
 * @returns El año.
 */
export function stringFixYear(str: string): string {
    return stringFixDate(str).split('/')[2];
}

/**
 * Rellena una cadena con otra cadena a la izquierda.
 * Nota: El original usaba `v` como tamaño, pero el comportamiento parece ser `paddingLeft("miCadena", "000")` -> "000miCadena"
 * y luego slice(-v.length). Si v es "000", v.length es 3.
 * @param str La cadena a rellenar.
 * @param paddingStr La cadena de relleno (ej. "000").
 * @returns La cadena rellenada.
 */
export function stringPaddingLeft(str: string, paddingStr: string): string {
    return (paddingStr + str).slice(-paddingStr.length);
}

/**
 * Combina una cadena de plantilla con un objeto de contexto.
 * Los placeholders {key} se reemplazan con valores del contexto.
 * Soporta también {fn:key} para llamar a una función del contexto.
 * @param template La cadena de plantilla.
 * @param context El objeto de contexto con los datos.
 * @returns La cadena con los placeholders reemplazados.
 */
export function stringMerge(template: string, context: any): string {
    return template.replace(/{([^{]+)?}/g, (m, key: string) => {
        if (key.includes(':')) {
            const [fnName, valueKey] = stringTrimValues(key.split(':'));
            const fn = core.getValue(fnName, context);
            const value = core.getValue(valueKey, context);
            return typeof fn === 'function' ? fn(value, context) : '';
        }
        const r = core.getValue(key, context);
        return core.isFunction(r) ? r.apply(context) : r;
    });
}

/**
 * Convierte una cadena XML en un documento XML (DOMParser).
 * @param xmlString La cadena XML.
 * @returns Un objeto Document XML.
 */
export function stringToXmlDocument(xmlString: string): Document {
    return new DOMParser().parseFromString(xmlString, "text/xml");
}

/**
 * Decodifica entidades HTML de una cadena.
 * @param htmlString La cadena HTML con entidades.
 * @returns La cadena con las entidades decodificadas.
 */
export function stringHtmlDecode(htmlString: string): string | null {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.documentElement.textContent;
}

/**
 * Verifica si una cadena comienza con otra cadena.
 * @param str La cadena principal.
 * @param searchString La cadena a buscar al inicio.
 * @returns `true` si la cadena principal comienza con `searchString`, `false` en caso contrario.
 */
export function stringStartsWith(str: string, searchString: string): boolean {
    return str.startsWith(searchString);
}


/**
 * Elimina la primera ocurrencia de un elemento de un array (modifica el array original).
 * @param arr El array a modificar.
 * @param o El elemento a eliminar.
 * @returns El array modificado.
 */
export function arrayRemove<T>(arr: T[], o: T): T[] {
    const index = arr.indexOf(o);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * Añade un elemento al final de un array y lo retorna.
 * @param arr El array al que añadir.
 * @param o El elemento a añadir.
 * @returns El elemento añadido.
 */
export function arrayAdd<T>(arr: T[], o: T): T {
    arr.push(o);
    return o;
}

/**
 * Añade un elemento al final de un array y retorna el array modificado.
 * (Similar a arrayAdd, pero retorna el array)
 * @param arr El array al que añadir.
 * @param o El elemento a añadir.
 * @returns El array modificado.
 */
export function arrayAppend<T>(arr: T[], o: T): T[] {
    arr.push(o);
    return arr;
}

/**
 * Mapea un array a un nuevo array de valores, ya sea por una propiedad o una función.
 * @param arr El array a mapear.
 * @param sentence La propiedad como string o una función de mapeo.
 * @returns Un nuevo array con los valores seleccionados.
 */
export function arraySelect<T, R>(arr: T[], sentence: string | ((item: T) => R)): R[] {
    return core.isString(sentence)
        ? arr.map((e: any) => e[sentence])
        : arr.map(sentence as (item: T) => R);
}

/**
 * Encuentra el primer elemento en un array que coincide con un valor de propiedad.
 * @param arr El array a buscar.
 * @param propName El nombre de la propiedad a comparar.
 * @param value El valor a buscar.
 * @param def Valor por defecto si no se encuentra.
 * @returns El elemento encontrado o el valor por defecto.
 */
export function arrayItem<T>(arr: T[], propName: string, value: any, def?: T): T | undefined {
    return arr.filter((v: any) => v[propName] == value)[0] || def;
}

/**
 * Verifica si un array contiene un elemento con un valor de propiedad específico.
 * @param arr El array a buscar.
 * @param propName El nombre de la propiedad a comparar.
 * @param value El valor a buscar.
 * @returns `true` si se encuentra el elemento, `false` en caso contrario.
 */
export function arrayContains<T>(arr: T[], propName: string, value: any): boolean {
    return !!arrayItem(arr, propName, value);
}

/**
 * Obtiene el último elemento de un array.
 * @param arr El array.
 * @returns El último elemento, o undefined si el array está vacío.
 */
export function arrayLastItem<T>(arr: T[]): T | undefined { return arr[arr.length - 1]; }

/**
 * Obtiene el primer elemento de un array.
 * @param arr El array.
 * @returns El primer elemento, o undefined si el array está vacío.
 */
export function arrayFirstItem<T>(arr: T[]): T | undefined { return arr[0]; }

/**
 * Obtiene los elementos únicos de un array basándose en una propiedad o el valor del elemento.
 * @param arr El array a procesar.
 * @param sentence La propiedad como string o una función para determinar la unicidad.
 * @returns Un nuevo array con los elementos distintos.
 */
export function arrayDistinct<T, K>(arr: T[], sentence: string | ((item: T) => K) = ''): K[] {
    const __sentence = core.isString(sentence)
        ? (a: any) => (sentence ? a[sentence] : a)
        : (sentence as (item: T) => K);

    const seen = new Set<K>();
    const result: K[] = [];
    arr.forEach((item: T) => {
        const value = __sentence(item);
        if (!seen.has(value)) {
            seen.add(value);
            result.push(value);
        }
    });
    return result;
}

/**
 * Agrupa los elementos de un array por una o más propiedades.
 * @param arr El array a agrupar.
 * @param prop La propiedad o propiedades (separadas por coma) por las que agrupar.
 * @returns Un objeto donde las claves son los valores agrupados y los valores son arrays de elementos.
 */
export function arrayGroupBy<T>(arr: T[], prop: string): { [key: string]: T[] } {
    const propsToGroup = prop.split(',');
    const getKey = (target: any) => propsToGroup.map((f) => target[f]).join('__');
    return arr.reduce((groups: any, item: T) => {
        const key = getKey(item);
        (groups[key] = groups[key] || []).push(item);
        return groups;
    }, {});
}


export function arrayGroupByNested<T extends Record<string, any>>(
    array: T[],
    ...keys: (keyof T)[]
): Record<string, any> {
    if (keys.length === 0) throw new Error('Debes proporcionar al menos una clave para agrupar.');
    const result: Record<string, any> = {};
    for (const item of array) {
        let level = result;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i] as string;
            const value = String(item[key]);

            if (i === keys.length - 1) {
                if (!level[value]) level[value] = [];
                level[value].push(item);
            } else {
                if (!level[value]) level[value] = {};
                level = level[value];
            }
        }
    }

    return result;
}

/**
 * Suma los valores de una propiedad numérica de los objetos en un array.
 * @param arr El array de objetos.
 * @param prop La propiedad numérica a sumar.
 * @returns La suma de los valores.
 */
export function arraySum<T>(arr: T[], prop: string): number {
    return arr.reduce((a: number, item: any) => a + (item[prop] || 0), 0.0); // Añadido (item[prop] || 0) para seguridad
}

/**
 * Convierte un array de objetos en un diccionario (objeto) usando una propiedad como clave.
 * @param arr El array de objetos.
 * @param prop La propiedad del objeto a usar como clave del diccionario.
 * @param value Opcional: la propiedad del objeto a usar como valor del diccionario. Si no se especifica, el objeto completo es el valor.
 * @returns Un objeto diccionario.
 */
export function arrayToDictionary<T>(arr: T[], prop: string, valueProp?: string): { [key: string]: T | any } {
    return arr.reduce((a: any, d: any) => {
        a[d[prop]] = valueProp ? d[valueProp] : d;
        return a;
    }, {});
}

/**
* Convierte un array de objetos en un diccionario, usando una propiedad como clave 
* y otra propiedad como valor.
* @param array El array de origen.
* @param keySelector La propiedad del objeto a usar como clave en el diccionario.
* @param valueSelector La propiedad del objeto a usar como valor en el diccionario.
*/
export function toDictionary<T, K extends keyof T, V extends keyof T>(
    array: readonly T[],
    keySelector: K,
    valueSelector: V
): Record<T[K] & (string | number), T[V]>;

/**
* Convierte un array de objetos en un diccionario, usando una propiedad como clave 
* y el objeto completo como valor.
* @param array El array de origen.
* @param keySelector La propiedad del objeto a usar como clave en el diccionario.
*/
export function toDictionary<T, K extends keyof T>(
    array: readonly T[],
    keySelector: K,
): Record<T[K] & (string | number), T>;

/**
* Convierte un array de objetos en un diccionario, usando funciones para determinar 
* la clave y el valor de cada elemento.
* @param array El array de origen.
* @param keySelector Una función que devuelve la clave para un elemento.
* @param valueSelector Una función que devuelve el valor para un elemento.
*/
export function toDictionary<T, TKey extends string | number, TValue>(
    array: readonly T[],
    keySelector: (item: T) => TKey,
    valueSelector: (item: T) => TValue
): Record<TKey, TValue>;

/**
* Convierte un array de objetos en un diccionario, usando una función para determinar 
* la clave y usando el objeto completo como valor.
* @param array El array de origen.
* @param keySelector Una función que devuelve la clave para un elemento.
*/
export function toDictionary<T, TKey extends string | number>(
    array: readonly T[],
    keySelector: (item: T) => TKey,
): Record<TKey, T>;

export function toDictionary<T>(
    array: readonly T[],
    keySelector: keyof T | ((item: T) => string | number),
    valueSelector?: keyof T | ((item: T) => unknown)
): Record<string | number, unknown> {
    return array.reduce<Record<string | number, unknown>>((accumulator, item) => {
        // Determina la clave usando la propiedad (string) o la función selectora
        const key = typeof keySelector === 'function'
            ? keySelector(item)
            : (item[keySelector] as string | number);

        // Determina el valor: puede ser el objeto completo, una de sus propiedades o el resultado de una función
        const value =
            valueSelector === undefined ? item :
                typeof valueSelector === 'function' ? valueSelector(item) :
                    item[valueSelector as keyof T];

        // Asigna el par clave-valor al acumulador
        accumulator[key] = value;
        return accumulator;
    }, {});
}

/**
 * Divide un array en "chunks" (sub-arrays) de un tamaño determinado.
 * @param arr El array a dividir.
 * @param size El tamaño máximo de cada sub-array.
 * @returns Un array de arrays (chunks).
 */
export function arraySplit<T>(arr: T[], size: number): T[][] {
    return arr.reduce((acc: T[][], current: T, i: number, self: T[]) => {
        if (i % size === 0) return [...acc, self.slice(i, i + size)];
        return acc;
    }, []);
}

export function arrayWhere<T extends Record<string, unknown>>(
    array: T[],
    sentence: ((item: T) => boolean) | Record<string, any>
): T[] {

    if (core.isFunction(sentence))
        return array.filter(sentence as (item: T) => boolean);
    if (core.isObject(sentence)) {
        const keys = Object.keys(sentence);

        if (keys.length === 0) return array;

        return array.filter((item: T) => {
            return keys.every(propname => {
                const expectedValue = sentence[propname];
                let actualValue = (item as Record<string, unknown>)[propname];
                if (core.isFunction(actualValue)) {
                    try {
                        actualValue = actualValue.call(item);
                    } catch (e) {
                        console.error(`Error al ejecutar la propiedad computada '${String(propname)}' en el item:`, item, e);
                        return false;
                    }
                }
                if (core.isFunction(expectedValue)) {
                    return expectedValue(actualValue, item);
                }
                if (expectedValue instanceof RegExp) {
                    return core.isString(actualValue) && expectedValue.test(actualValue);
                }
                return actualValue === expectedValue;
            });
        });
    }
    return array;
}

export function createGUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export function apply(a: Record<string, any>, b: Record<string, any>, d?: Record<string, any>) {
    if (d) apply(a, d);
    if (a && b && core.isObject(b)) {
        for (var p in b) {
            var val = b[p];
            if (core.isArray(val)) a[p] = core.clone(val);
            else if (val instanceof Date ||
                     core.isFunction(val) ||
                     val.dataset instanceof DOMStringMap) a[p] = val;
            else if (core.isObject(val)) apply(a[p] = a[p] || {}, val);
            else a[p] = val;
        }
    }
    return a;
};

export function getValue(key: string | undefined, scope : any, htmlElement? : any) : any {
        if(key === 'this') return scope;
        var target = scope || self;
        var parts  = (key ||'').split('|');
        var tokens = parts.shift()?.split(/\.|\[|\]/).filter(function(t){ return t; });
        var last   = tokens?.pop() || '';
        var i      = 0;
        while(tokens?.length){  
            i++;
            var propName = tokens.shift();
            if(propName! in target) {
                target = target[propName!];
                continue;
            }
            if(i > 1) {
                console.log(`Eror getValue: ${key} - ${propName}`);
                return '';
            }
            var value = undefined;
            // =============================================================================
            // Buscar la propiedad en un ambito superior si existe
            // =============================================================================
            if (target['#']) target = value = core.getValue(propName, target['#']);
            // =============================================================================
            // Buscar la propiedad en el contexto global
            // =============================================================================
            if (value === undefined && propName && propName in self) 
                target = value = self[propName as any];
            if(value === undefined){ 
                console.log(`Eror getValue: ${key} - ${propName}`);
                return '';
            }
        }
        // =====================================================================================
        // Prototipo/función de transformación/formateo libro.name|htmlDecode,p1,p2,...|toString
        // =====================================================================================               
        if (parts.length > 0) { 
            return parts.reduce(function(acc:any, e:any){ 
                var arg  = e.split(',');// String.trimValues(e.split(','));            
                var name = arg[0];
                arg      = arg.slice(1);
                // ==================================================
                // Prototipo
                // ==================================================
                var fn = acc.__proto__[name];             
                if(fn) return fn.apply(acc, arg);
                // ==================================================
                // Función (window:Objeto:nombreFuncion,p0,p1,p2
                // ==================================================
                name = name.replace(/[\:>#]/g, '.');
                fn  = core.getValue(name, scope || self);
                arg = [acc, htmlElement].concat(arg);
                if(fn) return fn.apply(scope || self, arg);            
            }, target[last]);
        };
        return target[last];
    }

export function config(name: string): Config {
    const getName = (key:string) => {
        return formatString('{0}.{1}', name, key);
    }
    const instance = {
        write: function (key: string, value: string): Config {
            localStorage.setItem(getName(key), value);
            return this;
        },
        read: function (key: string): string | null {
            return localStorage.getItem(getName(key));
        },
        readAll: function () {
            var ref = name + '.';
            const values = Object.keys(localStorage)
                .map(k => { return { name: k } })
                .filter(item => item.name.indexOf(ref) == 0)
                .reduce(function (o: Record<string, string>, item) {
                    const fullname = item.name;
                    const name = fullname.replace(ref, '');
                    o[name] = localStorage.getItem(name)!;
                    return o;
                }, {});
            return values;
        },
        remove : function(key:string): Config {
            localStorage.removeItem(getName(key));
            return this;
        }
    };
    return instance;
}

export function clone(o: any): any {
    if (core.isArray(o)) return [...o];
    if (core.isObject(o) && ((o as any).clone)) return (o as any).clone();
    if (core.isObject(o)) {
        return Object.keys(o)
            .reduce((a: any, k) => {
                a[k] = core.clone((o as any)[k]);
                return a;
            }, {});
    }
    return o;
}

export function join(items: any[], property: string, separator?: string): string {
    const values = arraySelect(items, property);
    return values.join(separator === undefined ? '-' : (separator || ''));
}

export function createStringBuilder(s: string = ''): StringBuilder {
    return {
        value: s,
        append: function (s_arg: string) { this.value = this.value + s_arg; return this; },
        appendLine: function (s_arg?: string) { this.value = this.value + (s_arg || '') + '\n'; return this; }
    };
}

export function parseQueryString(): any {
    return location.search
        .slice(1)
        .split('&').reduce((o: any, a) => {
            const parts = a.split('=');
            o[parts[0]] = parts[1] || '';
            return o;
        }, {});
}

/**
* Crea una función de comparación para ordenar un array por un único criterio.
* @param keySelector La propiedad por la que ordenar (ej: 'name') o una función para extraer el valor 
* (ej: item => item.user.age). Si es nulo, compara los elementos directamente.
* @param direction La dirección de la ordenación: 'asc' (ascendente) o 'desc' (descendente).
* @returns Una función de comparación para usar con Array.prototype.sort().
*/
export function createSimpleSorter<T>(keySelector: ValueSelector<T> | null = null,
    direction: SortDirection = 'asc'
): (a: T, b: T) => number {
    const order = direction === 'desc' ? -1 : 1;
    const val = (item: T, selector: ValueSelector<T> | null) => {
        if (selector === null) return item;
        if (typeof selector === 'function') return selector(item);
        return item[selector];
    };
    return (a: T, b: T): number => {
        const valA = val(a, keySelector);
        const valB = val(b, keySelector);
        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
        return 0;
    };
}

/**
* Crea una función de comparación para ordenar por múltiples criterios en secuencia.
* @param criteria Un array de objetos que definen los criterios de ordenación.
* @returns Una función de comparación para usar con Array.prototype.sort().
*/
export function createMultipleSorter<T>(
    criteria: SortCriterion<T>[]
): (a: T, b: T) => number {

    const sorters = criteria.map(criterion => createSimpleSorter(criterion.key, criterion.direction));

    return (a: T, b: T): number => {
        for (const sorter of sorters) {
            const result = sorter(a, b);
            if (result !== 0) return result;
        }
        return 0;
    };
}

interface CoreConstructor {
    isNull(v: any): boolean;
    toArray(v: any): any[];
    isArray(v: any): boolean;
    isString(v: any): boolean;
    isBoolean(v: any): boolean;
    isNumber(v: any): boolean;
    isFunction(v: any): boolean;
    isObject(v: any): boolean;
    join(items: any[], property: string, separator?: string): string;
    createStringBuilder(s: string): StringBuilder;
    parseQueryString(): any;
    config(name: string): Config;
    getValue(key: string, scope?: any, HTMLElement?: HTMLElement): any;
    apply(a: any, b: any, d?: any): any;
    createGUID(): string;
    createSimpleSorter<T>(keySelector: ValueSelector<T> | null, direction: SortDirection): (a: T, b: T) => number
    createMultipleSorter<T>(criterio: SortCriterion<T>[]): (a: T, b: T) => number;
    clone(o: any): any;
}

class Core implements CoreConstructor {

    isNull(v: any): v is null { return v === null; }
    toArray<T>(v: ArrayLike<T> | Iterable<T>): T[] { return Array.from(v); }
    isArray(v: any): v is any[] { return Array.isArray(v); }
    isString(v: any): v is string { return typeof v === 'string'; }
    isBoolean(v: any): v is boolean { return typeof v === 'boolean'; }
    isNumber(v: any): v is number { return typeof v === 'number'; }
    isFunction(v: any): v is Function { return typeof v === 'function'; }
    isObject(v: any): v is object { return v !== null && typeof v === 'object'; }

    clone = clone;
    join = join;
    parseQueryString = parseQueryString;
    config = config;
    getValue = getValue;
    apply = apply;
    createGUID = createGUID;
    createStringBuilder = createStringBuilder;
    createSimpleSorter = createSimpleSorter;
    createMultipleSorter = createMultipleSorter;

}

export const core = new Core();