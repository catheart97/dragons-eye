import { BoardPosition, IBoardUtility, BoardDecoratorType, Board, BoardItemType, ItemTypeIcons, ItemData } from "../Board"
import { ToolButton } from "../../ui/ToolButton";
import { TextInput } from "../../ui/TextInput";
import { UIGroup } from "../../ui/UIGroup";
import { UIContainer } from "../../ui/UIContainer";
import { Tab, TabView } from "../../ui/TabView";
import { Database } from "../../database/Database";
import { ItemComponent, NewItemComponent } from "../../statblock/ItemComponent";

export class CreateItemDecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;

    itemType: BoardItemType = BoardItemType.Door;

    save2DB = true;
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

    filter: string = "";

    itemBuffer: ItemData = []

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

            const data = this.itemType == BoardItemType.Door ? this.doorData : (
                this.itemType == BoardItemType.Trap ? this.trapData : (
                    this.itemType == BoardItemType.Note ? this.noteData : (
                        this.itemType == BoardItemType.Item ? this.itemBuffer : ""
                    )
                )
            )
            this.board.decorators[idxTo] = {
                type: BoardDecoratorType.Item,
                attachment: {
                    type: structuredClone(this.itemType),
                    data: structuredClone(data)
                },
                key: this.board.decoratorCounter++
            }

        }
        this.mouseDown = false;

        this.forceUpdate?.call(this);
    }


    onShapeHover(position: BoardPosition) {
        this.position = position;
    }

    onMount() {
    }

    userInterface() {
        return (
            <UIContainer className={
                this.itemType == BoardItemType.Item ? "grow flex flex-col" : ""
            }>

                <UIGroup title="Item Type" className="grow-0">
                    <ToolButton
                        onClick={() => {
                            this.itemType = BoardItemType.Door;
                            this.forceUpdate?.call(this);
                        }}
                        active={this.itemType == BoardItemType.Door}
                        className="text-xl"
                    >
                        {ItemTypeIcons[BoardItemType.Door]}
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            this.itemType = BoardItemType.Trap;
                            this.forceUpdate?.call(this);
                        }}
                        active={this.itemType == BoardItemType.Trap}
                        className="text-xl"
                    >
                        {ItemTypeIcons[BoardItemType.Trap]}
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            this.itemType = BoardItemType.Note;
                            this.forceUpdate?.call(this);
                        }}
                        active={this.itemType == BoardItemType.Note}
                        className="text-xl"
                    >
                        {ItemTypeIcons[BoardItemType.Note]}
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            this.itemType = BoardItemType.Item;
                            this.forceUpdate?.call(this);
                        }}
                        active={this.itemType == BoardItemType.Item}
                        className="text-xl"
                    >
                        {ItemTypeIcons[BoardItemType.Item]}
                    </ToolButton>
                </UIGroup>

                {
                    this.itemType == BoardItemType.Door ? (
                        <UIGroup title="Door State" className="grow-0">
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
                    ) : null
                }

                {
                    this.itemType == BoardItemType.Trap ? (
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
                    this.itemType == BoardItemType.Note ? (
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
                    this.itemType == BoardItemType.Item ? (
                        <>
                            <TabView
                                defaultIndex={1}
                                className="rounded-xl shadow-xl h-0 grow"
                                tabClassName="overflow-y-scroll"
                            >
                                <Tab title="New Item">
                                    <NewItemComponent
                                        onSubmit={(item, toDB) => {
                                            if (toDB) {
                                                const items = Database.getInstance().getItems();
                                                items.push(item);
                                                Database.getInstance().updateItems(items);
                                            }
                                            this.itemBuffer.push(item);
                                            this.forceUpdate?.call(this);
                                        }}
                                    />
                                </Tab>
                                <Tab title="Item DB">
                                    <div className="h-full p-2 flex flex-col gap-1">
                                        <div className="flex rounded-xl shadow items-center">
                                            <span className="mso p-2">search</span>
                                            <input
                                                className="grow h-full"
                                                type="text"
                                                onChange={(e) => {
                                                    this.filter = e.target.value;
                                                    this.forceUpdate?.call(this);
                                                }}
                                            />
                                        </div>
                                        {
                                            Database.getInstance().getItems().map((item, idx) => {

                                                if (!item.name.toLowerCase().includes(this.filter.toLowerCase()))       
                                                    return null;

                                                return (
                                                    <ItemComponent
                                                        key={idx}
                                                        item={item}
                                                        onDeleteRequest={() => {
                                                            const items = Database.getInstance().getItems();
                                                            items.splice(idx, 1);
                                                            Database.getInstance().updateItems(items);
                                                            this.forceUpdate?.call(this);
                                                        }}
                                                        onSelectionRequest={() => {
                                                            this.itemBuffer.push(item);
                                                            this.forceUpdate?.call(this);
                                                        }}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </Tab>
                            </TabView>

                            <div className="flex flex-col grow h-0 rounded-xl bg-white p-2 mt-4">
                                <UIGroup title="Chest" className="text-orange-600" />
                                <div className="grow h-0">
                                    <div className="flex flex-col gap-1 overflow-y-scroll">
                                        {
                                            this.itemBuffer.map((item) => {
                                                return (
                                                    <ItemComponent
                                                        item={item}
                                                        onDeleteRequest={() => {
                                                            const idx = this.itemBuffer.indexOf(item);
                                                            this.itemBuffer.splice(idx, 1);
                                                            this.forceUpdate?.call(this);
                                                        }}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </>

                    ) : null
                }
            </UIContainer>
        )
    }

    icon() {
        return <span className="mso text-xl">category</span>;
    }

    description() {
        return (
            <>Place elements doors, traps or items.</>
        )
    }

}