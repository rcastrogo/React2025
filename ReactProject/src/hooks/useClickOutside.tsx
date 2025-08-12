
import { useCallback, useEffect, type RefObject } from 'react';

interface UsePageNavigationProps<T> {
    listRef: RefObject<HTMLElement | null>;
    totalItems: number;
    current: number;
}

const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};


export const usePageNavigation = <T,>({
    listRef,
    totalItems,
    current,
}: UsePageNavigationProps<T>) => {

    const calculatePageIndex = useCallback((key: 'PageDown' | 'PageUp'): number => {
        if (!listRef.current || totalItems === 0) {
            return current;
        }
        if (listRef.current.children.length === 0) {
            return current;
        }
        const listHeight = listRef.current.clientHeight;
        const itemHeight = (listRef.current.children[0] as HTMLElement).offsetHeight;

        if (itemHeight === 0) {
            return current;
        }

        const itemsPerPage = Math.floor(listHeight / itemHeight);
        let newIndex = current;

        if (key === 'PageDown')
            newIndex = Math.min(current + itemsPerPage, totalItems - 1);
        else
            newIndex = Math.max(current - itemsPerPage, 0);

        return newIndex;
    }, [listRef, totalItems, current]);

    return { calculatePageIndex };
};

export default useClickOutside;