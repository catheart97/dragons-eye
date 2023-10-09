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
    isOpen: () => boolean;
}

const PlayerViewRenderer : React.ForwardRefRenderFunction<PlayerViewHandle, PlayerViewProps> = (props, ref) => {

    const boardComponentRef = React.useRef<BoardComponentHandle>(null);
    const [open, setOpen] = React.useState(false);

    const handle : PlayerViewHandle = {
        update: () => {
            boardComponentRef.current?.update();
        },
        open() {
            boardComponentRef.current?.update();
            setOpen(true);
        },
        close() {
            setOpen(false);
        },
        isOpen() {
            return open;
        }
    }

    React.useImperativeHandle(ref, () => handle);

    return (
        open ? (
            <div className="text-2xl bg-green-500 h-screen relative grow basis-2" style={{
                minWidth: "50vw",
                maxWidth: "50vw",
                width: "50vw",
            }}>
                <BoardComponent 
                    ref={boardComponentRef}
                    board={props.board.current}
                    playerView
                    importanceRect={props.importanceRect}
                />
            </div>
        ) : (
            <></>
        )
    )
}

export const PlayerView = React.forwardRef(PlayerViewRenderer);