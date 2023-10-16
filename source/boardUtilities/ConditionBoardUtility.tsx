import { Board, BoardPosition, IBoardUtility, BoardCondition, ConditionIcons } from "../data/Board"
import { ToolButton } from "../components/ui/ToolButton"
import { CanvasBaseSize } from "../components/BoardComponent"
import { UIContainer } from "../components/ui/UIContainer"

export class ConditionBoardUtility implements IBoardUtility {
    private board: Board
    private targetCondition: BoardCondition | null

    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    forceUpdate : (() => void) | null = null;

    constructor(board: Board, targetCondition: BoardCondition | null) {
        this.board = board
        this.targetCondition = targetCondition
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;

    }

    icon() {
        return <span className="mso text-xl">question_mark</span>
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
                    <div className={"h-full w-full opacity-80 bg-neutral-500"}></div>
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
                    (Object.values(BoardCondition).filter((v) => typeof v !== 'string') as BoardCondition[]).map((v, i) => {
                        return (
                            <ToolButton
                                key={i}
                                onClick={() => {
                                    this.targetCondition = v;
                                    this.forceUpdate ? this.forceUpdate() : null;
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
            </UIContainer>
        )
    }

    description() {
        return (
            <>Add a condition to a field.</>
        )
    }
}