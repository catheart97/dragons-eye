import { BoardPosition, IBoardUtility, BoardDecoratorType, Board, CreatureType, CreatureAttitude, BoardItemType } from "../data/Board"
import { ToolButton } from "../components/ui/ToolButton";
import { UIGroup } from "../components/ui/UIGroup";
import { PlayerStatblock, Statblock, constructDefaultStatblock } from "../data/Statblock";
import { PlayerStatblockList, RawStatblockComponent, StatblockList } from "../components/StatblockComponent";
import { Switch } from "../components/ui/Switch";
import { Database } from "../data/Database";
import { Tab, TabView } from "../components/ui/TabView";
import { UIContainer } from "../components/ui/UIContainer";
import { Campaign } from "../data/Campaign";
import React from "react";
import { Adventure } from "../data/Adventure";
import { updateInitiativeOnChange } from "./InitiativeBoardUtility";

export class CreateCreatureDecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    downPosition: BoardPosition | null = null;

    creatureType: CreatureType = CreatureType.Humanoid;
    creatureAttitude: CreatureAttitude = CreatureAttitude.Enemy;
    creatureStatblock: Statblock | PlayerStatblock = constructDefaultStatblock();

    itemType: BoardItemType = BoardItemType.Door;

    save2DB = false;
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

    campaign?: React.MutableRefObject<Campaign> = undefined;
    adventure?: Adventure = undefined;

    forceUpdate: (() => void) | null = null;

    constructor(board: Board, campaign?: React.MutableRefObject<Campaign>, adventure?: Adventure) {
        this.campaign = campaign;
        this.adventure = adventure;
        this.board = board;
    }

    onShapeClick(position: BoardPosition) {
        this.downPosition = position;
        this.mouseDown = true;
    }

    onShapeRelease(position: BoardPosition) {
        const idxTo = position.x + position.y * this.board.width;

        if (this.board.layers[this.board.activeLayer].decorators[idxTo] == undefined) {
            if (this.creatureAttitude == CreatureAttitude.Player) {
                this.board.layers[this.board.activeLayer].decorators[idxTo] = {
                    type: BoardDecoratorType.Creature,
                    attachment: {
                        type: this.creatureType,
                        attitude: this.creatureAttitude,
                        statblock: {
                            size: this.creatureStatblock.size,
                            name: this.creatureStatblock.name,
                            image: this.creatureStatblock.image,
                        }
                    },
                    key: this.board.decoratorCounter++
                }
            } else {
                const statblock = structuredClone(this.creatureStatblock);
                this.board.layers[this.board.activeLayer].decorators[idxTo] = {
                    type: BoardDecoratorType.Creature,
                    attachment: {
                        type: this.creatureType,
                        attitude: this.creatureAttitude,
                        statblock: statblock as Statblock,
                    },
                    key: this.board.decoratorCounter++
                }
                if (this.save2DB) {
                    const db = Database.getInstance();
                    const monsters = db.getMonsters();
                    // ensure we do not create duplicates
                    for (const m of monsters) {
                        if (m.name == statblock.name) {
                            this.mouseDown = false;
                            this.forceUpdate?.call(this);
                            return;
                        }
                    }
                    monsters.push(statblock as Statblock)
                    db.commit();
                }
            }
            updateInitiativeOnChange(this.board);
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
            <UIContainer className="grow flex flex-col">
                <TabView
                    defaultIndex={1}
                    className="shadow-xl rounded-xl grow h-0"
                    tabClassName="overflow-y-scroll"
                >
                    <Tab title="Create New">
                        <RawStatblockComponent
                            createMode
                            player={this.creatureAttitude == CreatureAttitude.Player}
                            statblock={this.creatureStatblock}
                            updateStatblock={(statblock) => {
                                this.creatureStatblock = statblock;
                                this.forceUpdate?.call(this);
                            }}
                            uniqueKey={-1}
                        />

                        {
                            this.creatureAttitude != CreatureAttitude.Player ? (
                                <UIGroup title="Save to DB" className="pl-3 pr-3">
                                    <Switch
                                        defaultValue={this.save2DB}
                                        onChange={(e) => {
                                            this.save2DB = e.target.checked;
                                        }}
                                    ></Switch>
                                </UIGroup>
                            ) : null
                        }
                    </Tab>
                    <Tab title="From DB">
                        <StatblockList
                            data={Database.getInstance().getMonsters()}
                            update={() => {
                                this.forceUpdate?.call(this);
                            }}
                            onSelect={(statblock) => {
                                this.creatureStatblock = statblock;
                                this.forceUpdate?.call(this);
                            }}
                            searchBar
                            allowDelete
                            onUpdateData={(data) => {
                                Database.getInstance().updateMonsters(data);
                                this.forceUpdate?.call(this);
                            }}
                        />
                    </Tab>
                    {
                        this.campaign != null ? (
                            <Tab title="Campaign">
                                <div className="text-xl font-bold p-2">Players</div>
                                <PlayerStatblockList
                                    data={this.campaign.current.players}
                                    update={() => {
                                        this.forceUpdate?.call(this);
                                    }}
                                    onSelect={(statblock) => {
                                        this.creatureAttitude = CreatureAttitude.Player;
                                        this.creatureStatblock = statblock;
                                        this.forceUpdate?.call(this);
                                    }}
                                    searchBar
                                />
                                {
                                    this.adventure != null ? (
                                        <>
                                            <div className="text-xl font-bold p-2">Adventure NPCs</div>
                                            <StatblockList
                                                data={this.adventure.npcs}
                                                update={() => {
                                                    this.forceUpdate?.call(this);
                                                }}
                                                onSelect={(statblock) => {
                                                    this.creatureAttitude = CreatureAttitude.Ally;
                                                    this.creatureStatblock = statblock;
                                                    this.forceUpdate?.call(this);
                                                }}
                                                searchBar
                                            />
                                        </>
                                    ) : null
                                }
                                <div className="text-xl font-bold p-2">NPCs</div>
                                <StatblockList
                                    data={this.campaign.current.npcs}
                                    update={() => {
                                        this.forceUpdate?.call(this);
                                    }}
                                    onSelect={(statblock) => {
                                        this.creatureAttitude = CreatureAttitude.Ally;
                                        this.creatureStatblock = statblock;
                                        this.forceUpdate?.call(this);
                                    }}
                                    searchBar
                                />
                            </Tab>
                        ) : undefined
                    }
                </TabView>
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
            </UIContainer>
        )
    }

    icon() {
        return <span className="mso text-xl">raven</span>;
    }

    description() {
        return (
            <>Place creatures.</>
        )
    }

}