import React from "react";
import { CreatureSize, DamageType, PlayerStatblock, Stat, Statblock, constructDefaultStatblock, CreatureCondition } from "./Statblock";
import { useForceUpdate } from "../utility";
import { Tooltip, TooltipContent, TooltipTarget } from "../ui/Tooltip";
import { UIGroup } from "../ui/UIGroup";
import { ToolButton } from "../ui/ToolButton";
import { Database } from "../database/Database";
import { SpellComponent } from "./SpellComponent";

export const StatblockComponent = (props: {
    createMode?: boolean,
    shortened?: boolean,
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
    const damageVulnerabilitiesSelectRef = React.useRef<HTMLSelectElement>(null);
    const damageResistancesSelectRef = React.useRef<HTMLSelectElement>(null);
    const damageImmunitiesSelectRef = React.useRef<HTMLSelectElement>(null);

    const conditionImmunitiesSelectRef = React.useRef<HTMLSelectElement>(null);
    const spellSelectRef = React.useRef<HTMLSelectElement>(null);

    const actionNameInputRef = React.useRef<HTMLInputElement>(null);
    const actionDescriptionInputRef = React.useRef<HTMLInputElement>(null);

    const legendaryActionInputRef = React.useRef<HTMLInputElement>(null);
    const legendaryActionDescriptionInputRef = React.useRef<HTMLInputElement>(null);

    const reactionNameInputRef = React.useRef<HTMLInputElement>(null);
    const reactionDescriptionInputRef = React.useRef<HTMLInputElement>(null);

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
        <div className={"flex flex-col p-2 rounded-xl gap-2 pointer-events-auto " + (props.createMode ? "bg-white" : "")}>
            <div className="text-3xl h-16 flex flex-col justify-center items-start" >
                <input
                    type="text"
                    defaultValue={props.statblock.name}
                    onChange={(e) => {
                        statblock.name = e.target.value;
                        update()
                    }}
                    className="bg-transparent focus:outline-none"
                />
                <div className="text-xs flex">
                    <div>
                        ID: {props.uniqueKey}
                    </div>
                    {
                        props.createMode ? (
                            null
                        ) : (
                            <button
                                onClick={() => {
                                    setEditMode(!editMode);
                                    update();
                                }}
                                className="flex items-center pl-2"
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
                        <div className="w-full rounded-full overflow-hidden shadow">
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


                        <div className="w-full rounded-xl overflow-hidden flex shadow">
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

                        <UIGroup title="Saving Throws">
                            <div className="w-full rounded-xl overflow-hidden flex shadow">
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
                        </UIGroup>

                        {
                            editMode || statblock.damageVulnerabilities.length > 0 ? (
                                <UIGroup title="Vulnerabilities">
                                    <div className="flex flex-col gap-1 w-44">
                                        {
                                            editMode ? (
                                                <div className="flex rounded-xl overflow-hidden">
                                                    <select
                                                        className="grow focus:outline-none"
                                                        ref={damageVulnerabilitiesSelectRef}
                                                    >
                                                        {
                                                            Object.keys(DamageType).filter(v => typeof v == "string").map((v, i) => {
                                                                return <option key={i} value={v}>{v}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            statblock.damageVulnerabilities.push(
                                                                damageVulnerabilitiesSelectRef.current!.value as DamageType
                                                            );
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : <></>
                                        }

                                        {
                                            statblock.damageVulnerabilities.map((v, i) => {
                                                return (
                                                    <div className="flex rounded-xl overflow-hidden" key={i}>
                                                        <div className="grow flex items-center pl-1">
                                                            {v}
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                statblock.damageVulnerabilities.splice(i, 1);
                                                                update();
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
                                </UIGroup>
                            ) : null
                        }

                        {
                            editMode || statblock.damageResistances.length > 0 ? (
                                <UIGroup title="Resistances">
                                    <div className="flex flex-col gap-1 w-44">
                                        {
                                            editMode ? (
                                                <div className="flex rounded-xl overflow-hidden">
                                                    <select
                                                        className="grow focus:outline-none"
                                                        ref={damageResistancesSelectRef}
                                                    >
                                                        {
                                                            Object.keys(DamageType).filter(v => typeof v == "string").map((v, i) => {
                                                                return <option key={i} value={v}>{v}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            statblock.damageResistances.push(
                                                                damageResistancesSelectRef.current!.value as DamageType
                                                            );
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : <></>
                                        }

                                        {
                                            statblock.damageResistances.map((v, i) => {
                                                return (
                                                    <div className="flex rounded-xl overflow-hidden">
                                                        <div className="grow flex items-center pl-1">
                                                            {v}
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                statblock.damageResistances.splice(i, 1);
                                                                update();
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
                                </UIGroup>
                            ) : null
                        }

                        {/* Damage Immunities */}
                        {
                            editMode || statblock.damageImmunities.length > 0 ? (
                                <UIGroup title="Immunities">
                                    <div className="flex flex-col gap-1 w-44">
                                        {
                                            editMode ? (
                                                <div className="flex rounded-xl overflow-hidden">
                                                    <select
                                                        className="grow focus:outline-none"
                                                        ref={damageImmunitiesSelectRef}
                                                    >
                                                        {
                                                            Object.keys(DamageType).filter(v => typeof v == "string").map((v, i) => {
                                                                return <option key={i} value={v}>{v}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            statblock.damageImmunities.push(
                                                                damageImmunitiesSelectRef.current!.value as DamageType
                                                            );
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : <></>
                                        }

                                        {
                                            statblock.damageImmunities.map((v, i) => {
                                                return (
                                                    <div className="flex rounded-xl overflow-hidden">
                                                        <div className="grow flex items-center pl-1">
                                                            {v}
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                statblock.damageImmunities.splice(i, 1);
                                                                update();
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
                                </UIGroup>
                            ) : null
                        }

                        {/* Condition Immunities */}
                        {
                            editMode || statblock.conditionImmunities.length > 0 ? (
                                <UIGroup title="Condition Immunities">
                                    <div className="flex flex-col gap-1 w-44">
                                        {
                                            editMode ? (
                                                <div className="flex rounded-xl overflow-hidden">
                                                    <select
                                                        className="grow focus:outline-none"
                                                        ref={conditionImmunitiesSelectRef}
                                                    >
                                                        {
                                                            Object.keys(CreatureCondition).filter(v => typeof v == "string").map((v, i) => {
                                                                return <option key={i} value={v}>{v}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            statblock.conditionImmunities.push(
                                                                conditionImmunitiesSelectRef.current!.value as CreatureCondition
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

                                        {
                                            statblock.conditionImmunities.map((v, i) => {
                                                return (
                                                    <div className="flex rounded-xl overflow-hidden">
                                                        <div className="grow flex items-center pl-1">
                                                            {v}
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                statblock.conditionImmunities.splice(i, 1);
                                                                update();
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
                                </UIGroup>
                            ) : null
                        }

                        {/* Actions */}

                        {
                            editMode || statblock.actions.length > 0 ? (
                                <>
                                    <UIGroup title="Actions" />
                                    <div className="flex flex-col gap-1 w-full">
                                        {
                                            editMode ? (
                                                <div className="flex">
                                                    <div className="grow flex-col items-start justify-center">
                                                        <input
                                                            ref={actionNameInputRef}
                                                            type="text"
                                                            placeholder="Action Name"
                                                            className="bg-transparent focus:outline-none w-full"
                                                        />
                                                        <input
                                                            ref={actionDescriptionInputRef}
                                                            type="text"
                                                            placeholder="Action Description"
                                                            className="bg-transparent focus:outline-none w-full"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            statblock.actions.push({
                                                                name: actionNameInputRef.current!.value,
                                                                description: actionDescriptionInputRef.current!.value
                                                            })
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : null
                                        }
                                        {
                                            statblock.actions.map((v) => {
                                                return (
                                                    <p>
                                                        <b className="font-bold">{v.name} </b>
                                                        {v.description}
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Legendary Actions */}
                        {
                            editMode || statblock.legendaryActions.length > 0 ? (
                                <>
                                    <UIGroup title="Legendary Actions" />
                                    <div className="flex flex-col gap-1 w-full">
                                        {
                                            editMode ? (
                                                <div className="flex">
                                                    <div className="grow flex-col items-start justify-center">
                                                        <input
                                                            ref={legendaryActionInputRef}
                                                            type="text"
                                                            placeholder="Action Name"
                                                            className="bg-transparent focus:outline-none w-full"
                                                        />
                                                        <input
                                                            ref={legendaryActionDescriptionInputRef}
                                                            type="text"
                                                            placeholder="Action Description"
                                                            className="bg-transparent focus:outline-none w-full"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            statblock.legendaryActions.push({
                                                                name: legendaryActionInputRef.current!.value,
                                                                description: legendaryActionDescriptionInputRef.current!.value
                                                            })
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : null
                                        }
                                        {
                                            statblock.legendaryActions.map((v) => {
                                                return (
                                                    <p>
                                                        <b className="font-bold">{v.name} </b>
                                                        {v.description}
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Reactions */}
                        {
                            editMode || statblock.reactions.length > 0 ? (
                                <>
                                    <UIGroup title="Reactions" />

                                    <div className="flex flex-col gap-1 w-full">
                                        {
                                            editMode ? (
                                                <div className="flex">
                                                    <div className="grow flex-col items-start justify-center">
                                                        <input
                                                            ref={reactionNameInputRef}
                                                            type="text"
                                                            placeholder="Action Name"
                                                            className="bg-transparent focus:outline-none w-full"
                                                        />
                                                        <input
                                                            ref={reactionDescriptionInputRef}
                                                            type="text"
                                                            placeholder="Action Description"
                                                            className="bg-transparent focus:outline-none w-full"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            statblock.reactions.push({
                                                                name: reactionNameInputRef.current!.value,
                                                                description: reactionDescriptionInputRef.current!.value
                                                            })
                                                            update();
                                                        }}
                                                        className="p-2 items-center flex hover:bg-neutral-100 transition-all duration-200 ease-in-out"
                                                    >
                                                        <span className="mso">add</span>
                                                    </button>
                                                </div>
                                            ) : null
                                        }
                                        {
                                            statblock.reactions.map((v) => {
                                                return (
                                                    <p>
                                                        <b className="font-bold">{v.name} </b>
                                                        {v.description}
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Spell Slots */}
                        {
                            editMode || statblock.spellSlots.reduce((a, b) => a + b, 0) > 0 ? (
                                <>
                                    <UIGroup title="Spell Slots"></UIGroup>
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
                                    <UIGroup title="Spells"></UIGroup>

                                    <div className="flex flex-col gap-1 w-full">
                                        {
                                            editMode ? (
                                                <div className="grow flex items-start justify-center rounded-xl shadow overflow-hidden">
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
                                        {
                                            statblock.spells.map((v) => {
                                                return (
                                                    <SpellComponent
                                                        spell={v}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            ) : null
                        }

                        {/* Senses + Passive Perception */}
                        <UIGroup title="Senses">
                            <div className="flex flex-col gap-1 w-full">
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
                        </UIGroup>

                        {/* Languages */}
                        <UIGroup title="Languages">
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

                        {/* Skills */}
                        <UIGroup title="Skills">
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

                        {/* Description */}
                        <UIGroup title="Description">
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
                    <></>
                )
            }
        </div>
    )
}
