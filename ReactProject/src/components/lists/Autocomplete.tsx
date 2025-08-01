
import { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside, { usePageNavigation } from "../../hooks/useClickOutside";

interface AutoCompleteControlProps<T> {
    onFetchSuggestions: (inputValue: string) => Promise<T[]>;
    onSelect?: (selectedItem: T) => void;
    renderItem?: (item: T) => React.ReactNode;
    debounceTime?: number;
    placeholder?: string;
    initialValue?: string;
    listHeight: string;
    textProvider: (item: T) => string
}

function AutoCompleteControl<T>({
    onFetchSuggestions,
    onSelect,
    renderItem = (item: T) => <span>{item?.toString()}</span>,
    debounceTime = 300,
    placeholder = "Escribe para buscar...",
    initialValue = '',
    listHeight = 'initial',
    textProvider = item => (item as Object).toString()
}: AutoCompleteControlProps<T>) {

    const [inputValue, setInputValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<T[]>([]);
    const [currentFocus, setCurrentFocus] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef(null);
    const listRef = useRef<HTMLDivElement>(null);
    const {calculatePageIndex} = usePageNavigation({
        listRef,
        totalItems: suggestions.length,
        current: currentFocus,
    });

    // ====================================================================================
    // KeyDown 
    // ====================================================================================
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;

        if (e.key === 'Escape') {
            e.preventDefault();
            setSuggestions([]);
            return;
        }
        if (e.key === 'Tab') {
            setSuggestions([]);
            return;
        }
        if (key === 'ArrowDown') {
            e.preventDefault();
            setCurrentFocus(Math.min(currentFocus + 1, suggestions.length - 1));
            return;
        }
        if (key === 'ArrowUp') {
            e.preventDefault();
            setCurrentFocus(Math.max(currentFocus - 1, 0));
        }
        if (key === 'Enter') {
            if (currentFocus > -1) handleSuggestionClick(suggestions[currentFocus]);
            e.preventDefault();
            return;
        }
        if (key === 'PageDown' || key === 'PageUp') {
            e.preventDefault();
            const index = calculatePageIndex(key);
            setCurrentFocus(index);
            return;
        }
    };

    // ====================================================================================
    // Carga de la lista de sugerencias 
    // ====================================================================================
    const closeSuggestions = () => setSuggestions([]);
    useClickOutside(wrapperRef, closeSuggestions);

    const fetchSuggestions = async (value: string) => {
        if (value && value.length < 3) return;
        if (!value) {
            setSuggestions([]);
            setCurrentFocus(-1);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const fetchedData = await onFetchSuggestions(value);
            setSuggestions(fetchedData);
            if (fetchedData.length > 0) {
                setCurrentFocus(0);
            } else {
                setCurrentFocus(-1);
            }
        } catch (error) {
            setSuggestions([]);
            setCurrentFocus(-1);
        }
        finally {
            setIsLoading(false);
        }
    };
    const search = useDebounce(fetchSuggestions, debounceTime);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        search(value);
        if (value.length >= 3) {
            setIsLoading(true);
        } else {
            setSuggestions([]);
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (item: T) => {
        setInputValue(textProvider(item));
        closeSuggestions();
        if (onSelect) onSelect(item);
    };

    // ==========================================================================
    // Scrolling Active Item into View
    // ==========================================================================
    useEffect(() => {
        if (currentFocus > -1 && listRef.current) {
            const target = listRef.current.children[currentFocus] as HTMLElement;
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [currentFocus]);

    useEffect(() => {
        setCurrentFocus(suggestions.length ? 0 : -1);
    }, [suggestions]);


    // ==========================================================================
    // Skeleton Rows Generation
    // ==========================================================================
    const skeletonRows = () => {
        const num = suggestions.length > 0 ? suggestions.length : 3;
        return Array.from({ length: num }, (_, i) => (
            <div key={`skeleton-${i}`}>
                <div className="skeleton" style={{ height: '20px', width: '150px', marginBottom: '4px' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '4px' }}></div>
            </div>
        ));
    };

    return (
        <div className="autocomplete" ref={wrapperRef}>
            <input
                type="text"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (inputValue) search(inputValue); }}
                value={inputValue}
                placeholder={placeholder}
                style={{ width: '100%', padding: '4px' }}
            />
            {(suggestions.length > 0 || isLoading) && (
                <div className="autocomplete-items"
                    ref={listRef}
                    style={{ height: listHeight }}>
                    {isLoading ? (
                        skeletonRows()
                    ) : (
                        suggestions.map((item, index) => (
                            <div
                                key={index}
                                data-index={index}
                                className={index === currentFocus ? 'autocomplete-active' : ''}
                                onClick={() => handleSuggestionClick(item)}
                            >
                                {renderItem(item)}
                            </div>
                        ))
                    )}
                    {!isLoading && suggestions.length === 0 && inputValue.length >= 3 && (
                        <div className="w3-padding w3-text-gray">No se encontraron resultados.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutoCompleteControl;
