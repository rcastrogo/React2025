
import { useCallback, useEffect, useRef, useState, type MouseEventHandler } from "react";
import { usePageNavigation } from '../../hooks/useClickOutside'; 


interface Resolver<T> {
    text: keyof T;
    id: keyof T;
}

interface ListControlProps<T> {
    dataSource: T[];
    resolver?: Resolver<T>;
    onSelect?: (value: string[]) => void;
    value?: string | string[];
    listHeight: string;
    multiSelect?: boolean;
}

const ListControl = <T extends Record<string, any>>({
    dataSource = [],
    resolver = {
        text: 'name' as keyof T,
        id: 'id' as keyof T
    },
    onSelect = (value: string[]) => console.log(value),
    value = '',
    listHeight = '',
    multiSelect = false
}: ListControlProps<T>) => {

    const [hiddenValue, setHiddenValue] = useState('');

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [active, setActive] = useState(-1);

    const listRef = useRef<HTMLUListElement>(null);    
    const {calculatePageIndex} = usePageNavigation({
        listRef,
        totalItems: dataSource.length,
        current: active,
    });

    const getText = useCallback((item: any) => resolver ? String(item[resolver.text]) : item.toString(), [resolver]);
    const getId = useCallback((item: any) => resolver ? String(item[resolver.id]) : item.toString(), [resolver]);

    // =======================================================================
    // Inicialización para 'value' al montar o si cambia value o dataSource
    // =======================================================================
    useEffect(() => {
        if (dataSource.length) {
            console.log('useEffect');
            const ids = Array.isArray(value) ? value : (value ? [value] : []);
            const targets = dataSource.reduce((acc, item) => {
                var id = getId(item);
                if (ids.includes(id)) acc.add(id);
                return acc;
            }, new Set<string>());
            __setSelectedIds(targets);
            return;
        };
    }, [dataSource]);
    // =======================================================================
    // Mover el foco a un elemento de la lista
    // =======================================================================
    const setFocusedElelemntByIndex = (index: number) => {
        setActive(index);
        if (listRef.current && index > -1) {
            (listRef.current.children[index] as HTMLLIElement).focus();
        }
    };
    // =======================================================================
    // Función para notificar la selección
    // =======================================================================
    const raiseOnSelect = () => {
        const targets = selectedIds.size ? [...selectedIds] : [];
        setHiddenValue(targets.join(','));
        onSelect(targets);
    };
    // =======================================================================
    // Notificar la selección cuando 'selectedIds'cambia     
    // =======================================================================
    useEffect(() => {
        raiseOnSelect();
    }, [selectedIds]);
    // =======================================================================
    // Lógica de selección del elemento
    // =======================================================================
    const handleItemClick = (index: number) => {
        if (dataSource.length) {
            const target = dataSource[index];
            const targetId = getId(target);

            if (selectedIds.has(targetId))
                selectedIds.delete(targetId);
            else
                selectedIds.add(targetId);

            setFocusedElelemntByIndex(index);
            __setSelectedIds(new Set(selectedIds));
        }
    };
    const __setSelectedIds = (value:Set<string>) => {
        if(value.size){
            if(multiSelect)
                setSelectedIds(new Set(value));
            else {
                const values = [...value];
                setSelectedIds(new Set([values[values.length - 1]])); 
            }
        } else 
            setSelectedIds(new Set());
    }
    // ====================================================================================
    // handleKeyDown
    // ====================================================================================
    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {

        if (dataSource.length === 0) return;

        const { key } = e;
        if (key === 'ArrowDown') {
            e.preventDefault();
            setFocusedElelemntByIndex(Math.min(active + 1, dataSource.length - 1));
            return;
        }
        if (key === 'ArrowUp') {
            e.preventDefault();
            setFocusedElelemntByIndex(Math.max(active - 1, 0));
            return;
        }
        if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            handleItemClick(active);
            return;
        }
        if (key === 'PageDown' || key === 'PageUp') {
            e.preventDefault();
            const index = calculatePageIndex(key);
            setFocusedElelemntByIndex(index);
            return;
        }
        if(key === 'Home'){
            e.preventDefault();
            setFocusedElelemntByIndex(0);
            return;
        }
        if(key === 'End'){
            e.preventDefault();
            setFocusedElelemntByIndex(dataSource.length - 1);
            return;
        }
    };
    // ===============================================================================
    // Effect for Scrolling Active Item into View
    // ===============================================================================
    useEffect(() => {
        if (selectedIds.size == 1 && listRef.current) {
            const targetId = selectedIds.values().next().value
            const target = Array.from(listRef.current.children)
                .find(li => li.id === targetId);
            target && target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, []);

    return (
        <>
            <input type="hidden" value={hiddenValue} />
            <ul ref={listRef}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={'rcg-list w3-border'}
                style={{ height: listHeight }}
            >
                {
                    dataSource.map((item, index) => {
                        const itemId = getId(item);
                        const isSelected = selectedIds.has(itemId);
                        return (
                            <li
                                key={itemId.id} //
                                id={itemId}
                                data-index={index}
                                data-key={itemId}
                                tabIndex={-1}
                                className={`${isSelected ? 'autocomplete-active' : ''}`}
                                onClick={() => { handleItemClick(index); }}
                            >
                                {getText(item)}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
};

export default ListControl;
