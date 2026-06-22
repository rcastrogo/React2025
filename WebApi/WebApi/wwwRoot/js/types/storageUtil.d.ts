/**
 * A utility interface for managing data in the browser's `localStorage`
 * under a specific application namespace.
 *
 * Provides methods to write, read, remove, and clear stored values safely.
 */
export interface StorageUtil {
    /**
     * Writes a key-value pair to `localStorage` under the application namespace.
     *
     * @typeParam T - The type of the value being stored.
     * @param key - The storage key.
     * @param value - The value to store.
     */
    writeValue: <T>(key: string, value: T) => StorageUtil;
    /**
     * Reads a value from `localStorage` by its key.
     *
     * @typeParam T - The expected type of the returned value.
     * @param key - The storage key to read.
     * @param defaultValue - A default value returned if the key is not found or parsing fails.
     * @returns The stored value or the provided default value.
     */
    readValue: <T>(key: string, defaultValue?: T) => T;
    /**
     * Reads all key-value pairs stored under the application namespace.
     *
     * @returns An object containing all stored values indexed by their subkeys.
     */
    readAll: () => Record<string, unknown>;
    /**
     * Removes a specific key and its value from `localStorage`.
     *
     * @param key - The storage key to remove.
     */
    removeValue: (key: string) => StorageUtil;
    /**
     * Clears all entries in `localStorage` that belong to the application namespace.
     */
    clearAppData: () => StorageUtil;
}
/**
 * Implementation of the {@link StorageUtil} interface that manages `localStorage`
 * operations scoped to the `"learning-ground:"` namespace.
 */
export declare const storage: StorageUtil;
//# sourceMappingURL=storageUtil.d.ts.map