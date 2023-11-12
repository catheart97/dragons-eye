import React from "react";
import { CreatureSize, DamageType, PlayerStatblock, Stat, Statblock, constructDefaultStatblock, CreatureCondition, StatblockAction, SpeedStat } from "../data/Statblock";
import { useForceUpdate } from "../utility";
import { Tooltip, TooltipContent, TooltipTarget } from "./ui/Tooltip";
import { UIGroup } from "./ui/UIGroup";
import { ToolButton } from "./ui/ToolButton";
import { Database } from "../data/Database";
import { SpellList } from "./SpellComponent";
import { IAddComponent, ITListComponentProps, IViewComponent, TListComponent } from "./ui/TListComponent";
import { Tab, TabView, TabViewHandle } from "./ui/TabView";

export const CR2XP = (cr: number): number => {
    if (cr <= 1.0) return 200 * cr;

    switch (cr) {
        case 2: return 450;
        case 3: return 700;
        case 4: return 1100;
        case 5: return 1800;
        case 6: return 2300;
        case 7: return 2900;
        case 8: return 3900;
        case 9: return 5000;
        case 10: return 5900;
        case 11: return 7300;
        case 12: return 8400;
        case 13: return 10000;
        case 14: return 11500;
        case 15: return 13000;
        case 16: return 15000;
        case 17: return 18000;
        case 18: return 20000;
        case 19: return 22000;
        case 20: return 25000;
        case 21: return 33000;
        case 22: return 41000;
        case 23: return 50000;
        case 24: return 62000;
        case 25: return 75000;
        case 26: return 90000;
        case 27: return 105000;
        case 28: return 120000;
        case 29: return 135000;
        case 30: return 155000;
        default: return 0;
    }
}

const ActionViewComponent = (props: {
    attack: StatblockAction,
    onDeleteRequest?: () => void
}) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <div
            className={"transition-all duration-200 ease-in-out w-full flex flex-col rounded-xl overflow-hidden pl-3 " + (expanded ? "bg-neutral-100" : "")}
        >
            <div
                className="w-full font-black flex items-center justify-between text-sm"
            >
                <div className="flex items-center grow pr-2 p-1">{props.attack.name}</div>
                <button
                    className="flex items-center justify-center hover:bg-neutral-200 w-8 h-full"
                    onClick={() => setExpanded(!expanded)}
                >
                    {
                        expanded ? (
                            <span className="mso">arrow_upward</span>
                        ) : (
                            <span className="mso">arrow_downward</span>
                        )
                    }
                </button>
                <button
                    className="flex items-center justify-center hover:bg-neutral-200 w-8 h-full "
                    onClick={props.onDeleteRequest}
                >
                    <span className="mso">delete</span>
                </button>
            </div>
            {
                expanded ? (
                    <div className="w-full text-left pr-2 p-1">
                        {props.attack.description}
                    </div>
                ) : null
            }
        </div>
    )
}

