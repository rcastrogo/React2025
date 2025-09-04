
import React, { useState, useEffect, useRef, type ReactNode } from 'react';

/**
 * Módulo de utilidades matemáticas.
 */
const PolCoreMath = {
    /**
     * Limita un valor entre un mínimo y un máximo.
     * @param value El valor a limitar.
     * @param min El valor mínimo permitido.
     * @param max El valor máximo permitido.
     */
    Clamp: (value: number, min: number, max: number): number => Math.max(min, Math.min(value, max)),
    /**
     * Genera un número entero aleatorio.
     * @param max El valor máximo del rango.
     * @param min El valor mínimo del rango (por defecto 0).
     */
    Random: (max: number, min: number = 0): number => Math.floor(Math.random() * (max - min + 1)) + min,
};

/**
 * Módulo de utilidades para el dibujo en Canvas.
 */
const PolCoreDrawing = {
    /**
     * Crea un canvas de buffer fuera de pantalla para el dibujo.
     * @param width El ancho del canvas.
     * @param height La altura del canvas.
     * @param drawCallback Una función de devolución de llamada para dibujar en el contexto del canvas.
     */
    createBuffer: (width: number, height: number, drawCallback?: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx && drawCallback) drawCallback(ctx);
        return canvas;
    },
};

/**
 * Clase para controlar el efecto de fundido (fade).
 */
class FadeController {
    private duration: number;
    private startTime: number | null = null;
    private fadingUp: boolean = false;
    private onCompleteCallback: (() => void) | null = null;
    public value: number = 0;

    constructor(duration: number) {
        this.duration = duration;
    }

    fadeUp(onComplete: () => void) {
        this.startTime = null;
        this.fadingUp = true;
        this.onCompleteCallback = onComplete;
        this.value = 0;
        return this;
    }

    fadeDown(onComplete: () => void) {
        this.startTime = null;
        this.fadingUp = false;
        this.onCompleteCallback = onComplete;
        this.value = 100;
        return this;
    }

    update(dt: number) {
        if (this.startTime === null) this.startTime = Date.now();

        const elapsed = Date.now() - this.startTime;
        let progress = PolCoreMath.Clamp(elapsed / this.duration, 0, 1);

        if (this.fadingUp)
            this.value = progress * 100;
        else
            this.value = (1 - progress) * 100;

        if (progress >= 1 && this.onCompleteCallback) {
            this.onCompleteCallback();
            this.onCompleteCallback = null;
        }
    }
}

// =====================================================================
// TIPOS DE DATOS
// =====================================================================

interface Particle {
    position: [number, number];
    origin: [number, number];
    destination: [number, number];
    velocity: [number, number];
}

interface Metaball {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    size: number;
    gradient?: CanvasGradient;
}

interface CreditsScreenProps {
    onExit?: () => void;
    gameWidth?: number;
    gameHeight?: number;
    particleSize?: number;
    particleDensity?: number;
    metaballCount?: number;
    textScale?: number;
    fadeDurationEnter?: number;
    fadeDurationLeave?: number;
    titleText?: string;
    titleFontFamily?: string;
    showPaticles?: boolean;
}

// =====================================================================
// COMPONENTE FUNCIONAL
// =====================================================================

/**
 * Componente funcional para una pantalla de créditos animada.
 * Utiliza Canvas API y hooks de React para gestionar el estado y la animación.
 */
