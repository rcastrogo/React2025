import React, { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { appConfig } from '../../services/configService';

// -----------------------------------------------------------
// Tipos e Interfaces
// -----------------------------------------------------------

// 1. Interfaz para la estructura de los datos del panel
interface PanelData {
    id: string;
    title: string;
    content: ReactNode;
}

// 2. Interfaz para las props del componente HorizontalScroller
interface HorizontalScrollerProps {
    items: PanelData[];
    renderItem: (item: PanelData, isVisible: boolean, scrollToItem: (id: string) => void) => ReactNode;
}

// 3. Interfaz para las props del componente PanelView
interface PanelViewProps {
    data: PanelData;
    isVisible: boolean;
}

// -----------------------------------------------------------
// Componente HorizontalScroller
// -----------------------------------------------------------
const HorizontalScroller = ({ items, renderItem }: HorizontalScrollerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleItemIds, setVisibleItemIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const element = entry.target as HTMLElement;
                    const itemId = element.dataset.itemId;
                    if (!itemId) return; // Validación de tipo

                    if (entry.isIntersecting) {
                        setVisibleItemIds((prev) => new Set(prev).add(itemId));
                        observer.unobserve(entry.target);
                    } else {
                        setVisibleItemIds((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(itemId);
                            return newSet;
                        });
                    }
                });
            },
            {
                root: containerRef.current,
                rootMargin: '0px 500px 0px 0px',
                threshold: 0.5,
            }
        );

        const currentContainer = containerRef.current;
        if (currentContainer) {
            Array.from(currentContainer.children).forEach((child) => {
                observer.observe(child);
            });
        }

        return () => {
            if (currentContainer) {
                observer.disconnect();
            }
        };
    }, [items]);

    const scrollToItem = (itemId: string) => {
        const itemElement = containerRef.current?.querySelector<HTMLElement>(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            itemElement.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
            });
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                overflowX: 'scroll',
                height: '100%',
                whiteSpace: 'nowrap',
                scrollSnapType: 'x mandatory',
                paddingRight: '0',
                boxSizing: 'border-box',
            }}
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    data-item-id={item.id}
                    className="snap-panel-container"
                    onClick={() => scrollToItem(item.id)}
                >
                    {renderItem(item, visibleItemIds.has(item.id), scrollToItem)}
                </div>
            ))}
        </div>
    );
};

// -----------------------------------------------------------
// Componente PanelView
// -----------------------------------------------------------
const PanelView = ({ data, isVisible }: PanelViewProps) => {
    const [panelData, setPanelData] = useState<PanelData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isVisible && !panelData && !isLoading) {
            setIsLoading(true);
            setTimeout(() => {
                setPanelData(data);
                setIsLoading(false);
            }, 500);
        }
    }, [isVisible, panelData, isLoading, data]);

    if (isLoading) {
        return (
            <div style={{ padding: '16px', height: '100%' }}>
                <h3>Panel de control</h3>
            </div>
        );
    }

    if (!panelData) {
        return null;
    }

    return (
        <div style={{ padding: '16px', height: '100%' }}>
            <h3>{panelData.title}</h3>
            <div>{panelData.content}</div>
        </div>
    );
};

function getText(): string {
    return appConfig.read('TextToSpeech.value') || '';
}

function saveText(value: string): void {
    appConfig.write('TextToSpeech.value', value);
}

const TextToSpeech = () => {
    const [text, setText] = useState(getText());
    const [voices, setVoices] = useState(new Array<SpeechSynthesisVoice>());
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        const getVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0]);
            }
        };
        getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = getVoices;
        }
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    useEffect(() => {
        saveText(text);
    }, [text]);

    const handleSpeak = () => {
        if (text.trim() !== '' && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Convertir texto a voz</h1>
            <textarea
                rows={4}
                cols={50}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Introduce el texto aquí..."
                style={{ fontSize: '16px', marginBottom: '10px' }}
            />
            <br />
            <select
                onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice || null);
                }}
                value={selectedVoice ? selectedVoice.name : ''}
                style={{ marginBottom: '10px', padding: '5px' }}
            >
                {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                        {`${voice.name} (${voice.lang})`}
                    </option>
                ))}
            </select>
            <br />
            <button onClick={handleSpeak} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                Hablar
            </button>
        </div>
    );
};

// -----------------------------------------------------------
// Datos y Componente Principal
// -----------------------------------------------------------
const panelData: PanelData[] = Array.from({ length: 20 }, (_, i) => ({
    id: `panel-${i}`,
    title: `Panel de Control ${i + 1}`,
    content: i == 0
        ? <TextToSpeech></TextToSpeech>
        : `Este panel muestra las funcionalidades del panel de control número ${i + 1}.`
}));

const EmptySamplePage = () => {
    return (
        <div style={{ height: '80%', margin: '20px' }}>
            <h2>Paneles de Control</h2>
            <HorizontalScroller
                items={panelData}
                renderItem={(item, isVisible) => (
                    <PanelView data={item} isVisible={isVisible} />
                )}
            />
        </div>
    );
};

export default EmptySamplePage;