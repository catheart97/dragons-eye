import React from "react";

import { Rect } from "../Rect";
import { Board, BoardCreature, BoardDecoratorType, BoardItem, BoardItemType, BoardLayer, BoardMarkerType, BoardTerrain, CreatureAttitudeColors, DoorData, IBoardUtility, TrapData } from "../data/Board";
import { CreatureSize } from "../data/Statblock";
import { TexturePool } from "../data/TexturePool";
import { useForceUpdate } from "../utility";
import { PlayerViewSettings } from "./view/IAppView";

import Prando from "prando";

const scale = 1;
export const CanvasBaseSize = 72 * scale;
const LineWidth = 2 * scale;

class ImageLoader {
    image: HTMLImageElement;
    loaded: boolean;

    constructor(private path: string) {
        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        }
        this.image.src = this.path;
    }

    getIf() {
        return this.loaded ? this.image : undefined;
    }
}

type BoardCallback = (canvas: HTMLCanvasElement, w : number, h :number, board: BoardLayer, position: { x: number, y: number }, playerView: boolean, rng: Prando, images: {[key: string] : ImageLoader}) => void;

const drawTerrain: BoardCallback = (canvas, w, _h, boardLayer, position, _playerView, rng, _images) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * w + position.x;

    // render terrain
    const terrain = boardLayer.terrain[idx]

    if (terrain == BoardTerrain.Air) return;

    const texturePool = TexturePool.getInstance().get();
    if (!texturePool) {
        return;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        rng.next() > 0.95 ?
            texturePool.AltTerrainTextures[terrain] :
            texturePool.TerrainTextures[terrain],
        position.x * CanvasBaseSize + LineWidth / 2,
        position.y * CanvasBaseSize + LineWidth / 2,
        CanvasBaseSize - LineWidth,
        CanvasBaseSize - LineWidth
    );
    ctx.imageSmoothingEnabled = false;

}