const ActionEditorComponent = (props: {
    title: string,
    editMode: boolean,
    onProcess: (text: string, description: string) => void,
    actions: StatblockAction[]
    update: () => void
}) => {

    const inputTextRef = React.useRef<HTMLInputElement>(null);
    const inputDescriptionRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <UIGroup title={props.title} className="text-orange-600" />
            <div className="flex flex-col gap-1 w-full">
                {
                    props.editMode ? (
                        <div className="flex p-2 pl-3 bg-neutral-100 rounded-xl overflow-hidden">
                            <div className="grow flex-col items-start justify-center">
                                <input
                                    ref={inputTextRef}
                                    type="text"
                                    placeholder="Trait Name"
                                    className="bg-transparent focus:outline-none w-full"
                                />
                                <input
                                    ref={inputDescriptionRef}
                                    type="text"
                                    placeholder="Trait Description"
                                    className="bg-transparent focus:outline-none w-full"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    props.onProcess(inputTextRef.current!.value, inputDescriptionRef.current!.value);
                                }}
                                className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                            >
                                <span className="mso">add</span>
                            </button>
                        </div>
                    ) : null
                }
                <div className="flex flex-col gap-1">
                    {
                        props.actions.map((v, i) => {
                            return (
                                <ActionViewComponent
                                    attack={v}
                                    key={i}
                                    onDeleteRequest={() => {
                                        props.actions.splice(i, 1);
                                        props.update();
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export interface EnumEditorProps<T> {
    enumObj: object
    title: string,
    process: (v: T) => void,
    editMode: boolean,
    data: T[],
    update: () => void
    hideTitle?: boolean
}


export const EnumEditorComponent = <T extends unknown>(props: EnumEditorProps<T>) => {
    const damageSelectRef = React.useRef<HTMLSelectElement>(null);
    return (
        <>
            {
                !props.hideTitle ? (
                    <UIGroup title={props.title} className="text-orange-600" />
                ) : null
            }

            <div className="flex flex-col gap-1 w-full">
                {
                    props.editMode ? (
                        <div className={"flex rounded-xl overflow-hidden bg-neutral-100 " + (!props.hideTitle ? "pl-2" : "")}>
                            <select
                                className="grow focus:outline-none bg-transparent"
                                ref={damageSelectRef}
                            >
                                {
                                    Object.keys(
                                        props.enumObj
                                    ).filter(v => typeof v == "string").map((v, i) => {
                                        return <option key={i} value={v}>{v}</option>
                                    })
                                }
                            </select>
                            <button
                                onClick={() => {
                                    props.process(
                                        damageSelectRef.current!.value as unknown as T
                                    )
                                }}
                                className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                            >
                                <span className="mso">add</span>
                            </button>
                        </div>
                    ) : <></>
                }

                {
                    props.data.map((v, i) => {
                        return (
                            <div className="flex rounded-xl overflow-hidden" key={i}>
                                <div className={"grow flex items-center " + (!props.hideTitle ? "pl-3" : "pl-1")}>
                                    {v as unknown as string}
                                </div>
                                <button
                                    onClick={() => {
                                        props.data.splice(i, 1);
                                        props.update();
                                    }}
                                    className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                >
                                    <span className="mso">delete</span>
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

import CharacterIcon from "../../resources/placeholders/character.png?base64"
import Markdown from "marked-react";

export const RawStatblockComponent = (props: {
    createMode?: boolean,
    uniqueKey: number,
    statblock: Statblock | PlayerStatblock;
    player?: boolean;
    updateStatblock: (s: Statblock | PlayerStatblock) => void
}) => {
    const forceUpdate = useForceUpdate();
    const statRef = React.useRef(props.statblock);
    let statblock = statRef.current as Statblock;

    const update = () => {
        props.updateStatblock(statblock);
        forceUpdate();
    }

    const hpInputRef = React.useRef<HTMLInputElement>(null);
    const spellSelectRef = React.useRef<HTMLSelectElement>(null);

    if (!statblock && !props.player) {
        statblock = {
            ...constructDefaultStatblock(),
            name: props.statblock.name,
            size: props.statblock.size
        }
        props.updateStatblock(statblock);
    }

    const [editMode, setEditMode] = React.useState(props.createMode ?? false);

    return (
        <div className={"flex flex-col rounded-xl bg-neutral-100 gap-2 pointer-events-auto pb-3 " + (props.createMode ? "bg-white" : "")}>
            <div className="text-3xl h-56 w-full rounded-t-xl overflow-hidden" style={{
                backgroundImage: props.statblock.image != "" ? `url(${props.statblock.image})` : `url(${CharacterIcon})`,
                backgroundPosition: "top",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
            }} >
                <div className="flex items-end h-full w-full p-3 bg-gradient-to-b from-neutral-100/0 to-neutral-100">
                    <div className="flex flex-col items-start grow">
                        <input
                            type="text"
                            defaultValue={props.statblock.name}
                            onChange={(e) => {
                                statblock.name = e.target.value;
                                update()
                            }}
                            className="bg-transparent focus:outline-none w-full"
                        />
                        {
                            !props.player ? (
                                <div
                                    className="flex gap-2 text-xs w-full"
                                >
                                    <div>CR:</div>
                                    <input
                                        type="number"
                                        defaultValue={statblock.challengeRating ?? 0}
                                        onChange={(e) => {
                                            statblock.challengeRating = e.target.valueAsNumber;
                                            update()
                                        }}
                                        className="bg-transparent focus:outline-none w-full"
                                    />
                                    <div className="whitespace-nowrap">({CR2XP(statblock.challengeRating ?? 0)} XP)</div>
                                </div>
                            ) : null
                        }
                        <div className="text-xs flex">
                            {
                                props.uniqueKey > 0 && (
                                    <div className="pr-2">
                                        ID: {props.uniqueKey}
                                    </div>
                                )
                            }
                            {
                                props.createMode ? (
                                    null
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditMode(!editMode);
                                            update();
                                        }}
                                        className="flex items-center"
                                    >
                                        {
                                            editMode ? (
                                                <span className="msf">edit</span>
                                            ) : (
                                                <span className="mso">edit</span>
                                            )
                                        }
                                    </button>
                                )
                            }
                        </div>
                    </div>
                    {
                        statblock.image != "" ? (
                            <button
                                className="flex items-center justify-center hover:bg-neutral-200 p-2 text-base rounded-xl"
                                onClick={() => {
                                    statblock.image = "";
                                    update();
                                }}
                            >
                                <span className="mso">close</span>
                            </button>
                        ) : null
                    }
                    <button
                        className="flex items-center justify-center hover:bg-neutral-200 p-2 text-base rounded-xl"
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.onchange = (_e) => {
                                if (input.files && input.files.length > 0) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        if (e.target?.result) {
                                            statblock.image = e.target.result as string;
                                            update();
                                        }
                                    }
                                    reader.readAsDataURL(input.files[0]);
                                }
                            }
                            input.click();
                        }}
                    >
                        <span className="mso">image</span>
                    </button>
                </div>
            </div>

            {/* Description */}
            {
                editMode ? (
                    <>
                        <UIGroup title="Description" className="text-orange-600">
                        </UIGroup>
                        <div className="flex flex-col gap-1 w-full p-1 pl-3">
                            <textarea
                                className="text-xs w-8 text-start bg-transparent focus:outline-none w-full"
                                defaultValue={statblock.description}
                                placeholder="Description..."
                                onChange={(e) => {
                                    statblock.description = e.target.value;
                                    update()
                                }}
                            />
                        </div>
                    </>
                ) : (
                    statblock.description && statblock.description.length > 0 ? (
                        <>
                            <UIGroup title="Description" className="text-orange-600">
                            </UIGroup>
                            <div className="prose w-full p-1 pl-3">
                                <Markdown>{statblock.description}</Markdown>
                            </div>
                        </>
                    ) : null
                )
            }

            {
                !props.player ? (
                    <UIGroup title="Armor Class">
                        <div className="flex rounded-xl overflow-hidden">
                            <input
                                type="number"
                                className="text-xs w-8 text-center bg-transparent"
                                defaultValue={statblock.armorClass}
                                onChange={(e) => {
                                    statblock.armorClass = e.target.valueAsNumber;
                                    update()
                                }}
                            />
                        </div>
                    </UIGroup>
                ) : null
            }

            <UIGroup title="Size">
                <ToolButton
                    onClick={() => {
                        statblock.size = CreatureSize.Tiny;
                        update()
                    }}
                    active={statblock.size == CreatureSize.Tiny}
                >
                    <span className="mso text-xl">bug_report</span>
                </ToolButton>
                <ToolButton
                    onClick={() => {
                        statblock.size = CreatureSize.Small;
                        update()
                    }}
                    active={statblock.size == CreatureSize.Small}
                >
                    <span className="mso text-xl">crib</span>
                </ToolButton>
                <ToolButton
                    onClick={() => {
                        statblock.size = CreatureSize.Medium;
                        update()
                    }}
                    active={statblock.size == CreatureSize.Medium}
                >
                    <span className="mso text-xl">person</span>
                </ToolButton>
                <ToolButton
                    onClick={() => {
                        statblock.size = CreatureSize.Large;
                        update()
                    }}
                    active={statblock.size == CreatureSize.Large}
                >
                    <span className="mso text-xl">directions_car</span>
                </ToolButton>
                <ToolButton
                    onClick={() => {
                        statblock.size = CreatureSize.Huge;
                        update()
                    }}
                    active={statblock.size == CreatureSize.Huge}
                >
                    <span className="mso text-xl">home</span>
                </ToolButton>
                <ToolButton
                    onClick={() => {
                        statblock.size = CreatureSize.Gargantuan;
                        update()
                    }}
                    active={statblock.size == CreatureSize.Gargantuan}
                >
                    <span className="mso text-xl">domain</span>
                </ToolButton>
            </UIGroup>

            {
                !props.player ? (
                    <>
                        <div className="rounded-full overflow-hidden shadow mx-3">
                            <Tooltip
                                className="h-fit w-full"
                            >
                                <TooltipTarget>
                                    <div className="w-full flex h-4">
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
                                </TooltipTarget>
                                <TooltipContent>
                                    <div className="text-sm">HP: {statblock.hitPoints.current}</div>
                                    <div className="text-sm">THP: {statblock.hitPoints.temporary}</div>
                                    <div className="text-sm">MHP: {statblock.hitPoints.maximum}</div>
                                </TooltipContent>
                            </Tooltip>
                            <div className="w-full flex h-8">
                                <input
                                    defaultValue={0}
                                    className="grow text-center focus:outline-none"
                                    type="number"
                                    ref={hpInputRef}
                                ></input>
                                <Tooltip
                                    className="h-full"
                                >
                                    <TooltipTarget>
                                        <button
                                            className="w-8 h-full text-neutral-50 bg-green-500 flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
                                            onClick={() => {
                                                if (hpInputRef.current) {
                                                    statblock.hitPoints.current = Math.min(
                                                        statblock.hitPoints.current + hpInputRef.current.valueAsNumber,
                                                        statblock.hitPoints.maximum
                                                    )
                                                    update();
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">medication_liquid</span>
                                        </button>
                                    </TooltipTarget>
                                    <TooltipContent>
                                        Heal.
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip
                                    className="h-full"
                                >
                                    <TooltipTarget>
                                        <button
                                            className="w-8 h-full text-neutral-50 bg-red-500 flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
                                            onClick={() => {
                                                if (hpInputRef.current) {
                                                    if (statblock.hitPoints.temporary == undefined || statblock.hitPoints.temporary == 0) {
                                                        statblock.hitPoints.current = Math.max(
                                                            statblock.hitPoints.current - hpInputRef.current.valueAsNumber,
                                                            0
                                                        )
                                                    } else {
                                                        const tmp = statblock.hitPoints.temporary - hpInputRef.current.valueAsNumber;
                                                        if (tmp < 0) {
                                                            statblock.hitPoints.temporary = 0
                                                            statblock.hitPoints.current = Math.max(
                                                                statblock.hitPoints.current + tmp,
                                                                0
                                                            )
                                                        } else {
                                                            statblock.hitPoints.temporary = tmp;
                                                        }
                                                    }

                                                    update();
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">swords</span>
                                        </button>
                                    </TooltipTarget>
                                    <TooltipContent>
                                        Deal damage.
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip
                                    className="h-full"
                                >
                                    <TooltipTarget>
                                        <button
                                            className="w-8 h-full text-neutral-50 bg-yellow-800 flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
                                            onClick={() => {
                                                if (hpInputRef.current) {
                                                    statblock.hitPoints.temporary = hpInputRef.current.valueAsNumber + (
                                                        statblock.hitPoints.temporary ?? 0
                                                    )
                                                    update();
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">update</span>
                                        </button>
                                    </TooltipTarget>
                                    <TooltipContent>
                                        Add temporary hit points.
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip
                                    className="h-full"
                                >
                                    <TooltipTarget>
                                        <button
                                            className="w-8 h-full text-neutral-50 bg-black flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
                                            onClick={() => {
                                                if (hpInputRef.current) {
                                                    statblock.hitPoints.maximum = hpInputRef.current.valueAsNumber;
                                                    update()
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">fitness_center</span>
                                        </button>
                                    </TooltipTarget>
                                    <TooltipContent>
                                        Set maximum hit points.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>


                        <div className="rounded-xl overflow-hidden flex shadow mx-3">
                            {
                                Object.keys(statblock.stats).map((v, i) => {
                                    return (
                                        <div
                                            className="flex flex-col grow items-stretch text-center"
                                            key={i}
                                        >
                                            <div className="w-full bg-neutral-100 p-2">
                                                <div className="text-xl">
                                                    {(statblock.stats![v as keyof typeof Stat] / 2 - 5) > 0 ? "+" : ""}
                                                    {(statblock.stats![v as keyof typeof Stat] / 2 - 5).toFixed(0)}
                                                </div>
                                                <input
                                                    type="number"
                                                    className="text-xs w-8 text-center bg-transparent"
                                                    defaultValue={statblock.stats![v as keyof typeof Stat]}
                                                    onChange={(e) => {
                                                        statblock.stats![v as keyof typeof Stat] = e.target.valueAsNumber;
                                                        update()
                                                    }}
                                                />
                                            </div>
                                            <div className="w-full bg-neutral-50 p-2 text-sm">
                                                {v.substring(0, 3).toUpperCase()}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <UIGroup title="Saving Throws" className="text-orange-600">
                        </UIGroup>
                        <div className="rounded-xl overflow-hidden flex shadow mx-3">
                            {
                                Object.keys(statblock.savingThrows).map((v, i) => {
                                    return (
                                        <div
                                            className="flex flex-col grow items-stretch text-center"
                                            key={i}
                                        >
                                            <div className="w-full bg-neutral-100 p-1">
                                                <input
                                                    type="number"
                                                    className="text-xs w-6 text-center bg-transparent"
                                                    defaultValue={
                                                        (statblock.savingThrows![v as keyof typeof Stat]).toFixed(0)}
                                                    onChange={(e) => {
                                                        statblock.savingThrows![v as keyof typeof Stat] = e.target.valueAsNumber;
                                                        update()
                                                    }}
                                                />
                                            </div>
                                            <div className="w-full bg-neutral-50 p-1 text-xs">
                                                {v.substring(0, 3).toUpperCase()}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <UIGroup title="Speed" className="text-orange-600">
                        </UIGroup>
                        <div className="rounded-xl overflow-hidden flex shadow mx-3">
                            {
                                Object.keys(statblock.speed).map((v, i) => {
                                    return (
                                        <div
                                            className="flex flex-col grow items-stretch text-center"
                                            key={i}
                                        >
                                            <div className="w-full bg-neutral-100 p-1">
                                                <input
                                                    type="number"
                                                    className="text-xs w-6 text-center bg-transparent"
                                                    defaultValue={statblock.speed![v as keyof SpeedStat]}
                                                    onChange={(e) => {
                                                        statblock.speed![v as keyof SpeedStat] = e.target.valueAsNumber;
                                                        update()
                                                    }}
                                                />
                                            </div>
                                            <div className="w-full bg-neutral-50 p-1 text-xs">
                                                {v.substring(0, 3).toUpperCase()}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                        {
                            editMode || statblock.damageVulnerabilities.length > 0 ? (
                                <EnumEditorComponent
                                    enumObj={DamageType}
                                    title="Vulnerabilities"
                                    process={(damage) => {
                                        statblock.damageVulnerabilities.push(damage);
                                        update();
                                    }}
                                    editMode={editMode}
                                    data={statblock.damageVulnerabilities}
                                    update={update}
                                />
                            ) : null
                        }

                        {
                            editMode || statblock.damageResistances.length > 0 ? (
                                <EnumEditorComponent
                                    enumObj={DamageType}
                                    title="Resistances"
                                    process={(damage) => {
                                        statblock.damageResistances.push(damage);
                                        update();
                                    }}
                                    editMode={editMode}
                                    data={statblock.damageResistances}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Damage Immunities */}
                        {
                            editMode || statblock.damageImmunities.length > 0 ? (
                                <EnumEditorComponent
                                    enumObj={DamageType}
                                    title="Immunities"
                                    process={(damage) => {
                                        statblock.damageImmunities.push(damage);
                                        update();
                                    }}
                                    editMode={editMode}
                                    data={statblock.damageImmunities}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Condition Immunities */}
                        {
                            editMode || statblock.conditionImmunities.length > 0 ? (
                                <EnumEditorComponent
                                    enumObj={CreatureCondition}
                                    title="Condition Immunities"
                                    process={(condition) => {
                                        statblock.conditionImmunities.push(condition);
                                        update();
                                    }}
                                    editMode={editMode}
                                    data={statblock.conditionImmunities}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Actions */}

                        {
                            editMode || statblock.actions.length > 0 ? (
                                <ActionEditorComponent
                                    title="Actions"
                                    editMode={editMode}
                                    onProcess={(name, description) => {
                                        statblock.actions.push({
                                            name,
                                            description
                                        })
                                        update();
                                    }}
                                    actions={statblock.actions}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Legendary Actions */}
                        {
                            editMode || statblock.legendaryActions.length > 0 ? (
                                <ActionEditorComponent
                                    title="Legendary Actions"
                                    editMode={editMode}
                                    onProcess={(name, description) => {
                                        statblock.legendaryActions.push({
                                            name,
                                            description
                                        })
                                        update();
                                    }}
                                    actions={statblock.legendaryActions}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Reactions */}
                        {
                            editMode || statblock.reactions.length > 0 ? (
                                <ActionEditorComponent
                                    title="Reactions"
                                    editMode={editMode}
                                    onProcess={(name, description) => {
                                        statblock.reactions.push({
                                            name,
                                            description
                                        })
                                        update();
                                    }}
                                    actions={statblock.reactions}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Traits */}
                        {
                            editMode || statblock.reactions.length > 0 ? (
                                <ActionEditorComponent
                                    title="Traits"
                                    editMode={editMode}
                                    onProcess={(name, description) => {
                                        statblock.traits.push({
                                            name,
                                            description
                                        })
                                        update();
                                    }}
                                    actions={statblock.traits}
                                    update={update}
                                />
                            ) : null
                        }

                        {/* Spell Slots */}
                        {
                            editMode || statblock.spellSlots.reduce((a, b) => a + b, 0) > 0 ? (
                                <>
                                    <UIGroup title="Spell Slots" className="text-orange-600"></UIGroup>
                                    <div className="flex gap-1 w-full justify-center rounded-full shadow bg-white pt-2 pb-2">
                                        {
                                            statblock.spellSlots.map((v, i) => {
                                                return (
                                                    <div className="flex flex-col rounded-xl overflow-hidden" key={i}>
                                                        <div className="flex items-center">
                                                            <input
                                                                type="number"
                                                                className="text-sm w-8 text-center bg-transparent"
                                                                defaultValue={v}
                                                                onChange={(e) => {
                                                                    statblock.spellSlots[i] = e.target.valueAsNumber;
                                                                    update()
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="grow flex items-center pl-1 justify-center" style={{
                                                            fontSize: "0.6rem"
                                                        }}>
                                                            {i + 1} Lvl
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Spells / Option to add from database only! */}
                        {/** todo: UX and UI redesign */}
                        {
                            editMode || statblock.spells.length > 0 ? (
                                <>
                                    <UIGroup title="Spells" className="text-orange-600"></UIGroup>

                                    <div className="flex flex-col gap-1 w-full">
                                        {
                                            editMode ? (
                                                <div className="grow flex items-center justify-center rounded-xl bg-neutral-100 pl-2 overflow-hidden">
                                                    <select ref={spellSelectRef} className="bg-transparent focus:outline-none w-full h-full flex items-center justify-center p-1">
                                                        {
                                                            Database.getInstance().getSpells().map((v, i) => {
                                                                return <option key={i} value={i}>{v.name}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            statblock.spells.push(
                                                                structuredClone(
                                                                    Database.getInstance().getSpells()[spellSelectRef.current!.value as unknown as number]
                                                                )
                                                            );
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : null
                                        }
                                        <SpellList
                                            data={statblock.spells}
                                            searchBar={false}
                                            update={() => {
                                                update();
                                            }}
                                        />
                                        {/* {
                                            statblock.spells.map((v) => {
                                                return (
                                                    <SpellComponent
                                                        key={v.name}
                                                        data={v}
                                                        updateData={(_) => { }}
                                                    />
                                                )
                                            })
                                        } */}
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Senses + Passive Perception */}
                        <UIGroup title="Senses" className="text-orange-600"></UIGroup>
                        <div className="flex flex-col gap-1 w-full pl-2">
                            <div className="flex rounded-xl overflow-hidden">
                                <div className="grow flex items-center pl-1">
                                    Passive Perception
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        className="text-xs w-8 text-center bg-transparent"
                                        defaultValue={statblock.passivePerception}
                                        onChange={(e) => {
                                            statblock.passivePerception = e.target.valueAsNumber;
                                            update()
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                Object.keys(statblock.senses).map((v, i) => {
                                    return (
                                        <div className="flex rounded-xl overflow-hidden" key={i}>
                                            <div className="grow flex items-center pl-1">
                                                {v.charAt(0).toUpperCase() + v.slice(1)}
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    className="text-xs w-8 text-center bg-transparent"
                                                    defaultValue={statblock.senses[v as keyof typeof statblock.senses]}
                                                    onChange={(e) => {
                                                        statblock.senses[v as keyof typeof statblock.senses] = e.target.valueAsNumber;
                                                        update()
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* Languages */}
                        {
                            editMode || statblock.languages && statblock.languages.length > 0 ? (
                                <>
                                    <UIGroup title="Languages" className="text-orange-600">
                                    </UIGroup>
                                    <div className="flex flex-col gap-1 w-full p-1 pl-3">
                                        <input
                                            type="text"
                                            className="text-xs w-full text-start bg-transparent focus:outline-none w-full"
                                            defaultValue={statblock.languages}
                                            placeholder="Orkish, Elvish, ..."
                                            onChange={(e) => {
                                                statblock.languages = e.target.value;
                                                update()
                                            }}
                                        />
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Skills */}
                        {
                            editMode || statblock.skills && statblock.skills.length > 0 ? (
                                <>

                                    <UIGroup title="Skills" className="text-orange-600">
                                    </UIGroup>
                                    <div className="flex flex-col gap-1 w-full p-1 pl-3">
                                        <input
                                            type="text"
                                            className="text-xs w-8 text-start bg-transparent focus:outline-none w-full"
                                            defaultValue={statblock.skills}
                                            placeholder="Athletics +5, ..."
                                            onChange={(e) => {
                                                statblock.skills = e.target.value;
                                                update()
                                            }}
                                        />
                                    </div>
                                </>
                            ) : null

                        }
                    </>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export const NewStatblockComponent = (props: IAddComponent<Statblock>) => {
    const tempStatblock = React.useRef<Statblock>(constructDefaultStatblock());
    return (
        <div
            className="h-fit transition-all duration-200 ease-in-out rounded-xl shadow"
        >
            <RawStatblockComponent
                uniqueKey={-1}
                statblock={tempStatblock.current}
                updateStatblock={(s) => {
                    tempStatblock.current = s as Statblock;
                }}
                createMode={true}
                player={false}
            />
            <div className="w-full flex justify-end p-2">
                <button
                    className="rounded-xl text-white self-end p-2 pl-4 bg-orange-600 flex items-center"
                    onClick={() => {
                        props.onSubmit(structuredClone(tempStatblock.current));
                    }}
                >
                    Add <span className="mso px-2 p-1">add</span>
                </button>
            </div>
        </div>
    )
}

export const NewDBStatblockComponent = (props: IAddComponent<Statblock>) => {
    const tempStatblock = React.useRef<Statblock>(constructDefaultStatblock());
    const tabViewHandle = React.useRef<TabViewHandle>(null);
    const forceUpdate = useForceUpdate();
    return (
        <TabView
            ref={tabViewHandle}
            className="shadow-xl grow bg-neutral-200"
            tabClassName="overflow-y-scroll"
        >
            <Tab title="New Creature">
                <div
                    className="h-fit transition-all duration-200 ease-in-out rounded-xl shadow"
                >
                    <RawStatblockComponent
                        uniqueKey={-1}
                        statblock={tempStatblock.current}
                        updateStatblock={(s) => {
                            tempStatblock.current = s as Statblock;
                        }}
                    />
                    <div className="w-full flex justify-end p-2">
                        <button
                            className="rounded-xl text-white self-end p-2 pl-4 bg-orange-600 flex items-center"
                            onClick={() => {
                                props.onSubmit(structuredClone(tempStatblock.current));
                            }}
                        >
                            Add <span className="mso px-2 p-1">add</span>
                        </button>
                    </div>
                </div>
            </Tab>
            <Tab title="From DB">
                <StatblockList
                    data={Database.getInstance().getMonsters()}
                    update={forceUpdate}
                    onSelect={(statblock) => {
                        tempStatblock.current = structuredClone(statblock);
                        tabViewHandle.current?.setActiveIndex(0);
                        forceUpdate();
                    }}
                    searchBar
                    allowDelete
                    onUpdateData={(data) => {
                        Database.getInstance().updateMonsters(data);
                        forceUpdate();
                    }}
                />
            </Tab>
        </TabView>
    )
}

export const StatblockComponent = (props: IViewComponent<Statblock>) => {
    const notPlayer = props.data as Statblock;
    return (
        <RawStatblockComponent
            uniqueKey={-1}
            statblock={notPlayer}
            updateStatblock={props.updateData as (s: Statblock | PlayerStatblock) => void}
            player={false}
            createMode={false}
        />
    )
}


export const NewPlayerStatblockComponent = (props: IAddComponent<PlayerStatblock>) => {
    const tempStatblock = React.useRef<Statblock>(constructDefaultStatblock());
    return (
        <div
            className="h-fit transition-all duration-200 ease-in-out rounded-xl shadow"
        >
            <RawStatblockComponent
                uniqueKey={-1}
                statblock={tempStatblock.current}
                updateStatblock={(s) => {
                    tempStatblock.current = s as Statblock;
                }}
                createMode={true}
                player={true}
            />
            <div className="w-full flex justify-end p-2">
                <button
                    className="rounded-xl text-white self-end p-2 pl-4 bg-orange-600 flex items-center"
                    onClick={() => {
                        props.onSubmit(structuredClone(tempStatblock.current));
                    }}
                >
                    Add <span className="mso px-2 p-1">add</span>
                </button>
            </div>
        </div>
    )
}

export const PlayerStatblockComponent = (props: IViewComponent<PlayerStatblock>) => {
    const notPlayer = props.data as Statblock;
    return (
        <RawStatblockComponent
            uniqueKey={-1}
            statblock={notPlayer}
            updateStatblock={props.updateData as (s: Statblock | PlayerStatblock) => void}
            player={true}
            createMode={false}
        />
    )
}

export const PlayerStatblockList = (props: ITListComponentProps<PlayerStatblock>) => {
    return (
        <TListComponent<PlayerStatblock>
            allowDelete={props.allowDelete}
            viewComponent={PlayerStatblockComponent}
            newComponent={props.allowAdd ? NewPlayerStatblockComponent : undefined}
            onUpdateData={props.onUpdateData}
            onSelect={props.onSelect}
            searchBar={props.searchBar}
            data={props.data}
            update={props.update}
        />
    )
}

export const StatblockList = (props: ITListComponentProps<Statblock>) => {
    return (
        <TListComponent<Statblock>
            allowDelete={props.allowDelete}
            viewComponent={StatblockComponent}
            newComponent={props.allowAdd ? NewStatblockComponent : undefined}
            onUpdateData={props.onUpdateData}
            onSelect={props.onSelect}
            searchBar={props.searchBar}
            data={props.data}
            update={props.update}
        />
    )
}

export const DBStatblockList = (props: ITListComponentProps<Statblock>) => {
    return (
        <TListComponent<Statblock>
            allowDelete={props.allowDelete}
            viewComponent={StatblockComponent}
            newComponent={props.allowAdd ? NewDBStatblockComponent : undefined}
            onUpdateData={props.onUpdateData}
            onSelect={props.onSelect}
            searchBar={props.searchBar}
            data={props.data}
            update={props.update}
        />
    )
}