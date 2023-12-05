import { ItemComponent } from "../components/ItemComponent";
import { RawStatblockComponent } from "../components/StatblockComponent";
import { Board, BoardCreature, BoardDecoratorType, BoardPosition, CreatureAttitude, IBoardUtility, BoardItemType, TrapData, ItemData, MAX_LAYERS, BoardTerrain } from "../data/Board";
import { CanvasBaseSize } from "../components/BoardConstants";
import { UIContainer } from "../components/ui/UIContainer";
import { ToolButton } from "../components/ui/ToolButton";
import { UIGroup } from "../components/ui/UIGroup";

enum InteractMoveMode {
    None,
    Up,
    Down
}

export class InteractBoardUtility implements IBoardUtility {

    private board: Board
    private component: JSX.Element | null = null;
    private helper: JSX.Element | null = null;

    public position: BoardPosition | null = null;
    private downPosition: BoardPosition | null = null;

    private moveMode: InteractMoveMode = InteractMoveMode.None;

    constructor(board: Board) {
        this.board = board
    }

    icon() {
        return <span className="mso text-xl">arrow_selector_tool</span>;
    }

    onShapeClick(position: BoardPosition) {
        this.position = position;
        this.downPosition = position;
    }

    onShapeRelease(position: BoardPosition) {

        this.position = position;
        if (this.downPosition!.x == position.x && this.downPosition!.y == position.y) {
            const decorator = this.board.layers[this.board.activeLayer].decorators[position.x + this.board.width * position.y];
            if (decorator) {

                if (decorator.type == BoardDecoratorType.Item && decorator.attachment.type == BoardItemType.Door) {
                    decorator.attachment.data = decorator.attachment.data == "unlocked" ? "locked" : "unlocked";
                }

                if (decorator.type == BoardDecoratorType.Item && decorator.attachment.type == BoardItemType.Trap) {
                    (decorator.attachment.data as TrapData).armed = !(decorator.attachment.data as TrapData).armed;
                }

                if (decorator.type == BoardDecoratorType.Item && decorator.attachment.type == BoardItemType.Item) {
                    const attachment = decorator.attachment.data as ItemData;
                    this.helper = (
                        <div
                            key={decorator.key}
                            className="bg-white p-2 flex flex-col gap-2 w-96 h-96 rounded-xl shadow-xl overflow-y-scroll pointer-events-auto pt-20"
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
                            {attachment.map((item, i) => <ItemComponent data={item} key={i} updateData={
                                (item) => {
                                    attachment[i] = item;
                                }
                            } />)}
                        </div>
                    )

                }

                if (decorator.type == BoardDecoratorType.Creature) {
                    if (this.helper) {
                        this.helper = null;
                    } else {
                        const attachment = decorator.attachment as BoardCreature;
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
                                    className="absolute w-10 h-10 flex justify-center items-center bg-red-500 rounded-full text-white text-lg pointer-events-auto hover:scale-110 transition-all duration-300 ease-in-out top-5 right-5"
                                ><span className="mso">close</span></button>
                                <RawStatblockComponent
                                    uniqueKey={decorator.key}
                                    statblock={(decorator.attachment as BoardCreature).statblock}
                                    updateStatblock={(s) => {
                                        (this.board.layers[this.board.activeLayer].decorators[position.x + this.board.width * position.y].attachment as BoardCreature).statblock = s;
                                    }}
                                    player={
                                        attachment.attitude == CreatureAttitude.Player
                                    }
                                />
                            </div>
                        )
                    }
                }

            }
        } else {
            const idxTo = position.x + position.y * this.board.width;
            if (this.downPosition) {
                const idxFrom = this.downPosition!.x + this.downPosition!.y * this.board.width;

                let targetLayer = this.board.activeLayer;
                if (this.moveMode == InteractMoveMode.Up && 
                    this.board.activeLayer != MAX_LAYERS - 2) {
                
                    if (this.board.layers.length - 1 == this.board.activeLayer) {
                        this.board.layers.push({
                            terrain: new Array<BoardTerrain>(this.board.width * this.board.height).fill(BoardTerrain.Air),
                            decorators: [],
                            hidden: [],
                            stamps: [],
                        });
                    }

                    targetLayer++;
                } else if (this.moveMode == InteractMoveMode.Down) {
                    targetLayer--;
                    targetLayer = targetLayer < 0 ? 0 : targetLayer;
                }

                if (this.board.layers[this.board.activeLayer].decorators[idxFrom] && this.board.layers[targetLayer].decorators[idxTo] == undefined) {
                    this.board.layers[targetLayer].decorators[idxTo] = this.board.layers[this.board.activeLayer].decorators[idxFrom];
                    delete this.board.layers[this.board.activeLayer].decorators[idxFrom];
                }
            }
            this.forceUpdate?.call(this);
        }

