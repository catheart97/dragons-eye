import { BoardPosition, IBoardUtility, Board } from "../Board"

export class TrashDecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;

    mouseDown: boolean = false;

    forceUpdate: (() => void) | null = null;

    constructor(board: Board) {
        this.board = board;
    }

    onShapeClick(position: BoardPosition) {
        this.downPosition = position;
        this.mouseDown = true;
    }

    onShapeRelease(position: BoardPosition) {
        const idxTo = position.x + position.y * this.board.width;
        delete this.board.decorators[idxTo];
        this.mouseDown = false;

        this.forceUpdate?.call(this);
    }


    onShapeHover(position: BoardPosition) {
        this.position = position;
    }

    customComponent() {
        return <></>
    }

    userInterface() {
        return <></>
    }

    icon() {
        return <span className="mso text-xl">delete</span>;
    }

    description() {
        return (
            <>Delete elements like creatures or doors.</>
        )
    }
}