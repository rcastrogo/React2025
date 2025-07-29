import React, { useState, useRef, useEffect } from 'react';
import './CollapsibleBox.css'

interface CollapsibleBoxProps {
    title: string;
    initialContent?: string | React.ReactNode;
    onExpand?: () => void;
    height?: string;
    defaultCollapsed?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const CollapsibleBox: React.FC<CollapsibleBoxProps> = ({
    title,
    initialContent,
    onExpand,
    height = '10em',
    defaultCollapsed = true,
    className = '',
    children
}) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [loaded, setLoaded] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!loaded && !collapsed && onExpand) onExpand();
        setLoaded(true);
    }, [collapsed, loaded, onExpand]);


    const onToggleCollapse = () => {
        const willExpand = collapsed;
        setCollapsed(!collapsed);

        if (willExpand && onExpand) {
            onExpand();
        }
    };

    const bodyStyle = {
        height: height === '-' ? 'auto' : height,
        overflow: 'auto',
        display: collapsed ? 'none' : 'block'
    };

    return (
        <div className={`collapsible-box w3-border ${className}`}>
            <button
                className="w3-block w3-border-0"
                style={{ outlineStyle: 'none' }}
                onClick={onToggleCollapse}
                aria-expanded={!collapsed}
            >
                {title}
                {collapsed ? (
                    <i className="w3-large fa fa-chevron-down" style={{ margin: '2px', float: 'right' }}></i>
                ) : (
                    <i className="w3-large fa fa-chevron-up" style={{ margin: '2px', float: 'right' }}></i>
                )}
            </button>

            <div
                ref={bodyRef}
                className="w3-border-top"
                style={bodyStyle}
            >
                {children || initialContent}
            </div>
        </div>
    );
};

export default CollapsibleBox;