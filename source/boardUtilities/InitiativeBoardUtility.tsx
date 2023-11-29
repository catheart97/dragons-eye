import { CreatureCondition, Stat, Statblock } from "../data/Statblock";
import { EnumEditorComponent } from "../components/StatblockComponent";
import { NumberInput } from "../components/ui/NumberInput";
import { ToolButton } from "../components/ui/ToolButton";
import { UIContainer } from "../components/ui/UIContainer";
import { UIGroup } from "../components/ui/UIGroup";
import { Board, BoardPosition, IBoardUtility, BoardDecorator, BoardDecoratorType, BoardCreature, CreatureAttitude, InitiaitveData } from "../data/Board";
import { InteractBoardUtility } from "./InteractBoardUtility";
import { FullWidthButton } from "../components/ui/FullWidthButton";

export const updateInitiativeOnChange = (board: Board) => {
    // todo: verify that the initiative list is still valid by 
    // checking if the decorators are still on the board
    // or if new decorators have been added or removed and auto roll for them

    if (board.initiative == undefined) return;

    const activeKey = board.initiative[board.initiativeIndex!].id;

    // add decorators that are not on the initiative list
    for (const layer of board.layers) {
        for (const key in layer.decorators) {
            if (layer.decorators[key] == undefined) {
                delete layer.decorators[key];
                continue;
            }
            if (layer.decorators[key].type == BoardDecoratorType.Creature) {
                const attachment = layer.decorators[key].attachment as BoardCreature;
                if (attachment.attitude != CreatureAttitude.Player) {
                    let found = false;
                    for (const i of board.initiative) {
                        if (i.id == layer.decorators[key].key) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        const statblock = attachment.statblock as Statblock
                        board.initiative.push({
                            id: layer.decorators[key].key,
                            initiative: Math.floor(Math.random() * 20) + 1 + statblock.stats[Stat.Dexterity],
                            conditions: []
                        });
                    }
                }
            }
        }
    }

    // delete initiatives that are no longer on the board
    board.initiative = board.initiative.filter((v) => {
        let found = false;
        for (const layer of board.layers) {
            for (const key in layer.decorators) {
                if (layer.decorators[key].key == v.id) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    });

    // sort initiatives
    board.initiative.sort((a, b) => {
        return b.initiative - a.initiative;
    });

    // find the index of the active key
    let index = 0;
    for (const i of board.initiative) {
        if (i.id == activeKey) {
            break;
        }
        index++;
    }
    board.initiativeIndex = index;
}

export class InitiaitveBoardUtility implements IBoardUtility {

    board: Board;
    forceUpdate: (() => void) | null = null;

    initiatives: InitiaitveData[] = [];

    constructor(board: Board, private interactBoardUtility: InteractBoardUtility) {
        this.board = board;
    }

    onShapeClick(position: BoardPosition) {
        this.interactBoardUtility.onShapeClick(position);
    }
    onShapeRelease(position: BoardPosition) {
        this.interactBoardUtility.onShapeRelease(position);
    }
    onShapeHover(position: BoardPosition) {
        this.interactBoardUtility.onShapeHover(position);
    }
    customComponent() {
        return this.interactBoardUtility.customComponent();
    }

    icon() {
        return <span className="mso text-xl">swords</span>;
    }

    description() {
        return (
            <>Track initiative for your players and monsters.</>
        )
    }

    onMount() {
        this.initiatives = [];
    }

    userInterface() {
        if (this.board.initiative != undefined) {
            // construct initiative such that current initiative is first
            const initiativeA: InitiaitveData[] = [];
            for (let i = this.board.initiativeIndex!; i < this.board.initiative.length; i++) {
                initiativeA.push(this.board.initiative[i]);
            }
            const initiativeB: InitiaitveData[] = [];
            for (let i = 0; i < this.board.initiativeIndex!; i++) {
                initiativeB.push(this.board.initiative[i]);
            }

            const renderInitiative = (highlight: boolean, v : InitiaitveData, i : number) => {
                // find decorator which has the key id 
                let decorator: BoardDecorator | null = null;
                for (const layer of this.board.layers) {
                    for (const key in layer.decorators) {
                        if (layer.decorators[key] == undefined) {
                            delete layer.decorators[key];
                            continue;
                        }
                        if (layer.decorators[key].key == v.id) {
                            decorator = layer.decorators[key];
                            break;
                        }
                    }
                }
                if (decorator == null) {
                    return <></>;
                }

                const attachment = decorator.attachment as BoardCreature;
                const statblock = attachment.statblock as Statblock;

                const conditionEdit = (
                    <div className="p-2">
                        <EnumEditorComponent
                            hideTitle
                            enumObj={CreatureCondition}
                            title="Conditions"
                            process={(condition) => {
                                v.conditions.push(condition);
                                this.forceUpdate?.call(this);
                            }}
                            editMode={true}
                            data={v.conditions}
                            update={() => {
                                this.forceUpdate?.call(this);
                            }}
                        />
                    </div>
                )


                return (
                    <div className={"w-full rounded-xl bg-neutral-50 opacity-[90%] " + (highlight && i == 0 ? "border-2 border-orange-600" : "")} key={"#" + decorator.key}>
                        <div className="text-xl p-2">{statblock.name}</div>
                        <div className="flex justify-between items-end p-2">
                            <div className="text-xs">Attitude: {
                                (attachment.attitude == CreatureAttitude.Player ? "Player" : (
                                    attachment.attitude == CreatureAttitude.Enemy ? "Enemy" : "NPC"
                                ))
                            }</div>
                            <div className="text-xs">
                                {
                                    [
                                        "HP: " + (
                                            statblock.hitPoints ? (
                                                statblock.hitPoints.current + "/" + (statblock.hitPoints.maximum + (statblock.hitPoints.temporary ?? 0))
                                            ) : "-"),
                                        "AC: " + (statblock.armorClass ? statblock.armorClass : "-"),
                                        "ID: " + decorator.key
                                    ].join(", ")
                                }
                            </div>
                        </div>

                        {
                            attachment.attitude == CreatureAttitude.Player ? (
                                null
                            ) : (
                                <div className="w-full p-2 flex h-6 rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-500"
                                        style={{
                                            width: (statblock.hitPoints.current / (statblock.hitPoints.maximum + (statblock.hitPoints.temporary ?? 0))) * 100 + "%",
                                            height: "100%"
                                        }}
                                    ></div>
                                    <div
                                        className="bg-green-700"
                                        style={{
                                            width: ((statblock.hitPoints.temporary ?? 0) / (statblock.hitPoints.maximum + (statblock.hitPoints.temporary ?? 0))) * 100 + "%",
                                            height: "100%"
                                        }}
                                    ></div>
                                    <div
                                        className="bg-red-500"
                                        style={{
                                            width: (((statblock.hitPoints.maximum - statblock.hitPoints.current) / (statblock.hitPoints.maximum + (statblock.hitPoints.temporary ?? 0))) * 100) + "%",
                                            height: "100%"
                                        }}
                                    ></div>
                                </div>
                            )
                        }

                        <div className="flex flex-col text-xs w-full items-end">
                            <div className="text-xs px-2">Conditions</div>
                            <div className="w-full">
                                {conditionEdit}
                            </div>
                        </div>
                    </div>
                )

            }

            return (
                <UIContainer>
                    <div className="flex w-full h-full flex-col gap-2">
                        <div className="flex flex-col gap-2 grow overflow-y-scroll">
                            {
                                initiativeA.map((v, i) => renderInitiative(true, v, i))
                            }
                            <div className="w-full h-1 rounded-full bg-orange-600 shrink-0"></div>
                            {
                                initiativeB.map((v, i) => renderInitiative(false, v, i))
                            }
                        </div>
                        <div className="flex justify-end">
                            <ToolButton
                                onClick={() => {
                                    this.board.initiativeIndex = (this.board.initiativeIndex! - 1 + this.board.initiative!.length) % this.board.initiative!.length;
                                    this.forceUpdate?.call(this);
                                }}
                                active={false}
                            >
                                <span className="mso text-xl">arrow_back</span>
                            </ToolButton>
                            <ToolButton
                                onClick={() => {
                                    this.board.initiativeIndex = (this.board.initiativeIndex! + 1 + this.board.initiative!.length) % this.board.initiative!.length;
                                    this.forceUpdate?.call(this);
                                }}
                                active={false}
                            >
                                <span className="mso text-xl">arrow_forward</span>
                            </ToolButton>
                            <ToolButton
                                onClick={() => {
                                    this.board.initiative = undefined;
                                    this.forceUpdate?.call(this);
                                }}
                                active={false}
                            >
                                <span className="mso text-xl">swords</span> Clear
                            </ToolButton>
                        </div>
                    </div>
                </UIContainer>
            )
        } else {
            // get players from board
            const players: BoardDecorator[] = [];

            for (const layer of this.board.layers) {
                for (const key in layer.decorators) {
                    if (layer.decorators[key] == undefined) continue;
                    if (layer.decorators[key].type == BoardDecoratorType.Creature) {
                        const attachment = layer.decorators[key].attachment as BoardCreature;
                        if (attachment.attitude == CreatureAttitude.Player) {
                            players.push(layer.decorators[key]);
                        }
                    }
                }
            }

            return (
                <UIContainer>
                    {
                        players.length != 0 ? (
                            <>
                                {
                                    players.map((v, i) => {
                                        const attachment = v.attachment as BoardCreature;
                                        return (
                                            <UIGroup title={attachment.statblock.name} key={i}>
                                                <NumberInput
                                                    className="w-20"
                                                    onChange={(e) => {
                                                        for (const i of this.initiatives) {
                                                            if (i.id == v.key) {
                                                                i.initiative = e.target.valueAsNumber;
                                                                return;
                                                            }
                                                        }
                                                        this.initiatives.push({
                                                            id: v.key,
                                                            initiative: e.target.valueAsNumber,
                                                            conditions: []
                                                        });
                                                    }}
                                                ></NumberInput>
                                            </UIGroup>
                                        )
                                    })
                                }
                                <FullWidthButton
                                    onClick={() => {
                                        // roll initiative for npcs and monsters
                                        for (const layer of this.board.layers) {
                                            for (const key in layer.decorators) {
                                                if (layer.decorators[key] == undefined) continue;
                                                if (layer.decorators[key].type == BoardDecoratorType.Creature) {
                                                    const attachment = layer.decorators[key].attachment as BoardCreature;
                                                    if (attachment.attitude != CreatureAttitude.Player) {
                                                        const statblock = attachment.statblock as Statblock
                                                        this.initiatives.push({
                                                            id: layer.decorators[key].key,
                                                            initiative: Math.floor(Math.random() * 20) + 1 + statblock.stats[Stat.Dexterity],
                                                            conditions: []
                                                        });
                                                    }
                                                }
                                            }
                                        }

                                        // sort initiatives
                                        this.initiatives.sort((a, b) => {
                                            return b.initiative - a.initiative;
                                        });

                                        this.board.initiative = this.initiatives;
                                        this.board.initiativeIndex = 0;
                                        this.forceUpdate?.call(this);
                                    }}
                                >
                                    <span className="mso text-xl">swords</span> Fight
                                </FullWidthButton>
                            </>
                        ) : (
                            <div className="p-4">
                                No players found on the board. Place at least one player on the board to use initiative tracking.
                            </div>
                        )
                    }
                </UIContainer>
            )

        }
    }
}