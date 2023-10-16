import { BoardPosition, IBoardUtility, Board } from "../data/Board"
import { CanvasBaseSize } from "../components/BoardComponent";

export class MoveDecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;
    mouseDown: boolean = false;

    forceUpdate: (() => void) | null = null;

    constructor(board: Board) {
        this.board = board;
    }

    onShapeClick(position: BoardPosition) {
        this.position = position;
        this.downPosition = position;
        this.mouseDown = true;
    }

    onShapeRelease(position: BoardPosition) {
        const idxTo = position.x + position.y * this.board.width;
        if (this.downPosition) {
            const idxFrom = this.downPosition!.x + this.downPosition!.y * this.board.width;

            if (this.board.decorators[idxFrom] && this.board.decorators[idxTo] == undefined) {
                this.board.decorators[idxTo] = this.board.decorators[idxFrom];
                delete this.board.decorators[idxFrom];
            }

            this.position = null;
        }
        this.mouseDown = false;

        this.forceUpdate?.call(this);
    }


    onShapeHover(position: BoardPosition) {
        this.position = position;
    }

    userInterface() {
        return (
            <></>
        )
    }

    onMount() {
        this.mouseDown = false;
    }

    icon() {
        return <span className="mso text-xl">drag_pan</span>;
    }

    customComponent() {
        if (this.mouseDown) {
            const p0x = this.downPosition!.x * CanvasBaseSize + 0.5 * CanvasBaseSize;
            const p0y = this.downPosition!.y * CanvasBaseSize + 0.5 * CanvasBaseSize;

            const p1x = this.position!.x * CanvasBaseSize + 0.5 * CanvasBaseSize;
            const p1y = this.position!.y * CanvasBaseSize + 0.5 * CanvasBaseSize;

            const angle = Math.atan2(p1y - p0y, p1x - p0x) * 180 / Math.PI;
            const distance = Math.sqrt((p1x - p0x) * (p1x - p0x) + (p1y - p0y) * (p1y - p0y));

            return (
                <div className="absolute text-center text-white whitespace-nowrap pointer-events-none flex justify-center items-center" style={{
                    left: p0x + 'px',
                    top: p0y + 'px',
                    width: Math.sqrt((p1x - p0x) * (p1x - p0x) + (p1y - p0y) * (p1y - p0y)) + 'px',
                    height: CanvasBaseSize / 10 + 'px',
                    transform: 'rotate(' + angle + 'deg)',
                    transformOrigin: '0% 50%',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <div className="font-mono" style={{
                        transform: 'rotate(' + -angle + 'deg)'
                    }}>
                        {(distance / CanvasBaseSize * 1.5).toFixed(2)} m <br />
                        {(distance / CanvasBaseSize * 5).toFixed(2)} ft
                    </div>
                </div>
            )

        } else {
            return <></>
        }
    }

    description() {
        return (
            <>Move elements like creatures or doors.</>
        )
    }

}