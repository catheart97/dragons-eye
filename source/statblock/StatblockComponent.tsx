import React from "react";
import { CreatureSize, PlayerStatblock, Stat, Statblock, constructDefaultStatblock } from "./Statblock";
import { useForceUpdate } from "../utility";
import { Tooltip, TooltipContent, TooltipTarget } from "../ui/Tooltip";
import { UIGroup } from "../ui/UIGroup";
import { ToolButton } from "../ui/ToolButton";

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

    if (!statblock && !props.player) {
        statblock = {
            ...constructDefaultStatblock(),
            name: props.statblock.name,
            size: props.statblock.size
        }
        props.updateStatblock(statblock);
    }

    return (
        <div className={"flex flex-col p-2 rounded-xl gap-2 pointer-events-auto " + (props.createMode ? "bg-white" : "")}>
            <div className="text-3xl h-16 flex flex-col justify-center" >
                <input
                    type="text"
                    defaultValue={props.statblock.name}
                    onChange={(e) => {
                        statblock.name = e.target.value;
                        update()
                    }}
                    className="bg-transparent focus:outline-none"
                />
                <div className="text-xs">ID: {props.uniqueKey}</div>
            </div>


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
                        <div className="w-full rounded-full overflow-hidden">
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


                        <div className="w-full rounded-xl overflow-hidden flex">
                            {
                                Object.keys(statblock.stats).map((v, i) => {
                                    return (
                                        <div className="flex flex-col grow items-stretch text-center" key={i}>
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

                    </>
                ) : (
                    <></>
                )
            }
        </div>
    )
}