        this.downPosition = null;
    }

    onShapeHover(position: BoardPosition) {
        this.position = position;

        if (!this.downPosition) {
            const decorator = this.board.layers[this.board.activeLayer].decorators[position.x + this.board.width * position.y];
            const hidden = this.board.layers[this.board.activeLayer].hidden ? this.board.layers[this.board.activeLayer].hidden[position.x + this.board.width * position.y] : false;
            if (decorator && !hidden && !this.helper) {
                this.component = (
                    <div
                        className="bg-white p-2 flex flex-col gap-2 rounded-xl shadow-xl w-44 h-20 overflow-y-scroll"
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
                                        (decorator.attachment.type == BoardItemType.Door) ? (
                                            <>{decorator.attachment.data == "unlocked" ? "Unlocked" : "Locked"}</>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    {
                                        decorator.attachment.type == BoardItemType.Trap ? (
                                            <>
                                                <div>{(decorator.attachment.data as TrapData).armed ? "Armed" : "Disarmed"}</div>
                                                <div>{(decorator.attachment.data as TrapData).effect}</div>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    {
                                        decorator.attachment.type == BoardItemType.Note ? (
                                            decorator.attachment.data
                                        ) : (
                                            <></>
                                        )
                                    }
                                    {
                                        decorator.attachment.type == BoardItemType.Item ? (
                                            (decorator.attachment.data as ItemData).map((item) => item.name).join(", ")
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
                                    <div className="text-lg">{(decorator.attachment as BoardCreature).statblock.name} <small>{decorator.key}</small></div>
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
    }

    distanceComponent() {
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
    }

    customComponent() {
        return <>
            {this.component ?? <></>}
            {this.helper ?? <></>}
            {
                this.downPosition != null ? (
                    this.distanceComponent()
                ) : null
            }
        </>
    }

    forceUpdate: (() => void) | null = null;
    userInterface() {
        return (
            <UIContainer>
                <UIGroup title="Placement">
                    <div className="flex w-full">
                        <ToolButton
                            className="grow"
                            onClick={() => {
                                this.moveMode = InteractMoveMode.None;
                                this.forceUpdate?.call(null);
                            }}
                            active={this.moveMode == InteractMoveMode.None}
                        >
                            <span className="mso">horizontal_rule</span>
                        </ToolButton>
                        <ToolButton
                            className="grow"
                            onClick={() => {
                                this.moveMode = InteractMoveMode.Up;
                                this.forceUpdate?.call(null);
                            }}
                            active={this.moveMode == InteractMoveMode.Up}
                        >
                            <span className="mso">expand_less</span>
                        </ToolButton>
                        <ToolButton
                            className="grow"
                            onClick={() => {
                                this.moveMode = InteractMoveMode.Down;
                                this.forceUpdate?.call(null);
                            }}
                            active={this.moveMode == InteractMoveMode.Down}
                        >
                            <span className="mso">expand_more</span>
                        </ToolButton>
                    </div>
                </UIGroup>
            </UIContainer>
        )
    }

    description() {
        return (
            <>Interact and inspect the board.</>
        )
    }
}