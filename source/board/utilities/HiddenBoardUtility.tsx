import { Board, BoardPosition, IBoardUtility } from "../Board"
import { ToolButton } from "../../ui/ToolButton"
import { CanvasBaseSize } from "../BoardComponent"
import { UIContainer } from "../../ui/UIContainer"

export class HiddenBoardUtility implements IBoardUtility {
    private board: Board
    private targetCondition: boolean

    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    forceUpdate: (() => void) | null = null;

    constructor(board: Board) {
        this.board = board
        this.targetCondition = false
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;

    }

    icon() {
        return <span className="mso text-xl">visibility_off</span>;
    }

    private setBoardCondition(position: BoardPosition, condition: boolean) {
        if (condition) {
            if (!this.board.hidden) {
                this.board.hidden = {}
            }
            this.board.hidden[position.x + position.y * this.board.width] = condition;
        } else {
            if (!this.board.hidden) {
                this.board.hidden = {}
            } else {
                delete this.board.hidden[position.x + position.y * this.board.width];
            }
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
                <ToolButton
                    onClick={() => {
                        this.targetCondition = false;
                        this.forceUpdate ? this.forceUpdate() : null;
                    }}
                    active={this.targetCondition == false}
                >
                    <div className='w-4 h-4 border-2 border-dashed border-black bg-white flex items-center justify-center text-xs' >
                    </div>
                </ToolButton>
                <ToolButton
                    onClick={() => {
                        this.targetCondition = true;
                        this.forceUpdate ? this.forceUpdate() : null;
                    }}
                    active={this.targetCondition == true}
                >
                    <div className='w-4 h-4 border-2 border-dashed border-black bg-white flex items-center justify-center text-xs' >
                        <span className="msf">visibility_off</span>
                    </div>
                </ToolButton>
            </UIContainer>
        )
    }

    description() {
        return (
            <>Hide fields in player's view.</>
        )
    }
}