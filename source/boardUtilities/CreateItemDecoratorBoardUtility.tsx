import { ItemList, NewItemComponent } from "../components/ItemComponent";
import { Tab, TabView } from "../components/ui/TabView";
import { TextInput } from "../components/ui/TextInput";
import { ToolButton } from "../components/ui/ToolButton";
import { UIContainer } from "../components/ui/UIContainer";
import { UIGroup } from "../components/ui/UIGroup";
import { Adventure } from "../data/Adventure";
import { Board, BoardDecoratorType, BoardItemType, BoardPosition, IBoardUtility, ItemData, ItemTypeIcons } from "../data/Board";
import { Campaign } from "../data/Campaign";
import { Database } from "../data/Database";

export class CreateItemDecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;

    campaign?: React.MutableRefObject<Campaign>
    adventure?: Adventure

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

    constructor(board: Board, campaign?: React.MutableRefObject<Campaign>, adventure?: Adventure) {
        this.board = board;
        this.campaign = campaign;
        this.adventure = adventure;
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
                                        onSubmit={(item) => {
                                            const items = Database.getInstance().getItems();
                                            items.push(item);
                                            Database.getInstance().updateItems(items);

                                            this.itemBuffer.push(item);
                                            this.forceUpdate?.call(this);
                                        }}
                                    />
                                </Tab>
                                <Tab title="Item DB">
                                    <ItemList
                                        data={Database.getInstance().getItems()}
                                        update={() => {
                                            this.forceUpdate?.call(this);
                                        }}
                                        onSelect={(item) => {
                                            this.itemBuffer.push(item);
                                            this.forceUpdate?.call(this);
                                        }}
                                        searchBar
                                        allowDelete
                                        onUpdateData={(data) => {
                                            Database.getInstance().updateItems(data);
                                            this.forceUpdate?.call(this);
                                        }}
                                    />
                                </Tab>
                                {
                                    this.campaign && this.campaign.current.items ? (
                                        <Tab title="Campaign">
                                            <ItemList
                                                data={this.campaign.current.items}
                                                update={() => {
                                                    this.forceUpdate?.call(this);
                                                }}
                                                onSelect={(item) => {
                                                    this.itemBuffer.push(item);
                                                    this.forceUpdate?.call(this);
                                                }}
                                                searchBar
                                                allowDelete
                                                onUpdateData={(data) => {
                                                    this.campaign!.current.items = data;
                                                    this.forceUpdate?.call(this);
                                                }}
                                            />
                                        </Tab>
                                    ) : undefined
                                }
                            </TabView>

                            <div className="flex flex-col grow h-0 rounded-xl bg-white p-2 mt-4">
                                <UIGroup title="Chest" className="text-orange-600" />
                                <ItemList
                                    data={this.itemBuffer}
                                    update={() => {
                                        this.forceUpdate?.call(this);
                                    }}
                                    searchBar
                                    allowDelete
                                    onUpdateData={(data) => {
                                        this.itemBuffer = data;
                                        this.forceUpdate?.call(this);
                                    }}
                                />
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