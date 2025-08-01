

import {
    // ========================
    // Funciones de String
    // ========================
    stringLeftPad,
    stringPaddingLeft,
    stringTrimValues,
    formatString,
    stringReplaceAll,
    stringFixDate,
    stringFixTime,
    stringFixYear,
    stringMerge,
    stringToXmlDocument,
    stringHtmlDecode,
    // ========================
    // Funciones de Array
    // ========================
    arrayRemove,
    arrayAdd,
    arrayAppend,
    arraySelect,
    arrayItem,
    arrayContains,
    arrayFirstItem,
    arrayLastItem,
    arrayWhere,
    arrayDistinct,
    arrayGroupBy,
    arrayGroupByNested,
    arraySum,
    arrayToDictionary,
    arraySplit,
    core,
    type ValueSelector,
    type SortDirection,
    type SortCriterion
} from './core';

// ==========================================================================
// --- Interfaz para StringWrapper ---
// ==========================================================================
interface IStringWrapper {
    value(): string;
    leftPad(size: number, ch?: string): this;
    trimValues(separator?: string | RegExp): IArrayWrapper<string>;
    format(...values: any[]): this;
    replaceAll(pattern: string, replacement: string): this;
    fixDate(): this;
    fixTime(): this;
    fixYear(): this;
    paddingLeft(paddingStr: string): this;
    merge(context: any): this;
    toXmlDocument(): Document;
    htmlDecode(): this;
    split(separator: string | RegExp): IArrayWrapper<string>;
}

class StringWrapper implements IStringWrapper {

    private _value: string;

    constructor(value: string) {
        this._value = value;
    }

    value(): string {
        return this._value;
    }

    leftPad(size: number, ch?: string) {
        this._value = stringLeftPad(this._value, size, ch);
        return this;
    }

    trimValues(separator: string | RegExp = ',') {
        const parts = this._value.split(separator);
        const trimmedParts = stringTrimValues(parts);
        return new ArrayWrapper(trimmedParts);
    }

    trim() {
        this._value = this._value.trim();
        return this;
    }

    format(...values: any[]) {
        this._value = formatString(this._value, ...values);
        return this;
    }

    replaceAll(pattern: string, replacement: string) {
        this._value = stringReplaceAll(this._value, pattern, replacement);
        return this;
    }

    fixDate() {
        this._value = stringFixDate(this._value);
        return this;
    }

    fixTime() {
        this._value = stringFixTime(this._value);
        return this;
    }

    fixYear() {
        this._value = stringFixYear(this._value);
        return this;
    }

    paddingLeft(paddingStr: string) {
        this._value = stringPaddingLeft(this._value, paddingStr);
        return this;
    }

    merge(context: any) {
        this._value = stringMerge(this._value, context);
        return this;
    }

    toXmlDocument(): Document {
        return stringToXmlDocument(this._value);
    }

    htmlDecode() {
        this._value = stringHtmlDecode(this._value) || '';
        return this;
    }

    split(separator: string | RegExp) {
        return new ArrayWrapper(this._value.split(separator));
    }
}

interface IArrayWrapper<T> {
    value(): T[];
    remove(o: T): this;
    add(o: T): this;
    append(o: T): this;
    item(propName: string, value: any, def?: T): T | undefined;
    contains(propName: string, value: any): boolean;
    lastItem(): T | undefined;
    sum(prop: string): number;
    toDictionary(prop: string, valueProp?: string): { [key: string]: T | any };
    split(size: number): IArrayWrapper<T[]>;

    select<R>(sentence: string | ((item: T) => R)): IArrayWrapper<R>;
    where(sentence: ((item: T) => boolean) | Record<string, any>): IArrayWrapper<T>;

    sortBy(key: ValueSelector<T>, direction?: SortDirection): IArrayWrapper<T>;
    sortBy(criteria: SortCriterion<T>[]): IArrayWrapper<T>;

    distinct<K>(sentence?: string | ((item: T) => K)): IArrayWrapper<K>;
    groupBy(prop: string): { [key: string]: T[] };
    groupByNested<K extends keyof T>(...keys: K[]): Record<string, any>;

}

class ArrayWrapper<T> implements IArrayWrapper<T> {
    private _value: T[];

    constructor(value: T[]) {
        this._value = [...value];
    }

    value(): T[] { return this._value; }
    remove(o: T) { this._value = arrayRemove(this._value, o); return this; }
    add(o: T) { arrayAdd(this._value, o); return this; }
    append(o: T) { arrayAppend(this._value, o); return this; }
    item(propName: string, value: any, def?: T): T | undefined { return arrayItem(this._value, propName, value, def); }
    firstItem(): T | undefined { return arrayFirstItem(this._value); }
    lastItem(): T | undefined { return arrayLastItem(this._value); }
    contains(propName: string, value: any): boolean { return arrayContains(this._value, propName, value); }
    select<R>(sentence: string | ((item: T) => R)) { return new ArrayWrapper(arraySelect<T, R>(this._value, sentence)); }
    where(sentence: ((item: T) => boolean) | Record<string, any>): ArrayWrapper<T> {
        this._value = arrayWhere(this._value as any, sentence) as T[];
        return this;
    }
    distinct<K>(sentence?: string | ((item: T) => K)): ArrayWrapper<K> {
        return new ArrayWrapper(arrayDistinct(this._value, sentence));
    }
    groupBy(prop: string): { [key: string]: T[] } { return arrayGroupBy(this._value, prop); }
    groupByNested<K extends keyof T>(...keys: K[]): Record<string, any> {
        const k = [...keys].map( k => String(k));
        return arrayGroupByNested(this._value as Record<string, any>[], ...k);
    }
    toDictionary(prop: string, valueProp?: string): { [key: string]: T | any } {
        return arrayToDictionary(this._value, prop, valueProp);
    }
    sum(prop: string): number { return arraySum(this._value, prop); }
    split(size: number) { return new ArrayWrapper(arraySplit(this._value, size)); }
    sortBy(
        keyOrCriteria: ValueSelector<T> | SortCriterion<T>[],
        direction: SortDirection = 'asc'
    ): ArrayWrapper<T> {
        let sorterFunction: (a: T, b: T) => number;
        if (Array.isArray(keyOrCriteria)) {
            sorterFunction = core.createMultipleSorter(keyOrCriteria as SortCriterion<any>[]);
        } else {
            sorterFunction = core.createSimpleSorter(keyOrCriteria as ValueSelector<any>, direction);
        }
        this._value.sort(sorterFunction);
        return this;
    }
}

class PolUtils {
    str(str: string): StringWrapper { return new StringWrapper(str); }
    arr<T>(arr: T[]): ArrayWrapper<T> { return new ArrayWrapper(arr); }
    readonly core = core;
}

export const pol = new PolUtils();