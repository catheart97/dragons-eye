import { BoardPosition, IBoardUtility, BoardDecoratorType, Board, CreatureType, CreatureAttitude, ItemType, ItemTypeIcons } from "../Board"
import { ToolButton } from "../../ui/ToolButton";
import { TextInput } from "../../ui/TextInput";
import { UIGroup } from "../../ui/UIGroup";
import { CreatureSize, PlayerStatblock, Stat, Statblock, constructDefaultStatblock } from "../../statblock/Statblock";
import { StatblockComponent } from "../../statblock/StatblockComponent";

export class CreateDecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;

    decoratorType: BoardDecoratorType = BoardDecoratorType.Creature;

    creatureType: CreatureType = CreatureType.Humanoid;
    creatureAttitude: CreatureAttitude = CreatureAttitude.Enemy;
    creatureStatblock: Statblock | PlayerStatblock = constructDefaultStatblock();

    itemType: ItemType = ItemType.Door;

    doorData: "locked" | "unlocked" = "locked";
    trapData: {
        armed: boolean,
        effect: string
    } = {
            armed: false,
            effect: ""
        };
    noteData: string = "";

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

        if (this.board.decorators[idxTo] == undefined) {
            if (this.decoratorType == BoardDecoratorType.Creature) {
                if (this.creatureAttitude == CreatureAttitude.Player) {
                    this.board.decorators[idxTo] = {
                        type: this.decoratorType,
                        attachment: {
                            type: this.creatureType,
                            attitude: this.creatureAttitude,
                            statblock: {
                                size: this.creatureStatblock.size,
                                name: this.creatureStatblock.name
                            }
                        },
                        key: this.board.decoratorCounter++
                    }
                } else {
                    this.board.decorators[idxTo] = {
                        type: this.decoratorType,
                        attachment: {
                            type: this.creatureType,
                            attitude: this.creatureAttitude,
                            statblock: {
                                ...structuredClone(this.creatureStatblock)
                            },
                        },
                        key: this.board.decoratorCounter++
                    }
                }
            } else {
                const data = this.itemType == ItemType.Door ? this.doorData : (
                    this.itemType == ItemType.Trap ? this.trapData : (
                        this.itemType == ItemType.Note ? this.noteData : ""
                    )
                )
                this.board.decorators[idxTo] = {
                    type: this.decoratorType,
                    attachment: {
                        type: structuredClone(this.itemType),
                        data: structuredClone(data)
                    },
                    key: this.board.decoratorCounter++
                }
            }
        }
        this.mouseDown = false;

        this.forceUpdate?.call(this);
    }


    onShapeHover(position: BoardPosition) {
        this.position = position;
    }

    onMount() {
        this.creatureStatblock = constructDefaultStatblock();
    }

    userInterface() {
        return (
            <>
                <div className="w-full">


                    <UIGroup title="Element Type">
                        <ToolButton
                            onClick={() => {
                                this.decoratorType = BoardDecoratorType.Creature;
                                this.forceUpdate?.call(this);
                            }}
                            active={this.decoratorType == BoardDecoratorType.Creature}
                        >
                            <span className="mso text-xl">raven</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.decoratorType = BoardDecoratorType.Item;
                                this.forceUpdate?.call(this);
                            }}
                            active={this.decoratorType == BoardDecoratorType.Item}
                        >
                            <span className="mso text-xl">category</span>
                        </ToolButton>
                    </UIGroup>



                    {
                        this.decoratorType == BoardDecoratorType.Item ? (
                            <>
                                <UIGroup title="Item Type">
                                    <ToolButton
                                        onClick={() => {
                                            this.itemType = ItemType.Door;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.itemType == ItemType.Door}
                                        className="text-xl"
                                    >
                                        {ItemTypeIcons[ItemType.Door]}
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.itemType = ItemType.Trap;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.itemType == ItemType.Trap}
                                        className="text-xl"
                                    >
                                        {ItemTypeIcons[ItemType.Trap]}
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.itemType = ItemType.Note;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.itemType == ItemType.Note}
                                        className="text-xl"
                                    >
                                        {ItemTypeIcons[ItemType.Note]}
                                    </ToolButton>
                                </UIGroup>
                            </>
                        ) : null
                    }

                    {
                        this.decoratorType == BoardDecoratorType.Item && this.itemType == ItemType.Door ? (
                            <>
                                <UIGroup title="Door State">
                                    <ToolButton
                                        onClick={() => {
                                            this.doorData = "locked";
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.doorData == "locked"}
                                    >
                                        <span className="mso text-xl">lock</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.doorData = "unlocked";
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.doorData == "unlocked"}
                                    >
                                        <span className="mso text-xl">lock_open</span>
                                    </ToolButton>
                                </UIGroup>
                            </>
                        ) : null
                    }

                    {
                        this.decoratorType == BoardDecoratorType.Item && this.itemType == ItemType.Trap ? (
                            <>
                                <UIGroup title="Trap State">
                                    <ToolButton
                                        onClick={() => {
                                            this.trapData.armed = !this.trapData.armed;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.trapData.armed}
                                    >
                                        <span className="mso text-xl">bolt</span>
                                    </ToolButton>
                                </UIGroup>
                                <UIGroup title="Trap Effect">
                                    <TextInput onChange={(e) => {
                                        this.trapData.effect = e.target.value;
                                    }} />
                                </UIGroup>
                            </>
                        ) : null
                    }

                    {
                        this.decoratorType == BoardDecoratorType.Item && this.itemType == ItemType.Note ? (
                            <>
                                <UIGroup title="Note">
                                    <TextInput
                                        onChange={(e) => {
                                            this.noteData = e.target.value;
                                        }}
                                    ></TextInput>
                                </UIGroup>
                            </>
                        ) : null
                    }

                    {
                        this.decoratorType == BoardDecoratorType.Creature ? (
                            <>
                                <UIGroup title="Creature Type">
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureType = CreatureType.Humanoid;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureType == CreatureType.Humanoid}
                                    >
                                        <span className="mso text-xl">person</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureType = CreatureType.Animal;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureType == CreatureType.Animal}
                                    >
                                        <span className="mso text-xl">pets</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureType = CreatureType.Monster;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureType == CreatureType.Monster}
                                    >
                                        <span className="mso text-xl">diversity_2</span>
                                    </ToolButton>
                                </UIGroup>
                                <UIGroup title="Attitude">
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureAttitude = CreatureAttitude.Player;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureAttitude == CreatureAttitude.Player}
                                    >
                                        <span className="mso text-xl">person</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureAttitude = CreatureAttitude.Ally;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureAttitude == CreatureAttitude.Ally}
                                    >
                                        <span className="mso text-xl">robot</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureAttitude = CreatureAttitude.Enemy;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureAttitude == CreatureAttitude.Enemy}
                                    >
                                        <span className="mso text-xl">swords</span>
                                    </ToolButton>
                                </UIGroup>
                                <UIGroup title="Statblock"></UIGroup>
                                {
                                    <StatblockComponent
                                        createMode
                                        player={this.creatureAttitude == CreatureAttitude.Player}
                                        statblock={this.creatureStatblock}
                                        updateStatblock={(statblock) => {
                                            this.creatureStatblock = statblock;
                                            this.forceUpdate?.call(this);
                                        }}
                                        uniqueKey={-1}
                                    />
                                }
                            </>
                        ) : null
                    }
                </div>
            </>
        )
    }

    icon() {
        return <span className="mso text-xl">pin_drop</span>;
    }

    description() {
        return (
            <>Place elements like creatures or doors.</>
        )
    }

}