const drawDecorator: BoardCallback = (canvas, w, _h, board, position, playerView, _rng, images) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * w + position.x;

    // render decorator 
    const decorator = board.decorators[idx];
    if (decorator) {
        if (decorator.type == BoardDecoratorType.Creature) {

            const attachment = decorator.attachment as BoardCreature;
            let x = position.x;
            let y = position.y;
            let modifier = 1;
            let dim = CanvasBaseSize;

            if (attachment.statblock.size != CreatureSize.Medium && attachment.statblock.size != CreatureSize.Small) {
                if (attachment.statblock.size == CreatureSize.Large) {
                    modifier = 3;
                } else if (attachment.statblock.size == CreatureSize.Huge) {
                    modifier = 5;
                } else if (attachment.statblock.size == CreatureSize.Gargantuan) {
                    modifier = 7;
                } else if (attachment.statblock.size == CreatureSize.Tiny) {
                    modifier = .8;
                }
            }
            dim *= modifier;

            let image: HTMLImageElement | undefined = undefined;
            console.log(attachment.statblock)
            if (attachment.statblock.image != "") {
                if (!images[attachment.statblock.image]) {
                    images[attachment.statblock.image] = new ImageLoader(attachment.statblock.image);
                }
                image = images[attachment.statblock.image].getIf();
            }

            if (image) {
                ctx.save();

                ctx.beginPath();
                ctx.arc(
                    x * CanvasBaseSize + CanvasBaseSize / 2,
                    y * CanvasBaseSize + CanvasBaseSize / 2,
                    (dim / 2 - LineWidth * 2),
                    0,
                    2 * Math.PI
                )
                ctx.clip();

                ctx.drawImage(
                    image,
                    x * CanvasBaseSize + CanvasBaseSize / 2 - dim / 2,
                    y * CanvasBaseSize + CanvasBaseSize / 2 - dim / 2,
                    dim - LineWidth * 2,
                    dim - LineWidth * 2
                )

                // draw CreatureAttitudeColors[attachment.attitude] colored rect with op 0.4 to lower third of circle
                ctx.fillStyle = CreatureAttitudeColors[attachment.attitude];
                ctx.globalAlpha = 0.4;
                ctx.fillRect(
                    x * CanvasBaseSize + LineWidth,
                    y * CanvasBaseSize + dim / 2,
                    dim - LineWidth * 2,
                    dim / 2 - LineWidth
                )

                ctx.restore();
                ctx.globalAlpha = 0.2;
            }

            ctx.fillStyle = CreatureAttitudeColors[attachment.attitude];
            ctx.beginPath();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = LineWidth;
            ctx.arc(
                x * CanvasBaseSize + CanvasBaseSize / 2,
                y * CanvasBaseSize + CanvasBaseSize / 2,
                (dim / 2 - LineWidth * 2),
                0,
                2 * Math.PI
            )
            ctx.fill();
            ctx.stroke();

            if (image) {
                ctx.globalAlpha = 1;
            }


            ctx.lineWidth = LineWidth;
            ctx.strokeStyle = '#000000';

            let height = 55 * modifier * scale;
            ctx.font = `${height - 2}px Material Symbols`;

            const color = CreatureAttitudeColors[attachment.attitude];
            const darkenedColor = color.replace(/([0-9a-f]{2})/g, (_match, p1) => {
                return Math.floor((parseInt(p1, 16) * .8)).toString(16).padStart(2, '0');
            });

            ctx.fillStyle = darkenedColor;
            ctx.textAlign = 'center';

            if (!image) {
                ctx.fillText(
                    "hub",
                    x * CanvasBaseSize + CanvasBaseSize / 2 + 1,
                    y * CanvasBaseSize + CanvasBaseSize / 2 + height / 2 - 1,
                )
            }

            ctx.fillStyle = '#FFFFFF';
            if (!image) {
                height = 32 * modifier * scale;
                ctx.font = `${height - 2}px Fira Sans`;
                ctx.fillText(
                    attachment.statblock.name.charAt(0).toUpperCase() + attachment.statblock.name.charAt(1).toLowerCase(),
                    x * CanvasBaseSize + CanvasBaseSize / 2,
                    y * CanvasBaseSize + CanvasBaseSize / 2
                )
            }

            
            height = 20 * modifier * scale;
            ctx.font = `${height - 2}px Fira Sans`;
            ctx.fillText(
                "~" + decorator.key.toString() + "~",
                x * CanvasBaseSize + CanvasBaseSize / 2,
                y * CanvasBaseSize + CanvasBaseSize / 2 +  height
            )
        } else {
            ctx.textAlign = 'left';
            const attachment = decorator.attachment as BoardItem;
            if (attachment.type == BoardItemType.Door) {
                const data = attachment.data as DoorData;
                ctx.lineWidth = LineWidth;
                ctx.font = `${CanvasBaseSize - LineWidth * 2}px Material Symbols`;
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#ffffff";
                if (playerView || data == "locked") {
                    ctx.drawImage(
                        TexturePool.getInstance().get()!.DoorTextures.closed,
                        position.x * CanvasBaseSize + LineWidth,
                        position.y * CanvasBaseSize + LineWidth,
                        CanvasBaseSize - LineWidth * 2,
                        CanvasBaseSize - LineWidth * 2
                    )
                } else {
                    ctx.drawImage(
                        TexturePool.getInstance().get()!.DoorTextures.open,
                        position.x * CanvasBaseSize + LineWidth,
                        position.y * CanvasBaseSize + LineWidth,
                        CanvasBaseSize - LineWidth * 2,
                        CanvasBaseSize - LineWidth * 2
                    )
                }
            } else if (!playerView && attachment.type == BoardItemType.Trap) {

                const data = attachment.data as TrapData;
                const armed = data.armed;

                ctx.font = `${CanvasBaseSize - LineWidth * 4}px Material Symbols`;
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = LineWidth;
                if (armed) {
                    ctx.fillText(
                        "crisis_alert",
                        position.x * CanvasBaseSize + LineWidth * 2,
                        position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                    )
                    ctx.strokeText(
                        "crisis_alert",
                        position.x * CanvasBaseSize + LineWidth * 2,
                        position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                    )
                } else {
                    ctx.fillText(
                        "circle",
                        position.x * CanvasBaseSize + LineWidth * 2,
                        position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                    )
                    ctx.strokeText(
                        "circle",
                        position.x * CanvasBaseSize + LineWidth * 2,
                        position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                    )
                }
            } else if (!playerView && attachment.type == BoardItemType.Note) {
                ctx.font = `${CanvasBaseSize - LineWidth * 4}px Material Symbols`;
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = LineWidth;

                ctx.fillText(
                    "note",
                    position.x * CanvasBaseSize + LineWidth * 2,
                    position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                )
                ctx.strokeText(
                    "note",
                    position.x * CanvasBaseSize + LineWidth * 2,
                    position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                )
            } else {
                ctx.font = `${CanvasBaseSize - LineWidth * 4}px Material Symbols`;
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = LineWidth;

                ctx.fillText(
                    "backpack",
                    position.x * CanvasBaseSize + LineWidth * 2,
                    position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                )
                ctx.strokeText(
                    "backpack",
                    position.x * CanvasBaseSize + LineWidth * 2,
                    position.y * CanvasBaseSize + CanvasBaseSize - LineWidth * 2
                )
            }
        }
    }
}

