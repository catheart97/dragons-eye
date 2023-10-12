import { StatblockComponent } from "../../statblock/StatblockComponent";
import { Board, BoardCreature, BoardDecoratorType, BoardPosition, CreatureAttitude, IBoardUtility, ItemType, TrapData } from "../Board";
import { CanvasBaseSize } from "../BoardComponent";

export class InteractBoardUtility implements IBoardUtility {

    private board: Board
    private component: JSX.Element | null = null;
    private helper: JSX.Element | null = null;

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

            if (decorator.type == BoardDecoratorType.Creature) {
                if (this.helper) {
                    this.helper = null;
                } else {
                    this.helper = (
                        <div
                            key={decorator.key}
                            className="bg-white p-2 flex flex-col gap-2 w-96 h-96 rounded-xl shadow-xl overflow-y-scroll"
                            style={{
                                position: "absolute",
                                left: position.x * CanvasBaseSize + 384 > this.board.width * CanvasBaseSize ? this.board.width * CanvasBaseSize - 384 : position.x * CanvasBaseSize,
                                top: position.y * CanvasBaseSize + 384 > this.board.height * CanvasBaseSize ? this.board.height * CanvasBaseSize - 384 : position.y * CanvasBaseSize,
                                zIndex: 1000
                            }}
                        >
                            <button
                                onClick={() => {
                                    this.helper = null;
                                    this.forceUpdate?.call(null);
                                }}
                                className="absolute w-16 h-16 flex justify-center items-center bg-red-500 rounded-full text-white text-2xl pointer-events-auto hover:scale-110 transition-all duration-300 ease-in-out top-2 right-2"
                            ><span className="mso">close</span></button>
                            <StatblockComponent
                                uniqueKey={decorator.key}
                                statblock={(decorator.attachment as BoardCreature).statblock}
                                updateStatblock={(s) => {
                                    (this.board.decorators[position.x + this.board.width * position.y].attachment as BoardCreature).statblock = s;
                                }}
                            />
                        </div>
                    )
                }
            }

        }
    }

    onShapeHover(position: BoardPosition) {
        const decorator = this.board.decorators[position.x + this.board.width * position.y];
        const hidden = this.board.hidden ? this.board.hidden[position.x + this.board.width * position.y] : false;
        if (decorator && !hidden && !this.helper) {
            this.component = (
                <div
                    className="bg-white p-2 pointer-events-none flex flex-col gap-2 rounded-xl shadow-xl w-44 h-20"
                    style={{
                        position: "absolute",
                        left: position.x * CanvasBaseSize + 176 > this.board.width * CanvasBaseSize ? this.board.width * CanvasBaseSize - 176 : position.x * CanvasBaseSize,
                        top: position.y * CanvasBaseSize + 80 > this.board.height * CanvasBaseSize ? this.board.height * CanvasBaseSize - 80 : position.y * CanvasBaseSize,
                        zIndex: 999
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
                                <div className="text-lg">{(decorator.attachment as BoardCreature).statblock.name}</div> 
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
        return <>
            {this.component ?? <></>}
            {this.helper ?? <></>}
        </>
    }


    forceUpdate: (() => void) | null = null;
    userInterface() {
        return <></>
    }
}