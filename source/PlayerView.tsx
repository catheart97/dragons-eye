import React from "react";
// import { WindowComponent, WindowComponentHandle } from "../ui/WindowComponent";
import { Board, BoardCreature, BoardDecorator } from "./board/Board";
import { BoardComponent, BoardComponentHandle } from "./board/BoardComponent";
import { Rect } from "./Rect";

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

const PlayerViewRenderer: React.ForwardRefRenderFunction<PlayerViewHandle, PlayerViewProps> = (props, ref) => {

    const boardComponentRef = React.useRef<BoardComponentHandle>(null);
    const [open, setOpen] = React.useState(false);

    const handle: PlayerViewHandle = {
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
                {
                    props.board.current.initiative ? (
                        <div className="absolute bottom-0 p-3 pointer-events-none flex items-end z-[60] justify-start top-0 right-0 overflow-hidden transition-all duration-200 ease-in-out"
                            style={{
                                left: -props.board.current.initiativeIndex! * 9 + "rem"
                            }}
                        >
                            {
                                props.board.current.initiative.map((v, i) => {

                                    let decorator: BoardDecorator | null = null;
                                    let decorators = Object.values(props.board.current.decorators)
                                    for (let i = 0; i < decorators.length; i++) {
                                        if (decorators[i].key == v.id) {
                                            decorator = decorators[i];
                                            break;
                                        }
                                    }

                                    if (decorator == null) return null;
                                    const attachment = decorator.attachment as BoardCreature;

                                    return (
                                        <div
                                            className={"w-36 min-w-36 shrink-0 max-w-36 transition-all duration-300 ease-in-out p-2 " + (props.board.current.initiativeIndex == i ? "h-36" : "h-12 text-sm")}
                                            key={v.id}
                                        >
                                            <div className="h-full w-full bg-neutral-50/80 rounded-xl shadow p-2 flex items-center">
                                                {attachment.statblock.name}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {/* </div> */}
                        </div>
                    ) : null
                }
            </div>
        ) : (
            <></>
        )
    )
}

export const PlayerView = React.forwardRef(PlayerViewRenderer);