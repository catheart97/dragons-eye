import { Board, BoardDecoratorType, BoardPosition, IBoardUtility, ItemType } from "../Board";

export class InteractBoardUtility implements IBoardUtility { 

    private board: Board

    constructor(board: Board) {
        this.board = board
    }

    onShapeClick(position: BoardPosition) {
        const decorator = this.board.decorators[position.x + this.board.width * position.y];
        if (decorator) {
            if (decorator.type == BoardDecoratorType.Item && decorator.attachment.type == ItemType.Door) {
                decorator.attachment.data = decorator.attachment.data ? "locked" : "unlocked";
            }
        }
    }

    forceUpdate : (() => void) | null = null;
    userInterface() {
        return <></>
    }
}