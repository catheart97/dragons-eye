import { BoardPosition, IBoardUtility, BoardDecoratorType, Board, CreatureType, CreatureAttitude, CreatureSize, ItemType, ItemTypeIcons } from "../Board"
import { ToolButton } from "../../ui/ToolButton";
import { TextInput } from "../../ui/TextInput";
import { UIGroup } from "../../ui/UIGroup";
import { CanvasBaseSize } from "../BoardComponent";

enum DecoratorBoardUtilityMode {
    Drag,
    Place,
    Delete
}

export class DecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;

    mode: DecoratorBoardUtilityMode = DecoratorBoardUtilityMode.Drag;

    decoratorType: BoardDecoratorType = BoardDecoratorType.Creature;

    creatureType: CreatureType = CreatureType.Humanoid;
    creatureAttitude: CreatureAttitude = CreatureAttitude.Hostile;
    creatureSize: CreatureSize = CreatureSize.MediumSmall;
    creatureName: string = "";

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
        if (this.mode == DecoratorBoardUtilityMode.Drag) {
            this.position = position;
        }
        this.downPosition = position;
        this.mouseDown = true;
    }

    onShapeRelease(position: BoardPosition) {
        const idxTo = position.x + position.y * this.board.width;
        if (this.mode == DecoratorBoardUtilityMode.Drag && this.downPosition) {
            const idxFrom = this.downPosition!.x + this.downPosition!.y * this.board.width;

            if (this.board.decorators[idxFrom] && this.board.decorators[idxTo] == undefined) {
                this.board.decorators[idxTo] = this.board.decorators[idxFrom];
                delete this.board.decorators[idxFrom];
            }

            this.position = null;
        }
        if (this.mode == DecoratorBoardUtilityMode.Place) {
            if (this.board.decorators[idxTo] == undefined) {
                if (this.decoratorType == BoardDecoratorType.Creature) {
                    this.board.decorators[idxTo] = {
                        type: this.decoratorType,
                        attachment: {
                            name: this.creatureName,
                            type: this.creatureType,
                            attitude: this.creatureAttitude,
                            size: this.creatureSize
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
                        }
                    }
                }
            }
        }

        if (this.mode == DecoratorBoardUtilityMode.Delete) {
            delete this.board.decorators[idxTo];
        }
        this.mouseDown = false;

        this.forceUpdate?.call(this);
    }


    onShapeHover(position: BoardPosition) {
        this.position = position;
    }

    userInterface() {
        return (
            <>
                <div className="w-full">
                    <UIGroup title="Mode">
                        <ToolButton
                            onClick={() => {
                                this.mode = DecoratorBoardUtilityMode.Place;
                                this.forceUpdate?.call(this);
                            }}
                            active={this.mode == DecoratorBoardUtilityMode.Place}
                        >
                            <span className="mso text-xl">location_on</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.mode = DecoratorBoardUtilityMode.Drag;
                                this.forceUpdate?.call(this);
                            }}
                            active={this.mode == DecoratorBoardUtilityMode.Drag}
                        >
                            <span className="mso text-xl">drag_pan</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.mode = DecoratorBoardUtilityMode.Delete;
                                this.forceUpdate?.call(this);
                            }}
                            active={this.mode == DecoratorBoardUtilityMode.Delete}
                        >
                            <span className="mso text-xl">delete</span>
                        </ToolButton>
                    </UIGroup>
                    {
                        this.mode == DecoratorBoardUtilityMode.Place ? (

                            <>
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
                            </>
                        ) : null
                    }

                    {
                        this.mode == DecoratorBoardUtilityMode.Place && this.decoratorType == BoardDecoratorType.Item ? (
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
                        this.mode == DecoratorBoardUtilityMode.Place && this.decoratorType == BoardDecoratorType.Item && this.itemType == ItemType.Door ? (
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
                        this.mode == DecoratorBoardUtilityMode.Place && this.decoratorType == BoardDecoratorType.Item && this.itemType == ItemType.Trap ? (
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
                        this.mode == DecoratorBoardUtilityMode.Place && this.decoratorType == BoardDecoratorType.Item && this.itemType == ItemType.Note ? (
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
                        this.mode == DecoratorBoardUtilityMode.Place && this.decoratorType == BoardDecoratorType.Creature ? (
                            <>
                                <UIGroup title="Creature Type">
                                    <ToolButton
                                        className="grow"
                                        onClick={() => {
                                            this.creatureType = CreatureType.Humanoid;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureType == CreatureType.Humanoid}
                                    >
                                        <span className="mso text-xl">person</span>
                                    </ToolButton>
                                    <ToolButton
                                        className="grow"
                                        onClick={() => {
                                            this.creatureType = CreatureType.Animal;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureType == CreatureType.Animal}
                                    >
                                        <span className="mso text-xl">pets</span>
                                    </ToolButton>
                                    <ToolButton
                                        className="grow"
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
                                        className="grow"
                                        onClick={() => {
                                            this.creatureAttitude = CreatureAttitude.Player;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureAttitude == CreatureAttitude.Player}
                                    >
                                        <span className="mso text-xl">person</span>
                                    </ToolButton>
                                    <ToolButton
                                        className="grow"
                                        onClick={() => {
                                            this.creatureAttitude = CreatureAttitude.NPC;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureAttitude == CreatureAttitude.NPC}
                                    >
                                        <span className="mso text-xl">robot</span>
                                    </ToolButton>
                                    <ToolButton
                                        className="grow"
                                        onClick={() => {
                                            this.creatureAttitude = CreatureAttitude.Hostile;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureAttitude == CreatureAttitude.Hostile}
                                    >
                                        <span className="mso text-xl">swords</span>
                                    </ToolButton>
                                </UIGroup>
                                <UIGroup title="Size">
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureSize = CreatureSize.Tiny;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureSize == CreatureSize.Tiny}
                                    >
                                        <span className="mso text-xl">crib</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureSize = CreatureSize.MediumSmall;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureSize == CreatureSize.MediumSmall}
                                    >
                                        <span className="mso text-xl">person</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureSize = CreatureSize.Large;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureSize == CreatureSize.Large}
                                    >
                                        <span className="mso text-xl">directions_car</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureSize = CreatureSize.Huge;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureSize == CreatureSize.Huge}
                                    >
                                        <span className="mso text-xl">home</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.creatureSize = CreatureSize.Gargantuan;
                                            this.forceUpdate?.call(this);
                                        }}
                                        active={this.creatureSize == CreatureSize.Gargantuan}
                                    >
                                        <span className="mso text-xl">domain</span>
                                    </ToolButton>
                                </UIGroup>
                                <UIGroup title="Name">
                                    <TextInput onChange={(e) => {
                                        this.creatureName = e.target.value;
                                    }} />
                                </UIGroup>
                            </>
                        ) : null
                    }
                </div>
            </>
        )
    }

    customComponent() {
        if (this.mouseDown && this.mode == DecoratorBoardUtilityMode.Drag) {
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

}