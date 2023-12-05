import React from "react";

import { Rect } from "../Rect";
import { Board, IBoardUtility } from "../data/Board";
import { TexturePool } from "../data/TexturePool";
import { useForceUpdate } from "../utility";
import { PlayerViewSettings } from "./view/IAppView";

import { CanvasBaseSize } from "./BoardConstants";
import BoardWorker from "./BoardWorker.ts?worker&inline";


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

    const worker = React.useRef<Worker | null>(null);
    const initialized = React.useRef<boolean>(false);

    const draw = () => {
        if (canvasRef.current) {
            worker.current!.postMessage({
                type: "draw",
                board: props.board,
                width: props.board.width,
                height: props.board.height,
            });
        }
    }

    const rectRef = React.useRef<HTMLDivElement>(null);
    const offscreenRef = React.useRef<OffscreenCanvas | null>(null);

    React.useEffect(() => {

        if (initialized.current) return;
        initialized.current = true;

        // setup worker
        worker.current = new BoardWorker();
        worker.current.onmessage = (e) => {
            console.log(e.data);
        }

        // send init with offcanvas context
        offscreenRef.current = canvasRef.current!.transferControlToOffscreen();
        worker.current.postMessage({
            type: "init",
            offscreen: offscreenRef.current,
            playerView: props.playerView ?? false,
            board: props.board,
            width: props.board.width,
            height: props.board.height,
        }, [offscreenRef.current]);

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

            const importanceCanvas: Rect = {
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