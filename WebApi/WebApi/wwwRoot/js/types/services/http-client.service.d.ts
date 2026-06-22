import { type WrappedFetchResponse } from './http-client.utils';
/**
 * A fluent builder for executing typed API requests using `wrappedFetch`,
 * integrated with `logFetchParams` for structured and consistent API calls.
 *
 * This allows composing HTTP requests with payloads, methods, logging,
 * response transforms, and contextual metadata — all in a clean, chainable API.
 *
 * @example
 * ```ts
 * return createApiRequest<User>()
 *   .useLog("User insertion")
 *   .usePayload({ user, aspiring_role })
 *   .postTo("create-user-aspiring-role/")
 *   .useTransform(data => ({ ...data, id: Number(data.id) }))
 *   .invoke();
 * ```
 */
export declare function createApiRequest<T>(): {
    /**
 * Sets the name of wrapped object.
 *
 * @param name - Name of target result.
 */
    useBase(value: string): /*elided*/ any;
    /**
     * Sets the name of wrapped object.
     *
     * @param name - Name of target result.
     */
    useProperty(name: string): /*elided*/ any;
    /**
     * Sets a descriptive log or context name for this API call.
     *
     * @param context - Human-readable label for logging and debugging.
     */
    useLog(context: string): /*elided*/ any;
    /**
     * Assigns a payload to be included in the request body.
     *
     * @param payload - The JSON-serializable payload object.
     */
    usePayload(payload: unknown): /*elided*/ any;
    /**
     * Sets a transformation function that processes the response data
     * before returning it to the caller.
     *
     * @param transform - Function that maps the API response to another shape.
     */
    useTransform(transform: (data: T) => T): /*elided*/ any;
    /**
     * Specifies a GET endpoint.
     *
     * @param target - The target or endpoint URL (relative or absolute).
     */
    getFrom(target: string): /*elided*/ any;
    /**
     * Specifies a POST endpoint.
     *
     * @param target - The target or endpoint URL (relative or absolute).
     */
    postTo(target: string): /*elided*/ any;
    /**
     * Specifies a PUT endpoint.
     *
     * @param target - The target or endpoint URL (relative or absolute).
     */
    putTo(target: string): /*elided*/ any;
    /**
     * Specifies a PATCH endpoint.
     *
     * @param target - The target or endpoint URL (relative or absolute).
     */
    patchTo(target: string): /*elided*/ any;
    /**
     * Specifies a DELETE endpoint.
     *
     * @param target - The target or endpoint URL (relative or absolute).
     */
    deleteFrom(target: string): /*elided*/ any;
    useToken(token: string): /*elided*/ any;
    withHeader(key: string, value: string): /*elided*/ any;
    /**
     * Executes the composed API request using `wrappedFetch`.
     * Automatically logs parameters and applies transformations if defined.
     */
    invoke(): Promise<WrappedFetchResponse<T> | string>;
};
declare const RQ: {
    create: <T>() => {
        /**
     * Sets the name of wrapped object.
     *
     * @param name - Name of target result.
     */
        useBase(value: string): /*elided*/ any;
        /**
         * Sets the name of wrapped object.
         *
         * @param name - Name of target result.
         */
        useProperty(name: string): /*elided*/ any;
        /**
         * Sets a descriptive log or context name for this API call.
         *
         * @param context - Human-readable label for logging and debugging.
         */
        useLog(context: string): /*elided*/ any;
        /**
         * Assigns a payload to be included in the request body.
         *
         * @param payload - The JSON-serializable payload object.
         */
        usePayload(payload: unknown): /*elided*/ any;
        /**
         * Sets a transformation function that processes the response data
         * before returning it to the caller.
         *
         * @param transform - Function that maps the API response to another shape.
         */
        useTransform(transform: (data: T) => T): /*elided*/ any;
        /**
         * Specifies a GET endpoint.
         *
         * @param target - The target or endpoint URL (relative or absolute).
         */
        getFrom(target: string): /*elided*/ any;
        /**
         * Specifies a POST endpoint.
         *
         * @param target - The target or endpoint URL (relative or absolute).
         */
        postTo(target: string): /*elided*/ any;
        /**
         * Specifies a PUT endpoint.
         *
         * @param target - The target or endpoint URL (relative or absolute).
         */
        putTo(target: string): /*elided*/ any;
        /**
         * Specifies a PATCH endpoint.
         *
         * @param target - The target or endpoint URL (relative or absolute).
         */
        patchTo(target: string): /*elided*/ any;
        /**
         * Specifies a DELETE endpoint.
         *
         * @param target - The target or endpoint URL (relative or absolute).
         */
        deleteFrom(target: string): /*elided*/ any;
        useToken(token: string): /*elided*/ any;
        withHeader(key: string, value: string): /*elided*/ any;
        /**
         * Executes the composed API request using `wrappedFetch`.
         * Automatically logs parameters and applies transformations if defined.
         */
        invoke(): Promise<string | WrappedFetchResponse<T>>;
    };
};
export { RQ };
//# sourceMappingURL=http-client.service.d.ts.map