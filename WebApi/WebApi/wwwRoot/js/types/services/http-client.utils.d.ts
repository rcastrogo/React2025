export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
/**
 * Represents a successful result returned by the `wrappedFetch` utility.
 *
 * @template T - The type of the data returned from the request.
 *
 * @property {true} success - Indicates that the request completed successfully.
 * @property {string} message - A descriptive message, usually provided by the API.
 * @property {T} data - The parsed and typed data returned from the API response.
 *
 * @example
 * ```ts
 * type User = { id: number; name: string };
 *
 * const result: WrappedFetchResponse<User[]> = {
 *   success: true,
 *   message: "Users fetched successfully",
 *   data: [{ id: 1, name: "Alice" }]
 * };
 * ```
 */
export interface WrappedFetchResponse<T> {
    success: true;
    message: string;
    data: T;
}
/**
 * Executes an HTTP request with standardized error handling and typing.
 *
 * This utility wraps a `fetch` call (or any async function returning a `Response`)
 * to ensure consistent return shapes and safer error reporting.
 *
 * @template T - The expected type of the successful response data.
 *
 * @param requestFn - A function that executes the HTTP request and returns a `Promise<Response>`.
 * @param context - Optional string describing the context or resource being fetched (used for logging).
 * @param processResponse - Optional function to transform or process the response data before returning.
 *
 * @returns A `Promise` resolving to:
 * - `{ success: true, message: string, data: T }` if the request succeeds.
 * - `{ error: string, stackError?: string }` if the request fails.
 *
 * @example
 * ```ts
 * type User = { id: number; name: string };
 *
 * const result = await wrappedFetch<User[]>(() =>
 *   fetch("https://api.example.com/users")
 * );
 *
 * if (result.success) {
 *   console.log(result.data); // ✅ Typed as User[]
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export declare function wrappedFetch<T>(requestFn: () => Promise<Response>, target?: string, context?: string, processResponse?: (data: T) => T): Promise<WrappedFetchResponse<T> | string>;
/**
 * Log fetch parameters and return a structured object for destructuring.
 *
 * Logs the URL and, if present, the payload. Also returns the HTTP method
 * so callers can use it when building RequestInit or for more informative logs.
 *
 * @template T - Type of the optional payload.
 * @param url - The request URL.
 * @param payload - Optional request payload (body).
 * @param method - HTTP method to use (default: 'GET').
 * @returns An object containing { url, payload, method }.
 *
 * @example
 * ```ts
 * const { url, payload, method } = logFetchParams(
 *   `${apiUrl}users/`,
 *   { user, aspiring_role },
 *   'POST'
 * );
 *
 * // Use with wrappedFetch overload that accepts url/options:
 * const result = await wrappedFetch<User>(
 *   url,
 *   { method, body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } },
 *   'Users'
 * );
 * ```
 */
export declare function logFetchParams<T = unknown>(url: string, payload?: T, method?: HttpMethod): {
    url: string;
    payload?: T | undefined;
    method: HttpMethod;
};
/**
 * Simulates a fetch-like response for debugging or testing purposes.
 *
 * @template T - Type of the expected successful response data.
 * @param type - `'Success'` for success, `'Fail'` for error.
 * @param message - Message to include in the response (success or error message).
 * @param data - Optional data payload to include when simulating success.
 * @returns Either an `ErrorStack` (if type = `'Fail'`) or a `WrappedFetchResponse<T>` (if type = `'Success'`).
 *
 * @example
 * ```ts
 * // Simulate a success response
 * const success = mockFetchResponse("Success", "User created", { id: 1 });
 *
 * // Simulate an error response
 * const error = mockFetchResponse("Fail", "Network failure");
 * ```Fail
 */
export declare function mockFetchResponse<T>(type: 'Success' | 'Fail', message: string, data?: T): WrappedFetchResponse<T> | string;
/**
 * Asynchronous variant of `WrappedFetchResponse`, designed for use in async functions.
 *
 * @template T - Type of the expected successful response data.
 * @param type - `'Success'` for success, `'Fail'` for error.
 * @param message - Message to include in the response.
 * @param data - Optional data payload for success.
 * @returns A Promise resolving to either `ErrorStack` or `WrappedFetchResponse<T>`.
 *
 * @example
 * ```ts
 * // Inside an async function:
 * const result = await mockFetchResponseAsync("Success", "Request completed", { id: 123 });
 * ```
 */
export declare function mockFetchResponseAsync<T>(type: 'Success' | 'Fail', message: string, data?: T): Promise<WrappedFetchResponse<T> | string>;
//# sourceMappingURL=http-client.utils.d.ts.map