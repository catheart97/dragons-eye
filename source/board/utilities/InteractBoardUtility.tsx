import { Board, BoardCreature, BoardDecoratorType, BoardPosition, CreatureAttitude, IBoardUtility, ItemType, TrapData } from "../Board";
import { CanvasBaseSize } from "../BoardComponent";

export class InteractBoardUtility implements IBoardUtility {

    private board: Board
    private component: JSX.Element | null = null;

    constructor(board: Board) {
        this.board = board
    }

    onShapeClick(position: BoardPosition) {
        const decorator = this.board.decorators[position.x + this.board.width * position.y];
        if (decorator) {

            if (decorator.type == BoardDecoratorType.Item && decorator.attachment.type == ItemType.Door) {
                decorator.attachment.data = decorator.attachment.data == "unlocked" ? "locked" : "unlocked";
            }

            if (decorator.type == BoardDecoratorType.Item && decorator.attachment.type == ItemType.Trap) {
                (decorator.attachment.data as TrapData).armed = !(decorator.attachment.data as TrapData).armed;
            }

        }
    }

    onShapeHover(position: BoardPosition) {
        const decorator = this.board.decorators[position.x + this.board.width * position.y];
        const hidden = this.board.hidden ? this.board.hidden[position.x + this.board.width * position.y] : false;
        if (decorator && !hidden) {
            this.component = (
                <div 
                    className="bg-white p-2 pointer-events-none flex flex-col gap-2"
                    style={{
                        position: "absolute",
                        left: position.x * CanvasBaseSize,
                        top: position.y * CanvasBaseSize,
                        zIndex: 1000
                    }}
                >
                    {
                        decorator.type == BoardDecoratorType.Item ? (
                            <>
                                {
                                    (decorator.attachment.type == ItemType.Door) ? (
                                        <>{decorator.attachment.data == "unlocked" ? "Unlocked" : "Locked"}</>
                                    ) : (
                                        <></>
                                    )
                                }

                                {
                                    decorator.attachment.type == ItemType.Trap ? (
                                        <>
                                            <div>{(decorator.attachment.data as TrapData).armed ? "Armed" : "Disarmed"}</div>
                                            <div>{(decorator.attachment.data as TrapData).effect}</div>
                                        </>
                                    ) : (
                                        <></>
                                    )
                                }
                                
                                {
                                    decorator.attachment.type == ItemType.Note ? (
                                        decorator.attachment.data
                                    ) : (
                                        <></>
                                    )
                                }
                            </>
                        ) : <></>
                    }
                    
                    {
                        decorator.type == BoardDecoratorType.Creature ? (
                            <>
                                {(decorator.attachment as BoardCreature).name} <br/>
                                {CreatureAttitude[(decorator.attachment as BoardCreature).attitude]}
                            </>
                        ) : <></>
                    }

                </div>
            )
        } else {
            this.component = null;
        }
        this.forceUpdate?.call(null);
    }

    customComponent() {
        return this.component ?? <></>;
    }


    forceUpdate: (() => void) | null = null;
    userInterface() {
        return <></>
    }
}