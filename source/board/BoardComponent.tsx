import React from "react"

import "../index.css"
import { Board, BoardCreature, BoardDecoratorType, BoardItem, BoardTerrain, CanvasCreatureTypeIcons, ConditionCanvasIcons, ConditionColors, CreatureAttitudeColors, CreatureSize, DoorData, IBoardUtility, ItemType, TerrainColors, TrapData } from "./Board"
import { useForceUpdate } from "../utility"
import { Rect } from "../Rect";
import { TexturePool } from "./TexturePool";

const scale = 1;
export const CanvasBaseSize = 72 * scale;
const LineWidth = 2 * scale;

type BoardCallback = (canvas: HTMLCanvasElement, board: Board, position: { x: number, y: number }, playerView: boolean) => void;

const drawTerrain: BoardCallback = (canvas, board, position, _playerView) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * board.width + position.x;

    // render terrain
    const terrain = board.terrain[idx]
    if (terrain == BoardTerrain.Wall) {
        ctx.fillStyle = TerrainColors[terrain];
        ctx.fillRect(
            position.x * CanvasBaseSize + LineWidth / 2,
            position.y * CanvasBaseSize + LineWidth / 2,
            CanvasBaseSize - LineWidth,
            CanvasBaseSize - LineWidth
        );
    } else {
        const texturePool = TexturePool.getInstance().get();
        if (!texturePool) {
            return;
        }
        ctx.drawImage(
            texturePool!.TerrainTextures[terrain],
            position.x * CanvasBaseSize + LineWidth / 2,
            position.y * CanvasBaseSize + LineWidth / 2,
            CanvasBaseSize - LineWidth,
            CanvasBaseSize - LineWidth
        );
    }
}

const drawCondition: BoardCallback = (canvas, board, position, _playerView) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * board.width + position.x;

    // render condition
    const condition = board.conditions[idx];
    if (condition) {
        const height = 32;
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.arc(
            position.x * CanvasBaseSize + LineWidth + height / 2,
            position.y * CanvasBaseSize + LineWidth + height / 2,
            height / 2,
            0,
            2 * Math.PI
        )
        ctx.fill();
        ctx.stroke();
        ctx.font = `${height - 2}px Material Symbols`;
        ctx.fillStyle = ConditionColors[condition];
        ctx.fillText(
            ConditionCanvasIcons[condition],
            position.x * CanvasBaseSize + LineWidth + 1,
            position.y * CanvasBaseSize + LineWidth + 1 + height - 2
        );
    }
}

const drawDecorator: BoardCallback = (canvas, board, position, playerView) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * board.width + position.x;

    // render decorator 
    const decorator = board.decorators[idx];
    if (decorator) {
        if (decorator.type == BoardDecoratorType.Creature) {

            const attachment = decorator.attachment as BoardCreature;
            let x = position.x;
            let y = position.y;
            let modifier = 1;
            let dim = CanvasBaseSize;

            if (attachment.size != CreatureSize.MediumSmall) {
                if (attachment.size == CreatureSize.Large) {
                    modifier = 3;
                } else if (attachment.size == CreatureSize.Huge) {
                    modifier = 5;
                } else if (attachment.size == CreatureSize.Gargantuan) {
                    modifier = 7;
                } else if (attachment.size == CreatureSize.Tiny) {
                    modifier = .8;
                }
            }
            dim *= modifier;

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

            // ctx.beginPath();
            // ctx.lineWidth = modifier * LineWidth * 2;
            // ctx.strokeStyle = '#FF0000';
            // const healthAngle = attachment.hitpoints != undefined && attachment.maxHitpoints != undefined ? 2 * Math.PI * (attachment.hitpoints / attachment.maxHitpoints) : 2 * Math.PI;
            // console.log(healthAngle)
            // ctx.arc(
            //     x * CanvasBaseSize + CanvasBaseSize / 2,
            //     y * CanvasBaseSize + CanvasBaseSize / 2,
            //     (dim / 2 - LineWidth * 2),
            //     0,
            //     healthAngle
            // )
            // ctx.stroke();

            ctx.lineWidth = LineWidth;
            ctx.strokeStyle = '#000000';

            let height = 60 * modifier * scale;
            ctx.font = `${height - 2}px Material Symbols`;

            const color = CreatureAttitudeColors[attachment.attitude];
            const darkenedColor = color.replace(/([0-9a-f]{2})/g, (_match, p1) => {
                return Math.floor((parseInt(p1, 16) * .5)).toString(16).padStart(2, '0');
            });

            ctx.fillStyle = darkenedColor;
            ctx.textAlign = 'center';
            ctx.fillText( 
                CanvasCreatureTypeIcons[attachment.type],
                x * CanvasBaseSize + CanvasBaseSize / 2,
                y * CanvasBaseSize + CanvasBaseSize / 2 + height / 2 - height / 16,
            )

            ctx.fillStyle = '#DDDDDD';
            height = 28 * modifier * scale;
            ctx.font = `${height - 2}px Fira Sans`;
            ctx.fillText(
                attachment.name.charAt(0).toUpperCase() + attachment.name.charAt(1).toLowerCase(),
                x * CanvasBaseSize + CanvasBaseSize / 2,
                y * CanvasBaseSize + CanvasBaseSize / 2 + height / 2 - height / 8
            )
        } else {
            ctx.textAlign = 'left';
            const attachment = decorator.attachment as BoardItem;
            if (attachment.type == ItemType.Door) {
                const data = attachment.data as DoorData;
                ctx.lineWidth = LineWidth;
                ctx.fillStyle = "#000000";
                ctx.fillRect(
                    position.x * CanvasBaseSize + LineWidth / 2,
                    position.y * CanvasBaseSize + LineWidth / 2,
                    CanvasBaseSize - LineWidth,
                    CanvasBaseSize - LineWidth
                );

                ctx.font = `${CanvasBaseSize - LineWidth * 2}px Material Symbols`;
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#ffffff";
                if (playerView || data == "locked") {
                    ctx.fillText(
                        "door_front",
                        position.x * CanvasBaseSize + LineWidth,
                        position.y * CanvasBaseSize + CanvasBaseSize - LineWidth
                    )
                } else {
                    ctx.fillText(
                        "door_open",
                        position.x * CanvasBaseSize + LineWidth,
                        position.y * CanvasBaseSize + CanvasBaseSize - LineWidth
                    )
                }
            } else if (!playerView && attachment.type == ItemType.Trap) {

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
            } else if (!playerView && attachment.type == ItemType.Note) {
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

            }
        }
    }
}

