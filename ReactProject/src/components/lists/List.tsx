
import { useCallback, useEffect, useRef, useState, type MouseEventHandler } from "react";

interface Resolver<T> {
    text: keyof T;
    id: keyof T;
}

interface ListControlProps<T> {
    dataSource: T[];
    resolver?: Resolver<T>;
    onSelect?: (value: T | null) => void;
    value?: string;
    listHeight:string
}

const ListControl = <T extends Record<string, any>>({
    dataSource = [],
    resolver = {
        text: 'name' as keyof T,
        id: 'id' as keyof T
    },
    onSelect = (value: T | null) => console.log(value),
    value = '',
    listHeight = ''

}: ListControlProps<T>) => {

    const [hiddenValue, setHiddenValue] = useState('');
    const [selectedIndex, setSelectIndex] = useState(-1);

    const listRef = useRef<HTMLUListElement>(null); 

    const getText = useCallback((item: any) => resolver ? item[resolver.text] : item.toString(), [resolver]);
    const getId = useCallback((item: any) => resolver ? item[resolver.id] : item.toString(), [resolver]);

    const setCurrentIndex = useCallback((index: number) => {
        setSelectIndex(index);
        if (index == -1) {
            setHiddenValue('');
            if (onSelect) onSelect(null);
            return;
        }
        var target = dataSource[index];
        setHiddenValue(getId(target));
        if (onSelect) onSelect(target);
    }, [getText, getId, dataSource]);


    useEffect(() => {
        let newIndex = -1;
        if (value) {
            dataSource.map((d, index) => {
                if (value == getId(d)) newIndex = index
            });
        }
        setCurrentIndex(newIndex);
    }, [value, dataSource]);

    // ====================================================================================
    // Effect for Scrolling Active Item into View
    // ====================================================================================
    useEffect(() => {
        if (selectedIndex > -1 && listRef.current) {
            const activeDiv = listRef.current.children[selectedIndex] as HTMLElement;
            if (activeDiv) {
                activeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });

    // ====================================================================================
    // --- handleKeyDown ---
    // ====================================================================================
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLUListElement>) => {
        const { key } = e;
        if (key === 'ArrowDown') {
            e.preventDefault();
            setCurrentIndex(Math.min(selectedIndex + 1, dataSource.length - 1));
            return;
        }
        if (key === 'ArrowUp') {
            e.preventDefault();
            setCurrentIndex( Math.max(selectedIndex - 1, 0));
        }
        if (key === 'Enter') {
            e.preventDefault();
            return;
        }
        if (key === 'PageDown' || key === 'PageUp') {
            e.preventDefault();
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
                setCurrentIndex(newIndex);
            }
        }
    }, [selectedIndex, dataSource, setCurrentIndex, hiddenValue, getId]);


    return (
        <>
            <input type="hidden" value={hiddenValue} />
            <ul ref={listRef}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={'rcg-list w3-border'}
                style={{ height: listHeight}}
                >
                {
                    dataSource.map((item, index) => (
                        <li
                            key={index}
                            id={getId(item)}
                            data-index={index}
                            data-key={getId(item)}
                            tabIndex={-1}
                            className={index === selectedIndex ? 'autocomplete-active' : ''}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {getText(item)}
                        </li>

                    ))
                }
            </ul>
        </>
    );
};

export default ListControl;


//  className={selectedItems.has(item.id) ? 'selected' : ''}
//  onClick={() => handleItemClick(item)}
//  {/* Aquí renderizamos el contenido directamente. */}
//  {renderItem ? renderItem(item) : item.text}

