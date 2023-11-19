import React from "react";
// import { WindowComponent, WindowComponentHandle } from "../ui/WindowComponent";
import { Board, BoardCreature, BoardDecorator, CreatureAttitude } from "../../data/Board";
import { BoardComponent, BoardComponentHandle } from "../BoardComponent";
import { IPlayerAppView, PlayerViewSettings } from "./IAppView";
import Marquee from "react-fast-marquee";

export type BoardPlayerViewProps = {
    board: React.MutableRefObject<Board>;
    playerSettings: React.MutableRefObject<PlayerViewSettings>;
} & IPlayerAppView

export type BoardPlayerViewHandle = {
    update: () => void;
    isOpen: () => boolean;
}

const BoardPlayerViewRenderer: React.ForwardRefRenderFunction<BoardPlayerViewHandle, BoardPlayerViewProps> = (props, ref) => {

    const boardComponentRef = React.useRef<BoardComponentHandle>(null);
    const handle: BoardPlayerViewHandle = {
        update: () => {
            boardComponentRef.current?.update();
        },
        isOpen() {
            return props.open
        }
    }

    React.useEffect(() => {
        boardComponentRef.current?.update();
        console.log(props.open)
    }, [props.open])

    React.useImperativeHandle(ref, () => handle);

    return (
        props.open ? (
            <div className="text-2xl bg-green-500 h-full relative w-1/2 overflow-hidden" style={{
                minWidth: "50vw",
                maxWidth: "50vw",
                width: "50vw",
            }}>
                <BoardComponent
                    ref={boardComponentRef}
                    board={props.board.current}
                    playerView
                    playerSettings={props.playerSettings}
                />
                {
                    props.playerSettings.current.initiativeEnabled && props.board.current.initiative ? (
                        <div className="absolute bottom-0 p-3 pointer-events-none flex items-end z-[60] justify-start top-0 right-0 overflow-hidden transition-all duration-200 ease-in-out"
                            style={{
                                left: -props.board.current.initiativeIndex! * 9 + "rem"
                            }}
                        >
                            {
                                props.board.current.initiative.map((v, i) => {

                                    let decorator: BoardDecorator | null = null;
                                
                                    for (const layer of props.board.current.layers) {
                                        for (const d in layer.decorators) {
                                            if (layer.decorators[d].key == v.id) {
                                                decorator = layer.decorators[d];
                                                break;
                                            }
                                        }
                                    }

                                    if (decorator == null) return null;
                                    const attachment = decorator.attachment as BoardCreature;

                                    let background = "bg-neutral-50/80";
                                    if (attachment.attitude == CreatureAttitude.Player) {
                                        background = "bg-green-100/80";
                                    } else if (attachment.attitude == CreatureAttitude.Enemy) {
                                        background = "bg-red-100/80";
                                    } else {
                                        background = "bg-purple-100/80";
                                    }


                                    return (
                                        <div
                                            className={"w-36 min-w-36 shrink-0 max-w-36 transition-all duration-300 ease-in-out p-2 " + (props.board.current.initiativeIndex == i ? "h-36" : "h-12 text-sm")}
                                            key={v.id}
                                        >
                                            <div className={"h-full w-full rounded-xl shadow p-2 flex items-center flex flex-col justify-center gap-2 " + background}>
                                                <Marquee>
                                                    {attachment.statblock.name} &nbsp; &nbsp; &nbsp;
                                                </Marquee>
                                                <small className={
                                                    props.board.current.initiativeIndex == i ? "" : "hidden"
                                                }>ID: {decorator.key}</small>
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

export const BoardPlayerView = React.forwardRef(BoardPlayerViewRenderer);