import { useCallback, useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react";
import useClickOutside, { usePageNavigation } from "../../hooks/useClickOutside";
import { pol } from "../../utils/pol";

export interface option {
    value: string;
    label: string;
    data?: any;

}

interface ComboBoxControlProps {
    options: option[] | undefined;
    onChange?: (value: string) => void;
    value?: string;
    disabled?: boolean;
    resolve?: (item:any) => ReactNode;
}

function ComboBoxControl({
    options = [],
    onChange = (value: string) => console.log(value),
    value = '',
    disabled = false,
    resolve = undefined,
}: ComboBoxControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedLabel, setSelectedLabel] = useState('Seleccionar...')
    const comboBoxRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const { calculatePageIndex } = usePageNavigation({
        listRef,
        totalItems: options.length,
        current: highlightedIndex,
    });

    useClickOutside(comboBoxRef, () => { setIsOpen(false) });

    const handleToggle = () => setIsOpen(!isOpen);
    const handleOptionClick = (option: option) => {
        if (option.value !== value) {
            setSelectedLabel(option.label);
            onChange(option.value);
            const input = comboBoxRef.current ? comboBoxRef.current.querySelector<HTMLInputElement>('.w3-input')
                : null;
            input && input.focus();
        }
        setIsOpen(false);
    };

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {

        const { key } = e;
        if (isOpen && (key == 'Tab' || key === 'Escape')) {
            setIsOpen(false);
            return;
        }
        else if (!isOpen && (key === 'ArrowDown' || key === 'Enter' || key === ' ')) {
            e.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(find().index);
            return;
        }

        switch (key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(Math.min(highlightedIndex + 1, options.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (highlightedIndex !== -1) {
                    const option = options[highlightedIndex];
                    if (option.value !== value) {
                        setSelectedLabel(option.label);
                        onChange(option.value);
                    }
                    setIsOpen(false);
                }
                break;
            case 'PageDown':
            case 'PageUp':
                e.preventDefault();
                if (isOpen) {
                    const index = calculatePageIndex(key);
                    setHighlightedIndex(index);
                }
                break
            default:
                break;
        }
    }, [isOpen, options, value, onChange, highlightedIndex]);

    const scrollIntoView = (index: number) => {
        if (listRef.current) {
            const activeDiv = listRef.current.children[index] as HTMLElement;
            if (activeDiv) {
                activeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    const find = () => {
        const index = options.findIndex(opt => opt.value == value);
        const option = options[index];
        return { index, option }
    }

    useEffect(() => {
        console.log('ComboBoxControl.render');
    });

    useEffect(() => {
        scrollIntoView(highlightedIndex);
    }, [highlightedIndex]);

    useEffect(() => {
        const {option, index} = find();
        if (isOpen) {
            setHighlightedIndex(index !== -1 ? index : 0);
            scrollIntoView(index)
        }
        if (option) setSelectedLabel(option.label);

    }, [isOpen, options, value]);

    return (
        <div ref={comboBoxRef}
            className={`autocomplete combo-box ${isOpen ? 'open' : ''}`}
        >
            <input
                className="w3-input w3-border w3-round-large"
                type="text"
                value={selectedLabel}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                readOnly={true}
                disabled={disabled}
                style={{ width: '100%' }}
            />
            <div ref={listRef}
                className={`autocomplete-items ${isOpen ? '' : 'w3-hide'}`}
                tabIndex={-1}>
                {
                    options.map((item, index) => (
                        <div
                            key={item.value}
                            id={item.value}
                            data-index={index}
                            className={index === highlightedIndex ? 'autocomplete-active' : ''}
                            onClick={() => handleOptionClick(item)}
                        >
                            {resolve && item.data && resolve(item.data) || item.label}
                        </div>

                    ))
                }
            </div>
        </div>
    );
};

export default ComboBoxControl;