function CreditsScreen({
    onExit,
    gameWidth = 800,
    gameHeight = 600,
    particleSize = 1,
    particleDensity = 2,
    metaballCount = 20,
    textScale = 200,
    fadeDurationEnter = 2000,
    fadeDurationLeave = 1000,
    titleText = "Credits",
    titleFontFamily = "Arial",
    showPaticles=false,
}: CreditsScreenProps) {
    // Definimos el estado que queremos que active re-renders
    const [gameState, setGameState] = useState<'enter' | 'idle' | 'leave'>('enter');

    // Usamos useRef para referencias a elementos del DOM y variables mutables
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);
    const lastTime = useRef<DOMHighResTimeStamp>(0);
    const time = useRef<number>(0);

    // --- PROPIEDADES PARA LA SIMULACIÓN DE GRAVEDAD ---
    const currentTextY = useRef<number>(0);
    const velocityY = useRef<number>(0);
    const gravity = useRef<number>(980 / 4);
    const launchSpeed = useRef<number>(-500);
    const isLaunched = useRef<boolean>(true);

    // Usamos useRef para las instancias de clases y arrays grandes para evitar re-creaciones
    const fadeController = useRef<FadeController | null>(null);
    const particles = useRef<Particle[]>([]);
    const metaballs = useRef({
        balls: [] as Metaball[],
        context: null as CanvasRenderingContext2D | null,
        init: () => { }, // Inicialización se define en el useEffect
        update: (dt: number) => { },
        flip: (time: number) => { },
    });

    /**
     * Inicializa el juego.
     * @param gameWidth Ancho del juego.
     * @param gameHeight Altura del juego.
     * @param particleDensity Densidad de las partículas.
     * @param textScale Escala del texto.
     * @param titleText Texto a mostrar.
     * @param titleFontFamily Fuente del texto.
     * @param metaballCount Cantidad de metaballs.
     * @param fadeDurationEnter Duración del fade de entrada.
     */
    const initGame = (
        gameWidth: number,
        gameHeight: number,
        particleDensity: number,
        textScale: number,
        titleText: string,
        titleFontFamily: string,
        metaballCount: number,
        fadeDurationEnter: number
    ) => {
        time.current = 0;
        lastTime.current = performance.now();
        createParticles(
            gameWidth,
            gameHeight,
            particleDensity,
            textScale,
            titleText,
            titleFontFamily
        );
        initMetaballs(metaballCount);

        fadeController.current = new FadeController(fadeDurationEnter);
        fadeController.current.fadeUp(() => {
            setGameState('idle');
        });
    };

    /**
     * El bucle principal del juego.
     * @param currentTime El tiempo actual de la animación.
     */
    const gameLoop = (currentTime: DOMHighResTimeStamp) => {
        const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        if(canvasRef.current?.clientHeight == 0){
            animationFrameId.current = requestAnimationFrame(gameLoop);
            return;
       }

        const dt = (currentTime - lastTime.current) / 1000;
        lastTime.current = currentTime;
        time.current += dt;

        // Lógica de simulación de gravedad
        if (isLaunched.current) {
            velocityY.current += gravity.current * dt;
            currentTextY.current += velocityY.current * dt;
            if (currentTextY.current > gameHeight - 350) {
                currentTextY.current = gameHeight - 350;
                velocityY.current = launchSpeed.current;
            }
        }

        switch (gameState) {
            case 'enter':
                fadeController.current?.update(dt);
                updateParticles(dt);
                metaballs.current.update(dt);
                ctx.globalAlpha = (fadeController.current?.value || 0) / 100;
                draw(ctx, currentTextY.current);
                ctx.globalAlpha = 1;
                break;
            case 'idle':
                if (!isLaunched.current) {
                    isLaunched.current = true;
                    velocityY.current = launchSpeed.current;
                    currentTextY.current = gameHeight - 350;
                }
                updateParticles(dt);
                metaballs.current.update(dt);
                draw(ctx, currentTextY.current);
                break;
            case 'leave':
                fadeController.current?.update(dt);
                ctx.globalAlpha = (fadeController.current?.value || 0) / 100;
                draw(ctx, currentTextY.current);
                ctx.globalAlpha = 1;
                break;
        }

        animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    /**
     * Dibuja todos los elementos en el canvas.
     * @param ctx Contexto 2D del canvas.
     * @param textY La posición Y actual del texto.
     */
    const draw = (ctx: CanvasRenderingContext2D, textY: number) => {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
        metaballs.current.flip(time.current);
        if (metaballs.current.context?.canvas) {
            ctx.drawImage(
                metaballs.current.context.canvas,
                0, 0,
                150, 60,
                0, 0,
                gameWidth, gameHeight
            );
        }
        showPaticles && drawParticles(ctx, textY);
    };

    /**
     * Dibuja las partículas de texto.
     * @param ctx Contexto 2D del canvas.
     * @param textY La posición Y actual del texto.
     */
    const drawParticles = (ctx: CanvasRenderingContext2D, textY: number) => {
        const particleRadius = particleSize;
        ctx.save();
        ctx.translate(50, textY);
        ctx.scale(8, 8);
        ctx.fillStyle = 'rgba(255,255,255,.4)';

        particles.current.forEach(p => {
            ctx.globalAlpha = 1 / PolCoreMath.Clamp(p.velocity[0] + p.velocity[1], 0.01, 1);
            ctx.beginPath();
            ctx.arc(p.position[0], p.position[1], particleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        });

        ctx.restore();
    };

    /**
     * Crea las partículas de texto a partir del título.
     * @param gameWidth Ancho del juego.
     * @param gameHeight Altura del juego.
     * @param particleDensity Densidad de las partículas.
     * @param textScale Escala del texto.
     * @param titleText Texto a mostrar.
     * @param titleFontFamily Fuente del texto.
     */
    const createParticles = (
        gameWidth: number,
        gameHeight: number,
        particleDensity: number,
        textScale: number,
        titleText: string,
        titleFontFamily: string
    ) => {
        const fontSize = textScale;
        const fontFamily = titleFontFamily;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true } );
        if (!tempCtx) return;

        tempCtx.font = `${fontSize}px ${fontFamily}`;
        const metrics = tempCtx.measureText(titleText);
        const textWidth = metrics.width;
        const textHeight = fontSize;
        const bufferWidth = Math.ceil(textWidth) + 10;
        const bufferHeight = Math.ceil(textHeight * 3) + 10;

        tempCanvas.width = bufferWidth;
        tempCanvas.height = bufferHeight;
        tempCtx.font = `${fontSize}px ${fontFamily}`;
        tempCtx.fillStyle = 'rgba(0,0,0,0)';
        tempCtx.fillRect(0, 0, bufferWidth, bufferHeight);
        tempCtx.fillStyle = 'rgba(0,0,255,1)';
        tempCtx.textBaseline = 'top';

        const textX = (bufferWidth - textWidth) / 2;
        const textY = (bufferHeight - textHeight) / 2;
        tempCtx.fillText(titleText, textX, textY);
        tempCtx.fillText('A p p ', textX + 17, textY + textHeight - 10);

        const imageData = tempCtx.getImageData(0, 0, bufferWidth, bufferHeight);
        particles.current = [];
        const __half_w = gameWidth >> 1;
        const __half_h = gameHeight >> 1;

        const densityFactor = 1 / particleDensity;

        for (let x = 0; x < imageData.width; x += Math.round(densityFactor)) {
            for (let y = 0; y < imageData.height; y += Math.round(densityFactor)) {
                const pixelIndex = (y * imageData.width + x) * 4;
                const b = imageData.data[pixelIndex + 2];
                const a = imageData.data[pixelIndex + 3];

                if (b !== 0 && a > 0) {
                    const posX = PolCoreMath.Random(gameWidth) - __half_w;
                    const posY = PolCoreMath.Random(gameHeight) - __half_h;
                    particles.current.push({
                        position: [posX, posY],
                        origin: [posX, posY],
                        destination: [x - 11, y - 30],
                        velocity: [0, 0],
                    });
                }
            }
        }
    };

    /**
     * Actualiza la posición y velocidad de las partículas.
     * @param dt Delta time.
     */
    const updateParticles = (dt: number) => {
        const __half_w = gameWidth >> 3;
        const __half_h = gameHeight >> 3;

        for (let i = 0; i < particles.current.length; i++) {
            const particle = particles.current[i];
            particle.velocity[0] = (particle.destination[0] - particle.position[0]) * dt * 1.5;
            particle.velocity[1] = (particle.destination[1] - particle.position[1]) * dt;

            if (Math.abs(particle.velocity[0] + particle.velocity[1]) < 0.0005) {
                if (PolCoreMath.Random(10, 0) > 9) {
                    if (Math.sin(time.current) > 0) {
                        particle.position[0] = PolCoreMath.Random(gameWidth) - __half_w;
                    } else {
                        particle.position[1] = PolCoreMath.Random(gameHeight) - __half_h;
                    }
                }
            } else {
                particle.position[0] += particle.velocity[0];
                particle.position[1] += particle.velocity[1];
            }
        }
    };

    /**
     * Inicializa las metaballs.
     * @param metaballCount Cantidad de metaballs.
     */
    const initMetaballs = (metaballCount: number) => {
        if (!metaballs.current.context) {
            const bufferCanvas = PolCoreDrawing.createBuffer(150, 60);
            metaballs.current.context = bufferCanvas.getContext('2d', { willReadFrequently: true });

        }
        metaballs.current.balls = [];
        for (let x = 0; x < metaballCount; x++) {
            const ball: Metaball = {
                position: { x: PolCoreMath.Random(0, 150), y: PolCoreMath.Random(0, 60) },
                velocity: { x: PolCoreMath.Random(32, -32), y: PolCoreMath.Random(32, -32) },
                size: PolCoreMath.Random(34, 8),
            };
            ball.gradient = metaballs.current.context?.createRadialGradient(0, 0, 3, 0, 0, ball.size);
            if (ball.gradient) {
                ball.gradient.addColorStop(0, 'rgba(0,0,250,1)');
                ball.gradient.addColorStop(1, 'rgba(0,0,155,0)');
            }
            metaballs.current.balls.push(ball);
        }

        // Definir métodos de update y flip para las metaballs
        metaballs.current.update = (dt: number) => {
            metaballs.current.balls.forEach(b => {
                b.position.x += b.velocity.x * dt;
                b.position.y += b.velocity.y * dt;
                if (b.position.x < 0 || b.position.x > 150) {
                    b.velocity.x = -b.velocity.x;
                }
                if (b.position.y < 0 || b.position.y > 60) {
                    b.velocity.y = -b.velocity.y;
                }
            });
        };
        metaballs.current.flip = (t: number) => {
            const __ctx = metaballs.current.context;
            if (!__ctx) return;
            __ctx.clearRect(0, 0, 150, 60);
            metaballs.current.balls.forEach(b => {
                __ctx.beginPath();
                if (b.gradient) {
                    __ctx.fillStyle = b.gradient;
                } else {
                    __ctx.fillStyle = 'blue';
                }
                __ctx.save();
                __ctx.translate(b.position.x, b.position.y);
                __ctx.arc(0, 0, b.size, 0, Math.PI * 2);
                __ctx.fill();
                __ctx.restore();
            });

            const __imageData = __ctx.getImageData(0, 0, 150, 60);
            const __data = __imageData.data;
            for (let i = 0, n = __data.length; i < n; i += 4) {
                if (__data[i + 3] > 90 && __data[i + 3] < 120) {
                    __data[i + 3] = 0;
                } else {
                    __data[i] = ~~(Math.sin(t) * 127 + 128);
                    __data[i + 1] = ~~(Math.sin(t + 2) * 127 + 128);
                    __data[i + 2] = ~~(Math.sin(t + 5) * 127 + 128);
                }
            }
            __ctx.putImageData(__imageData, 0, 0);
        };
    };

    /**
     * Maneja el evento de clic o toque.
     */
    const handleTap = () => {
        setGameState('leave');
        fadeController.current = new FadeController(fadeDurationLeave);
        fadeController.current.fadeDown(() => onExit && onExit());
    };

    // El hook useEffect maneja la inicialización y la limpieza
    useEffect(() => {
        initGame(
            gameWidth,
            gameHeight,
            particleDensity,
            textScale,
            titleText,
            titleFontFamily,
            metaballCount,
            fadeDurationEnter
        );
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [
        gameWidth, gameHeight, particleSize, particleDensity,
        metaballCount, textScale,
        titleText, titleFontFamily
    ]);

    // Renderizado del componente
    return (
        <div
            style={{
                position: 'relative',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onClick={handleTap}
        >
            <canvas
                ref={canvasRef}
                width={gameWidth}
                height={gameHeight}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}

export default CreditsScreen;
