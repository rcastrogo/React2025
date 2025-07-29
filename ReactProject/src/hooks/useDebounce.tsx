import { useRef, useEffect, useCallback } from 'react';

type AnyFunction = (...args: any[]) => any;

const useDebounce = <T extends AnyFunction>(
    callback: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>): void => {

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};

export default useDebounce;