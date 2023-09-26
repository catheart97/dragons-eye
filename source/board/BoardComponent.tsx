import React from "react"

import { Board, IBoardUtility } from "./Board"
import { BoardShapeComponent } from "./BoardShapeComponent"
import { useForceUpdate } from "../utility"

export const BoardComponent = (props: {
    board: Board,
    utility?: IBoardUtility
}) => {
    const renderUI = useForceUpdate();

    React.useEffect(() => {
        if (props.utility) {
            renderUI();
        }
    }, [props.utility]);

    const rows = new Array<Array<JSX.Element>>(props.board.height)
    for (let i = 0; i < props.board.height; i++) {
        const row = new Array<JSX.Element>(props.board.width)
        for (let j = 0; j < props.board.width; j++) {
            row[j] = (
                <BoardShapeComponent
                    position={{ x: j, y: i }}
                    board={props.board}
                    key={j + i * props.board.width}
                    onHover={(p) => {
                        if (props.utility && props.utility.onShapeHover) {
                            props.utility.onShapeHover(p)
                        }
                        renderUI()
                    }}
                    onMouseUp={(p) => {
                        if (props.utility && props.utility.onShapeRelease) {
                            props.utility.onShapeRelease(p)
                        }
                        renderUI();
                    }}
                    onMouseDown={(p) => {
                        if (props.utility && props.utility.onShapeClick) {
                            props.utility?.onShapeClick(p)
                        }
                        renderUI();
                    }}
                />
            )
        }
        rows.push(row)
    }

    const [zoom, setZoom] = React.useState<number>(1);

    return (
        <div
            className='overflow-scroll select-none h-[inherit] w-[inherit] min-h-[inherit] min-w-[inherit] max-h-[inherit] max-w-[inherit] bg-neutral-400'
            style={{
                zoom: zoom
            }}
            onWheel={(e) => {
                if (e.ctrlKey) {
                    setZoom(Math.min(Math.max(zoom - e.deltaY / 1000, 0.1), 2));
                }
            }}
        >
            <div className="flex justify-center items-center min-h-full">
                <div className="relative">
                    <div>
                        {
                            rows.map((row, index) => {
                                return (
                                    <div className='flex' key={index}>
                                        {row}
                                    </div>
                                )
                            })
                        }
                    </div>
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
    )
}