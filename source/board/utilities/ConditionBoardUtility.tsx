import React from "react"

import { Board, BoardPosition, BoardTerrain, IBoardUtility, BaseSize, TerrainColors, BoardCondition, ConditionIcons } from "../Board"
import { ToolButton } from "../../ui/ToolButton"

export class ConditionBoardUtility implements IBoardUtility {
    private board: Board
    private targetCondition: BoardCondition | null

    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    renderUI : (() => void) | null = null;

    constructor(board: Board, targetCondition: BoardCondition | null) {
        this.board = board
        this.targetCondition = targetCondition
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;

    }

    private setBoardCondition(position: BoardPosition, condition: BoardCondition | null) {
        if (condition) {
            this.board.conditions[position.x + position.y * this.board.width] = condition;
        } else {
            delete this.board.conditions[position.x + position.y * this.board.width];
        }
    }

    onShapeHover(position: BoardPosition) {
        this.hoverTile = position;
    }

    onShapeRelease(position: BoardPosition) {
        if (position.x === this.downTile?.x && position.y === this.downTile?.y) {
            this.setBoardCondition(position, this.targetCondition);
        } else {
            for (let x = Math.min(position.x, this.downTile!.x); x <= Math.max(position.x, this.downTile!.x); x++) {
                for (let y = Math.min(position.y, this.downTile!.y); y <= Math.max(position.y, this.downTile!.y); y++) {
                    this.setBoardCondition({ x: x, y: y }, this.targetCondition);
                }
            }
        }
        this.downTile = null;
    }

    customComponent() {
        if (this.downTile != null && this.hoverTile != null) {
            const dx = Math.abs(this.hoverTile.x - this.downTile.x) + 1;
            const dy = Math.abs(this.hoverTile.y - this.downTile.y) + 1;
            return (
                <div
                    style={{
                        left: Math.min(this.hoverTile.x, this.downTile.x) * BaseSize + 'rem',
                        top: Math.min(this.hoverTile.y, this.downTile.y) * BaseSize + 'rem',
                        width: dx * BaseSize + 'rem',
                        height: dy * BaseSize + 'rem',
                        minWidth: dx * BaseSize + 'rem',
                        minHeight: dy * BaseSize + 'rem',
                        maxWidth: dx * BaseSize + 'rem',
                        maxHeight: dy * BaseSize + 'rem',
                    }}
                    className={'border-4 border-red-500 absolute pointer-events-none'}
                >
                    <div className={"h-full w-full opacity-80 bg-neutral-500"}></div>
                </div>
            )
        } else {
            return <></>
        }
    }

    userInterface() {
        return (
            <>
                {
                    (Object.values(BoardCondition).filter((v) => typeof v !== 'string') as BoardCondition[]).map((v, i) => {
                        return (
                            <ToolButton
                                key={i}
                                onClick={() => {
                                    this.targetCondition = v;
                                    this.renderUI ? this.renderUI() : null;
                                }}
                                active={this.targetCondition == v}
                            >
                                <div className='w-4 h-4 border-2 border-dashed border-black bg-white flex items-center justify-center text-xs' >
                                    {ConditionIcons[v]}
                                </div>
                            </ToolButton>
                        )
                    })
                }
            </>
        )
    }
}