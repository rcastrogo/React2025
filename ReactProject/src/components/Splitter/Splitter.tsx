
import { useEffect, useRef, useState, type ReactNode } from "react";
import { pol } from "../../utils/pol";
import useDebounce from "../../hooks/useDebounce";

export type SplitterMode = 'horizontal' | 'vertical';

interface SplitterProps {
    name: string;
    children: [ReactNode, ReactNode];
}

const appConfig = pol.core.config('ReactApp');


const Splitter = ({ children, name = '' }: SplitterProps) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const panelOneRef = useRef<HTMLDivElement>(null);
    const splitterBarRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const dragState = useRef({
        startX: 0,
        startY: 0,
        initialSize: 0,
        containerSize: 0,
    });

    const MODE_KEY = `${name}-mode`;
    const H_SIZE_KEY = `${name}-h-size`;
    const V_SIZE_KEY = `${name}-v-size`;
    const [mode, setMode] = useState<SplitterMode>((appConfig.read(MODE_KEY) as SplitterMode) || 'horizontal');
    const [horizontalSize, setHorizontalSize] = useState<string>(appConfig.read(H_SIZE_KEY) || '40%');
    const [verticalSize, setVerticalSize] = useState<string>(appConfig.read(V_SIZE_KEY) || '40%');
    useEffect(() => { appConfig.write(MODE_KEY, mode); }, [mode, MODE_KEY]);
    useEffect(() => { appConfig.write(H_SIZE_KEY, horizontalSize); }, [horizontalSize, H_SIZE_KEY]);
    useEffect(() => { appConfig.write(V_SIZE_KEY, verticalSize); }, [verticalSize, V_SIZE_KEY]);

    useEffect(() => {
        const splitterBar = splitterBarRef.current;
        if (!splitterBar) return;

        const handleDoubleClick = () => {
            const panelOne = panelOneRef.current;
            if (panelOne) {
                if (mode === 'horizontal') {
                    setHorizontalSize(`${panelOne.offsetWidth}px`);
                } else {
                    setVerticalSize(`${panelOne.offsetHeight}px`);
                }
            }
            setMode((prevMode) => (prevMode === 'horizontal' ? 'vertical' : 'horizontal'));
        };

        splitterBar.addEventListener('dblclick', handleDoubleClick);

        return () => {
            splitterBar.removeEventListener('dblclick', handleDoubleClick);
        };
    }, [mode]);

    const handleMouseMove = (e: MouseEvent) => {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = mode === 'horizontal' ? 'col-resize' : 'row-resize';

        const { startX, startY, initialSize, containerSize } = dragState.current;

        let newSize;
        if (mode === 'vertical') {
            const delta = e.pageY - startY;
            newSize = initialSize + delta;
            newSize = Math.min(Math.max(40, newSize), containerSize - 40);
            setVerticalSize(`${newSize}px`);
        } else {
            const delta = e.pageX - startX;
            newSize = initialSize + delta;
            newSize = Math.min(Math.max(40, newSize), containerSize - 40);
            setHorizontalSize(`${newSize}px`);
        }
    };

    const debouncedHandleMouseMove = useDebounce(handleMouseMove, 10);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        window.addEventListener('mousemove', debouncedHandleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', debouncedHandleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, mode, debouncedHandleMouseMove]);


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);

        const panelOne = panelOneRef.current;
        const container = containerRef.current;
        if (!panelOne || !container) return;

        dragState.current = {
            startX: e.pageX,
            startY: e.pageY,
            initialSize: mode === 'horizontal' ? panelOne.offsetWidth : panelOne.offsetHeight,
            containerSize: mode === 'horizontal' ? container.offsetWidth : container.offsetHeight,
        };
    };

    const [panelOne, panelTwo] = children;
    const currentSize = mode === 'horizontal' ? horizontalSize : verticalSize;
    const overflowYStyle = (mode === 'vertical' &&
        panelOneRef.current &&
        panelOneRef.current.offsetHeight <= 70) ? 'hidden' : 'auto';
    const overflowXStyle = (mode === 'horizontal' &&
        panelOneRef.current &&
        panelOneRef.current.offsetWidth <= 70) ? 'hidden' : 'auto';
    return (
        <>
            <div
                ref={containerRef}
                className="splitter-panel-container"
                style={{
                    flexDirection: mode === 'vertical' ? 'column' : 'row',
                }}
            >
                <div
                    ref={panelOneRef}
                    className="splitter-panel"
                    style={{
                        ...(mode === 'horizontal'
                            ? { width: currentSize, overflow: overflowXStyle }
                            : { height: currentSize, overflow: overflowYStyle }
                        )
                    }}
                >
                    {panelOne}
                </div>
                <div
                    ref={splitterBarRef}
                    onMouseDown={handleMouseDown}
                    className="splitter-bar"
                    style={{
                        ...(mode === 'horizontal' ? { width: '8px', cursor: 'col-resize' } : { height: '8px', cursor: 'row-resize' })
                    }}
                ></div>
                <div
                    className="splitter-panel"
                    style={{ flexGrow: 1 }}
                >
                    {panelTwo}
                </div>
            </div>
        </>
    );
};

export default Splitter;
