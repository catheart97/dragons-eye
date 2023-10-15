import { Board, BoardPosition, BoardTerrain, IBoardUtility, TerrainColors } from "../Board"
import { ToolButton } from "../../ui/ToolButton"
import { CanvasBaseSize } from "../BoardComponent"
import { UIContainer } from "../../ui/UIContainer"

export class TerrainBoardUtility implements IBoardUtility {
    private board: Board
    private targetTerrain: BoardTerrain

    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    forceUpdate: (() => void) | null = null;

    constructor(board: Board, targetTerrain: BoardTerrain) {
        this.board = board
        this.targetTerrain = targetTerrain
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;
        this.board.terrain[position.x + position.y * this.board.width] = this.targetTerrain;
        console.log("down");
    }

    icon() {
        return <span className="mso text-xl">edit</span>
    }

    onShapeHover(position: BoardPosition) {
        this.hoverTile = position;
    }

    onShapeRelease(position: BoardPosition) {

        console.log(this.downTile);

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

        this.forceUpdate?.call(this);
    }

    customComponent() {
        if (this.downTile != null && this.hoverTile != null) {
            const dx = Math.abs(this.hoverTile.x - this.downTile.x) + 1;
            const dy = Math.abs(this.hoverTile.y - this.downTile.y) + 1;
            return (
                <div
                    style={{
                        left: Math.min(this.hoverTile.x, this.downTile.x) * CanvasBaseSize + 'px',
                        top: Math.min(this.hoverTile.y, this.downTile.y) * CanvasBaseSize + 'px',
                        width: dx * CanvasBaseSize + 'px',
                        height: dy * CanvasBaseSize + 'px',
                        minWidth: dx * CanvasBaseSize + 'px',
                        minHeight: dy * CanvasBaseSize + 'px',
                        maxWidth: dx * CanvasBaseSize + 'px',
                        maxHeight: dy * CanvasBaseSize + 'px',
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
            <UIContainer>
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
                            >
                                {BoardTerrain[v]}
                            </ToolButton>
                        )
                    })
                }
            </UIContainer>
        )
    }

    description() {
        return (
            <>Edit the board terrain.</>
        )
    }
}