const drawHidden: BoardCallback = (canvas, board, position, playerView) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * board.width + position.x;

    // render hidden
    if (board.hidden && board.hidden[idx]) {
        ctx.fillStyle = '#000000';
        if (!playerView) {
            ctx.globalAlpha = .5;
        }
        ctx.fillRect(
            position.x * CanvasBaseSize + LineWidth / 2,
            position.y * CanvasBaseSize + LineWidth / 2,
            CanvasBaseSize - LineWidth,
            CanvasBaseSize - LineWidth
        );
        ctx.globalAlpha = 1;
    }
}

const drawBoard = (canvas: HTMLCanvasElement, board: Board, playerView: boolean) => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);

    // draw helper
    const forEachTile = (callback: BoardCallback) => {
        for (let i = 0; i < board.height; i++) {
            for (let j = 0; j < board.width; j++) {
                callback(canvas, board, { x: j, y: i }, playerView);
            }
        }
    }
    

    // draw scene
    forEachTile(drawTerrain);
    if (playerView) {
        forEachTile(drawDecorator);
        forEachTile(drawCondition);
    } else {
        forEachTile(drawCondition);
        forEachTile(drawDecorator);
    }
    forEachTile(drawHidden);

    // draw grid
    ctx.lineWidth = LineWidth;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    for (let i = 0; i <= board.height; i++) {
        ctx.moveTo(0, i * CanvasBaseSize);
        ctx.lineTo(width, i * CanvasBaseSize);
    }
    for (let i = 0; i <= board.width; i++) {
        ctx.moveTo(i * CanvasBaseSize, 0);
        ctx.lineTo(i * CanvasBaseSize, height);
    }
    ctx.stroke();
}

export type BoardComponentProps = {
    board: Board,
    playerView?: boolean,
    utility?: IBoardUtility,
    importanceRect: Rect | null
    setImportanceRect?: (rect: Rect | null) => void
}

export type BoardComponentHandle = {
    update: () => void
}

const BoardComponentRenderer: React.ForwardRefRenderFunction<BoardComponentHandle, BoardComponentProps> = (props, e) => {

    const renderUI = useForceUpdate();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const draw = () => {
        if (canvasRef.current) {
            canvasRef.current!.width = props.board.width * CanvasBaseSize;
            canvasRef.current!.height = props.board.height * CanvasBaseSize;
            drawBoard(canvasRef.current!, props.board, props.playerView ?? false);
        }
    }

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

    const [zoom, setZoom] = React.useState<number>(.2);

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
            <div className="min-h-full flex items-center" style={{
                justifyContent: 'safe center'
            }}>
                <div className="p-72 flex flex-col">
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
                                }}
                                className="bg-white"
                            ></canvas>
                            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                                {
                                    props.utility && props.utility.customComponent ? (
                                        props.utility.customComponent()
                                    ) : (
                                        <></>
                                    )
                                }
                                {
                                    <div
                                        className="pointer-events-none absolute border-4 border-orange-600"
                                        style={{
                                            left: props.importanceRect ? (props.importanceRect.x * CanvasBaseSize + 'px') : "0px",
                                            top: props.importanceRect ? (props.importanceRect.y * CanvasBaseSize + 'px') : "0px",
                                            width: props.importanceRect ? (props.importanceRect.width * CanvasBaseSize + 'px') : (props.board.width * CanvasBaseSize + 'px'),
                                            height: props.importanceRect ? props.importanceRect.height * CanvasBaseSize + 'px' : (props.board.height * CanvasBaseSize + 'px'),
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