const drawHidden: BoardCallback = (canvas, w, _h, board, position, playerView, _rng, _images) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * w + position.x;

    // render hidden
    if (board.hidden && board.hidden[idx]) {
        ctx.fillStyle = '#000000';
        if (!playerView) {
            ctx.globalAlpha = .5;
        }
        ctx.save();

        const pool = TexturePool.getInstance().get()!

        let texture: HTMLImageElement = pool.FogTextures.center;
        let angle = 0;

        ctx.translate(
            position.x * CanvasBaseSize + CanvasBaseSize / 2,
            position.y * CanvasBaseSize + CanvasBaseSize / 2
        );
        ctx.rotate(angle);

        ctx.drawImage(
            texture,
            -CanvasBaseSize / 2 + LineWidth,
            -CanvasBaseSize / 2 + LineWidth,
            CanvasBaseSize - LineWidth * 2,
            CanvasBaseSize - LineWidth * 2
        )
        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

const drawMarkers = (canvas: HTMLCanvasElement, _w: number, _h: number, board: BoardLayer, _playerView: boolean, _rng : Prando) => {

    const markers = board.markers;
    if (!markers) return;

    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    for (const marker of markers) {
        if (marker.type == BoardMarkerType.Square) {
            ctx.fillStyle = marker.color;
            ctx.globalAlpha = .8;
            ctx.fillRect(
                marker.position.x * CanvasBaseSize + LineWidth / 2,
                marker.position.y * CanvasBaseSize + LineWidth / 2,
                marker.width * CanvasBaseSize - LineWidth,
                marker.height * CanvasBaseSize - LineWidth
            );
            ctx.globalAlpha = 1;
        } else if (marker.type == BoardMarkerType.Circle) {
            ctx.fillStyle = marker.color;
            ctx.globalAlpha = .8;
            ctx.beginPath();

            const centerX = marker.position.x + marker.width / 2;
            const centerY = marker.position.y + marker.height / 2;

            ctx.ellipse(
                centerX * CanvasBaseSize,
                centerY * CanvasBaseSize,
                marker.width * CanvasBaseSize / 2 - LineWidth,
                marker.height * CanvasBaseSize / 2 - LineWidth,
                0,
                0,
                2 * Math.PI
            )
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

}

const drawStamps = (canvas: HTMLCanvasElement, board: BoardLayer, _playerView: boolean, _rng : Prando) => {
    if (!board.stamps) return;

    for (const stamp of board.stamps) {
        const ctx = canvas.getContext('2d')!;
        const texturePool = TexturePool.getInstance().get();
        if (!texturePool) {
            return;
        }
        ctx.imageSmoothingEnabled = false;

        ctx.save();

        // rotate
        ctx.translate(
            stamp.position.x + stamp.width / 2,
            stamp.position.y + stamp.height / 2
        );
        ctx.rotate((stamp.rotation ?? 0) * Math.PI / 180);

        ctx.drawImage(
            texturePool.StampTextures[stamp.image],
            -stamp.width / 2,
            -stamp.height / 2,
            stamp.width,
            stamp.height
        );

        ctx.restore();
        ctx.imageSmoothingEnabled = false;
    }
}

const drawGrid = (canvas: HTMLCanvasElement, board: Board, w: number, h: number) => {

    const ctx = canvas.getContext('2d')!;

    // draw grid
    ctx.lineWidth = LineWidth;
    ctx.strokeStyle = '#888888';
    ctx.beginPath();
    for (let i = 0; i <= board.height; i++) {
        ctx.moveTo(0, i * CanvasBaseSize);
        ctx.lineTo(w, i * CanvasBaseSize);
    }
    for (let i = 0; i <= board.width; i++) {
        ctx.moveTo(i * CanvasBaseSize, 0);
        ctx.lineTo(i * CanvasBaseSize, h);
    }
    ctx.stroke();
}

const drawBoard = (canvas: HTMLCanvasElement, board: Board, playerView: boolean, images: {[key: string] : ImageLoader}) => {

    // set random seed to 42 
    const rng = new Prando(42);
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);

    // draw helper
    const forEachTile = (callback: BoardCallback, layer : BoardLayer) => {
        for (let i = 0; i < board.height; i++) {
            for (let j = 0; j < board.width; j++) {
                callback(canvas, board.width, board.height, layer, { x: j, y: i }, playerView, rng, images);
            }
        }
    }

    // draw scene
    for (let i = 0; i <= board.activeLayer; i++) {
        const layer = board.layers[i];

        forEachTile(drawTerrain, layer);
        drawGrid(canvas, board, width, height);
        drawMarkers(canvas, board.width, board.height, layer, playerView, rng);
        drawStamps(canvas, layer, playerView, rng);
        forEachTile(drawDecorator, layer);
        forEachTile(drawHidden, layer);

        // draw black overlay
        if (i != board.activeLayer) {
            ctx.fillStyle = '#000000';
            ctx.globalAlpha = .5;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
        }
    }
}

export type BoardComponentProps = {
    board: Board,
    playerView?: boolean,
    utility?: IBoardUtility,
    playerSettings: React.MutableRefObject<PlayerViewSettings>
    children?: React.ReactNode
    update?: () => void
}

export type BoardComponentHandle = {
    update: () => void
}

const BoardComponentRenderer: React.ForwardRefRenderFunction<BoardComponentHandle, BoardComponentProps> = (props, e) => {

    const renderUI = useForceUpdate();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const images = React.useRef<{
        [key: string]: ImageLoader
    }>({});

    const draw = () => {
        if (canvasRef.current) {
            canvasRef.current!.width = props.board.width * CanvasBaseSize;
            canvasRef.current!.height = props.board.height * CanvasBaseSize;
            drawBoard(canvasRef.current!, props.board, props.playerView ?? false, images.current);
        }
    }

    const rectRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        TexturePool.getInstance().constructTexturePool().then(() => {
            draw();
        });
        if (rootRef.current) {
            // scroll to center
            const viewportRect = rootRef.current.getBoundingClientRect();
            rootRef.current.scrollTo({
                top: (rootRef.current.scrollHeight - viewportRect.height) / 2,
                left: (rootRef.current.scrollWidth - viewportRect.width) / 2,
                behavior: 'smooth'
            })
        }
    }, [])

    React.useImperativeHandle(e, () => ({
        update: () => {
            if (TexturePool.getInstance().get()) {
                draw();
            }
        }
    }));

    React.useEffect(() => {
        
        // adjust zoom and scroll positions to importanceRect
        if (props.playerView && canvasRef.current && props.playerSettings.current.importanceRect) {
            console.log("called");
            const rect = props.playerSettings.current.importanceRect;

            const importanceCanvas : Rect = {
                x: rect.x * CanvasBaseSize,
                y: rect.y * CanvasBaseSize,
                width: rect.width * CanvasBaseSize,
                height: rect.height * CanvasBaseSize
            }

            const viewportWidth = canvasRef.current.clientWidth;
            const viewportHeight = canvasRef.current.clientHeight;

            
            let z = Math.max(viewportWidth / importanceCanvas.width, viewportHeight / importanceCanvas.height);
            z = Math.min(Math.max(z / 3, .2), 2);
            console.log(z);
            setZoom(z);
            
            props.update?.call(props);
            
            console.log(viewportWidth, viewportHeight);
        }
    }, [props.playerSettings.current.importanceRect])

    const [zoom, setZoom] = React.useState<number>(1);

    React.useEffect(() => {
        rectRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }, [zoom])

    return (
        <div
            ref={rootRef}
            className='overflow-scroll select-none h-[inherit] w-[inherit] min-h-[inherit] min-w-[inherit] max-h-[inherit] max-w-[inherit] bg-black'
            style={{
                zoom: zoom
            }}
            onWheel={(e) => {
                if (e.ctrlKey) {
                    setZoom(Math.min(Math.max(zoom - e.deltaY / 1000, 0.01), 1));
                }
            }}
        >
            {props.children}

            <div className="min-h-full flex items-center" style={{
                justifyContent: 'safe center'
            }}>
                <div
                    className="flex flex-col"
                    style={{
                        padding: "40rem"
                    }}
                >
                    <div className="sticky bg-black/80 text-white text-2xl w-full self-end" style={{
                        zIndex: 50,
                        height: CanvasBaseSize + 'px',
                        width: props.board.width * CanvasBaseSize + 'px',
                        top: 0,
                        bottom: 0
                    }}>
                        {
                            new Array<number>(props.board.width).fill(0).map((_, i) => {
                                let text = ""
                                while (i >= 26) {
                                    text += String.fromCharCode(97 + (i % 26));
                                    i = Math.floor(i / 26) - 1;
                                }
                                text += String.fromCharCode(97 + i);
                                return (
                                    <div
                                        style={{
                                            width: CanvasBaseSize + 'px',
                                            height: CanvasBaseSize + 'px',
                                        }}
                                        key={i}
                                        className="inline-flex justify-center items-center"
                                    >
                                        {text}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex">
                        <div className="sticky bg-black/80 text-white text-2xl" style={{
                            zIndex: 50,
                            height: props.board.height * CanvasBaseSize + 'px',
                            width: CanvasBaseSize + 'px',
                            left: 0,
                            right: 0
                        }}>
                            {
                                new Array<number>(props.board.height).fill(0).map((_, i) => {
                                    return (
                                        <div
                                            style={{
                                                width: CanvasBaseSize + 'px',
                                                height: CanvasBaseSize + 'px',
                                            }}
                                            key={i}
                                            className="inline-flex justify-center items-center"
                                        >
                                            {i}
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="relative">
                            <canvas
                                style={{
                                    width: props.board.width * CanvasBaseSize,
                                    height: props.board.height * CanvasBaseSize,
                                }}
                                ref={canvasRef}
                                onMouseDown={(e) => {
                                    renderUI();
                                    let x = (e.clientX - (canvasRef.current!.getBoundingClientRect().left * zoom));
                                    let y = (e.clientY - (canvasRef.current!.getBoundingClientRect().top * zoom));
                                    x = Math.max(Math.min(Math.ceil(x / (CanvasBaseSize * zoom)), props.board.width), 0);
                                    y = Math.max(Math.min(Math.ceil(y / (CanvasBaseSize * zoom)), props.board.height), 0);
                                    if (props.utility && props.utility.onShapeClick) {
                                        props.utility.onShapeClick({ x: x - 1, y: y - 1 })
                                        console.log({ x, y })
                                        renderUI();
                                    }
                                    if (props.utility && props.utility.onMouseDown) {
                                        props.utility.onMouseDown(e);
                                    }
                                }}
                                onMouseUp={(e) => {
                                    let x = (e.clientX - (canvasRef.current!.getBoundingClientRect().left * zoom));
                                    let y = (e.clientY - (canvasRef.current!.getBoundingClientRect().top * zoom));
                                    x = Math.max(Math.min(Math.ceil(x / (CanvasBaseSize * zoom)), props.board.width), 0);
                                    y = Math.max(Math.min(Math.ceil(y / (CanvasBaseSize * zoom)), props.board.height), 0);
                                    if (props.utility && props.utility.onShapeRelease) {
                                        props.utility.onShapeRelease({ x: x - 1, y: y - 1 })
                                        renderUI();
                                    }
                                    if (props.utility && props.utility.onMouseUp) {
                                        props.utility.onMouseUp(e);
                                    }
                                }}
                                onMouseMove={(e) => {
                                    let x = (e.clientX - (canvasRef.current!.getBoundingClientRect().left * zoom));
                                    let y = (e.clientY - (canvasRef.current!.getBoundingClientRect().top * zoom));
                                    x = Math.max(Math.min(Math.ceil(x / (CanvasBaseSize * zoom)), props.board.width), 0);
                                    y = Math.max(Math.min(Math.ceil(y / (CanvasBaseSize * zoom)), props.board.height), 0);
                                    if (props.utility && props.utility.onShapeHover) {
                                        props.utility.onShapeHover({ x: x - 1, y: y - 1 })
                                        renderUI();
                                    }
                                    if (props.utility && props.utility.onMouseMove) {
                                        props.utility.onMouseMove(e);
                                    }
                                }}
                                className="bg-white"
                            ></canvas>
                            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                                {
                                    props.utility && props.utility.customComponent ? (
                                        props.utility.customComponent(zoom)
                                    ) : (
                                        <></>
                                    )
                                }
                                {
                                    <div
                                        ref={rectRef}
                                        className="pointer-events-none absolute border-4 border-orange-600"
                                        style={{
                                            left: props.playerSettings.current.importanceRect ? (props.playerSettings.current.importanceRect.x * CanvasBaseSize + 'px') : "0px",
                                            top: props.playerSettings.current.importanceRect ? (props.playerSettings.current.importanceRect.y * CanvasBaseSize + 'px') : "0px",
                                            width: props.playerSettings.current.importanceRect ? (props.playerSettings.current.importanceRect.width * CanvasBaseSize + 'px') : (props.board.width * CanvasBaseSize + 'px'),
                                            height: props.playerSettings.current.importanceRect ? props.playerSettings.current.importanceRect.height * CanvasBaseSize + 'px' : (props.board.height * CanvasBaseSize + 'px'),
                                        }}
                                    ></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BoardComponent = React.forwardRef(BoardComponentRenderer);