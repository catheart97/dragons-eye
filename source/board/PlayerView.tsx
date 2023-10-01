import React from "react";
import { WindowComponent, WindowComponentHandle } from "../ui/WindowComponent";
import { Board } from "./Board";
import { BoardComponent, BoardComponentHandle } from "./BoardComponent";
import { Rect } from "../Rect";

export type PlayerViewProps = {
    board: React.MutableRefObject<Board>;
    update: () => void;
    importanceRect: Rect | null;
}

export type PlayerViewHandle = {
    open: () => void;
    close: () => void;
    update: () => void;
}

const PlayerViewRenderer : React.ForwardRefRenderFunction<PlayerViewHandle, PlayerViewProps> = (props, ref) => {

    const boardComponentRef = React.useRef<BoardComponentHandle>(null);

    const handle : PlayerViewHandle = {
        update: () => {
            boardComponentRef.current?.update();
        },
        open() {
            windowComponent.current?.open();
            boardComponentRef.current?.update();
        },
        close() {
            windowComponent.current?.close();
        }
    }
    const windowComponent = React.useRef<WindowComponentHandle>(null);

    React.useImperativeHandle(ref, () => handle);

    return (
        <WindowComponent
            title="Player View - Dragon's Eye"
            ref={windowComponent}
        >
            <div className="text-2xl bg-green-500 h-screen w-screen flex items-center justify-center font-sans relative">
                <BoardComponent 
                    ref={boardComponentRef}
                    board={props.board.current}
                    playerView
                    importanceRect={props.importanceRect}
                />
            </div>
        </WindowComponent>
    )
}

export const PlayerView = React.forwardRef(PlayerViewRenderer);