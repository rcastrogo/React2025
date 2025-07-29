import { useCallback, useEffect, useRef, useState, type MouseEventHandler } from "react";
import useClickOutside from "../../hooks/useClickOutside";

interface Resolver<T> {
    text: keyof T;
    id: keyof T;
}

interface ComboBoxControlProps<T> {
    dataSource: T[];
    resolver?: Resolver<T>;
    onSelect?: (value: T | null) => void;
    value?: string;
}

function ComboBoxControl<T>({
    dataSource = [],
    resolver = {
        text: 'name' as keyof T,
        id: 'id' as keyof T
    },
    onSelect = (value: T | null) => console.log(value),
    value = ''

}: ComboBoxControlProps<T>) {
    const [inputValue, setInputValue] = useState('');
    const [hiddenValue, setHiddenValue] = useState('');
    const [showList, setShowList] = useState(false);
    const [selectedIndex, setSelectIndex] = useState(-1);

    const wrapperRef = useRef(null);
    const listRef = useRef<HTMLDivElement>(null); // Ref for the autocomplete-items div

    const getText = useCallback((item: any) => resolver ? item[resolver.text] : item.toString(), [resolver]);
    const getId = useCallback((item: any) => resolver ? item[resolver.id] : item.toString(), [resolver]);


    useClickOutside(wrapperRef, () => { setShowList(false) });

    const setCurrentIndex = useCallback((index: number, close = true) => {
        setSelectIndex(index);
        if (index == -1) {
            setInputValue('');
            setHiddenValue(getId(''));
            if (onSelect) onSelect(null);
            return;
        }
        var target = dataSource[index];
        setInputValue(getText(target));
        setHiddenValue(getId(target));
        if (onSelect) onSelect(target);
        if(close) setShowList(false);
    }, [getText, getId, dataSource]);

    const handleInputClick = () => {
        setShowList(!showList);
    };

    useEffect(() => {
        let newIndex = -1;
        if (value) {
            dataSource.map((d, index) => {
                if (value == getId(d)) newIndex = index
            });
        }
        setCurrentIndex(newIndex);
    }, [value]);

    // ====================================================================================
    // --- Effect for Scrolling Active Item into View ---
    // ====================================================================================
    useEffect(() => {
        if (showList && selectedIndex > -1 && listRef.current) {
            const activeDiv = listRef.current.children[selectedIndex] as HTMLElement;
            if (activeDiv) {
                activeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [showList, selectedIndex, dataSource]);

    // ====================================================================================
    // --- handleKeyDown ---
    // ====================================================================================
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {

        const { key } = e;

        if (key == 'Tab') {
            setShowList(false);
            return;
        }
        if (key === 'Escape') {
            setShowList(false);
            e.preventDefault();
            return;
        }
        if (key === 'ArrowDown') {
            e.preventDefault(); 
            if(showList)
                setCurrentIndex(Math.min(selectedIndex + 1, dataSource.length - 1), false);
            else
                setShowList(true);
            return;
        } 
        if (key === 'ArrowUp') {
            e.preventDefault(); 
            if (showList)
                setCurrentIndex(Math.max(selectedIndex - 1, 0), false);
        }
        if (key === 'Enter') {
            e.preventDefault(); 
            if (showList && selectedIndex > -1)
                setShowList(false);
            else 
                setShowList(true);
            return;
        }
        if (key === 'PageDown' || key === 'PageUp') {
            e.preventDefault(); 
            if (showList) {
                if (listRef.current && dataSource.length) {
                    const listHeight = listRef.current.clientHeight;
                    const itemHeight = (listRef.current.children[0] as HTMLElement).offsetHeight;
                    if (itemHeight === 0) return; 

                    const itemsPerPage = Math.floor(listHeight / itemHeight);
                    let newIndex = selectedIndex;
                    if (key === 'PageDown') {
                        newIndex = Math.min(selectedIndex + itemsPerPage, dataSource.length - 1);
                    } else { 
                        newIndex = Math.max(selectedIndex - itemsPerPage, 0);
                    }
                    setCurrentIndex(newIndex, false);
                }
            }
        }
    }, [showList, selectedIndex, dataSource, setCurrentIndex, hiddenValue, getId]);


    return (
        <div ref={wrapperRef}
            className={`autocomplete combo-box ${showList ? 'open' : ''}`}
        >
            <input
                type="text"
                value={inputValue}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                readOnly={true}
                style={{ width:'100%'}}
            />
            <input type="hidden" value={hiddenValue} />
            <div ref={listRef}
                 className={`autocomplete-items ${showList ? '' : 'w3-hide'}`}
                 tabIndex={-1}>
                {
                    dataSource.map((item, index) => (
                        <div
                            key={getId(item) || index}
                            id={getId(item)}
                            data-index={index}
                            className={index === selectedIndex ? 'autocomplete-active' : ''}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {getText(item)}
                        </div>

                    ))
                }
            </div>
        </div>
    );
};

export default ComboBoxControl;
