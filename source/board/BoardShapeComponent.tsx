import React from "react"

import { Board, BoardPosition, BoardTerrain, BaseSize, TerrainColors, BoardCondition, ConditionIcons } from "./Board"

export const BoardShapeComponent = (props: {
    board: Board,
    position: BoardPosition
    onMouseDown?: (p: BoardPosition) => void
    onHover?: (p: BoardPosition) => void
    onMouseUp?: (p: BoardPosition) => void
}) => {

    const idx = props.position.x + props.position.y * props.board.width;
    const terrain = props.board.terrain[idx];

    if (terrain === BoardTerrain.Wall) {
        if (props.board.conditions[idx]) {
            delete props.board.conditions[idx];
        }
    }

    if (terrain == BoardTerrain.Water) {
        if (props.board.conditions[idx] == BoardCondition.Fire ||
            props.board.conditions[idx] == BoardCondition.Acid) {
            delete props.board.conditions[idx];
        }
    }

    return (
        <div
            className={
                'relative border-[1px] border-black border-dashed relative'
            }
            style={{
                width: BaseSize + 'rem',
                height: BaseSize + 'rem',
                minWidth: BaseSize + 'rem',
                minHeight: BaseSize + 'rem',
                maxWidth: BaseSize + 'rem',
                maxHeight: BaseSize + 'rem',
                backgroundColor: TerrainColors[props.board.terrain[idx]]
            }}
            onMouseOver={() => { props.onHover ? props.onHover(props.position) : null }}
            onMouseDown={() => { props.onMouseDown ? props.onMouseDown(props.position) : null }}
            onMouseUp={() => { props.onMouseUp ? props.onMouseUp(props.position) : null }}
        >
            {
                props.board.conditions[idx] ? (
                    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                        {
                            ConditionIcons[props.board.conditions[idx]]
                        }
                    </div>
                ) : null
            }
            {
                props.board.decorators[idx] ? (
                    <div className="absolute top-0 right-0 bottom-0 pointer-events-none rounded-full">
                        <span className="msf text-2xl bg-white rounded-full">person</span>
                    </div>
                ) : null
            }
        </div>
    )
}