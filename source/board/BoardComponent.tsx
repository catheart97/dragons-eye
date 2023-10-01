import React from "react"

import { Board, BoardCreature, BoardDecoratorType, BoardItem, CanvasCreatureTypeIcons, ConditionCanvasIcons, ConditionColors, CreatureAttitudeColors, CreatureSize, DoorData, IBoardUtility, ItemType, TerrainColors, TrapData } from "./Board"
import { useForceUpdate } from "../utility"

const scale = 1;
export const CanvasBaseSize = 72 * scale;
const LineWidth = 2 * scale;

const drawTerrain = (canvas: HTMLCanvasElement, board: Board, position: { x: number, y: number }) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * board.width + position.x;

    // render terrain
    const terrain = board.terrain[idx]
    ctx.fillStyle = TerrainColors[terrain];
    ctx.fillRect(
        position.x * CanvasBaseSize + LineWidth / 2,
        position.y * CanvasBaseSize + LineWidth / 2,
        CanvasBaseSize - LineWidth,
        CanvasBaseSize - LineWidth
    );
}

const drawCondition = (canvas: HTMLCanvasElement, board: Board, position: { x: number, y: number }) => {
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

const drawDecorator = (canvas: HTMLCanvasElement, board: Board, position: { x: number, y: number }) => {
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
                    modifier = .5;
                }
            }
            dim *= modifier;

            ctx.fillStyle = CreatureAttitudeColors[attachment.attitude];
            ctx.beginPath();
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

            let height = 22 * modifier * scale;
            ctx.font = `${height - 2}px Material Symbols`;
            ctx.fillStyle = '#000000';
            ctx.fillText(
                CanvasCreatureTypeIcons[attachment.type],
                x * CanvasBaseSize + CanvasBaseSize / 2 - dim / 4 - height / 2,
                y * CanvasBaseSize + CanvasBaseSize / 2 + height / 2
            )

            height = 32 * modifier * scale;
            ctx.font = `${height - 2}px Fira Sans`;
            ctx.fillText(
                attachment.name.charAt(0).toUpperCase(),
                x * CanvasBaseSize + CanvasBaseSize / 2 + dim / 4 - height / 2,
                y * CanvasBaseSize + CanvasBaseSize / 2 + height / 2 - height / 8
            )
        } else {
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
                if (data == "locked") {
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
            } else if (attachment.type == ItemType.Trap) {

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
            }
        }
    }
}

const drawHidden = (canvas: HTMLCanvasElement, board: Board, position: { x: number, y: number }) => {
    const ctx = canvas.getContext('2d')!;
    const idx = position.y * board.width + position.x;

    // render hidden
    if (board.hidden && board.hidden[idx]) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(
            position.x * CanvasBaseSize + LineWidth / 2,
            position.y * CanvasBaseSize + LineWidth / 2,
            CanvasBaseSize - LineWidth,
            CanvasBaseSize - LineWidth
        );
    }
}

const drawBoard = (canvas: HTMLCanvasElement, board: Board) => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < board.height; i++) {
        for (let j = 0; j < board.width; j++) {
            drawTerrain(canvas, board, { x: j, y: i });
        }
    }
    for (let i = 0; i < board.height; i++) {
        for (let j = 0; j < board.width; j++) {
            drawCondition(canvas, board, { x: j, y: i });
        }
    }
    for (let i = 0; i < board.height; i++) {
        for (let j = 0; j < board.width; j++) {
            drawDecorator(canvas, board, { x: j, y: i });
        }
    }
    for (let i = 0; i < board.height; i++) {
        for (let j = 0; j < board.width; j++) {
            drawHidden(canvas, board, { x: j, y: i });
        }
    }

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
    utility?: IBoardUtility
}

export type BoardComponentHandle = {
    update: () => void
}

const BoardComponentRenderer: React.ForwardRefRenderFunction<BoardComponentHandle, BoardComponentProps> = (props, e) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const renderUI = useForceUpdate();

    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
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
            canvasRef.current!.width = props.board.width * CanvasBaseSize;
            canvasRef.current!.height = props.board.height * CanvasBaseSize;
            drawBoard(canvasRef.current!, props.board);
        }
    }));

    const [zoom, setZoom] = React.useState<number>(.2);

    return (
        <div
            ref={rootRef}
            className='overflow-scroll select-none h-[inherit] w-[inherit] min-h-[inherit] min-w-[inherit] max-h-[inherit] max-w-[inherit] bg-neutral-400'
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
                <div className="p-72">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BoardComponent = React.forwardRef(BoardComponentRenderer);