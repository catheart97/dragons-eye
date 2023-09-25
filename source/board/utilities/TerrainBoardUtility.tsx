import { Board, BoardPosition, BoardTerrain, IBoardUtility, BaseSize, TerrainColors } from "../Board"
import { ToolButton } from "../../ui/ToolButton"

export class TerrainBoardUtility implements IBoardUtility {
    private board: Board
    private targetTerrain: BoardTerrain

    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    forceUpdate : (() => void) | null = null;

    constructor(board: Board, targetTerrain: BoardTerrain) {
        this.board = board
        this.targetTerrain = targetTerrain
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;
        this.board.terrain[position.x + position.y * this.board.width] = this.targetTerrain;
    }

    onShapeHover(position: BoardPosition) {
        this.hoverTile = position;
    }

    onShapeRelease(position: BoardPosition) {
        if (position.x === this.downTile?.x && position.y === this.downTile?.y) {
            this.board.terrain[position.x + position.y * this.board.width] = this.targetTerrain;
        } else {
            for (let x = Math.min(position.x, this.downTile!.x); x <= Math.max(position.x, this.downTile!.x); x++) {
                for (let y = Math.min(position.y, this.downTile!.y); y <= Math.max(position.y, this.downTile!.y); y++) {
                    this.board.terrain[x + y * this.board.width] = this.targetTerrain;
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
                    <div className={"h-full w-full opacity-80 " + TerrainColors[this.targetTerrain]}></div>
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
                        (Object.values(BoardTerrain).filter((v) => typeof v !== 'string') as BoardTerrain[]).map((v, i) => {
                            return (
                                <ToolButton
                                    key={i}
                                    onClick={() => {
                                        this.targetTerrain = v;
                                        this.forceUpdate?.call(this);
                                    }}
                                    active={this.targetTerrain == v}
                                ><div className='w-4 h-4 border-2 border-dashed border-black' style={{
                                    backgroundColor: TerrainColors[v]
                                }}>
                                    </div></ToolButton>
                            )
                        })
                    }
            </>
        )
    }
}