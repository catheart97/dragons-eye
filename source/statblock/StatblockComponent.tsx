import React from "react";
import { PlayerStatblock, Stat, Statblock } from "./Statblock";
import { useForceUpdate } from "../utility";

export const StatblockComponent = (props: {
    uniqueKey: number,
    statblock: Statblock | PlayerStatblock;
    updateStatblock: (s: Statblock | PlayerStatblock) => void
}) => {
    const forceUpdate = useForceUpdate();
    const statRef = React.useRef(props.statblock);
    const statblock = statRef.current as Statblock;

    const hpInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col p-2 rounded-xl gap-2 pointer-events-auto">
            <div className="text-3xl h-16 flex flex-col justify-center" >
                {props.statblock.name}
                <div className="text-xs">ID: {props.uniqueKey}</div>
            </div>
            {
                statblock ? (
                    <>
                        {
                            <>
                                <div className="w-full rounded-full overflow-hidden">
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
                                    <div className="w-full flex h-8">
                                        <input
                                            defaultValue={0}
                                            className="grow text-center"
                                            type="number"
                                            ref={hpInputRef}
                                        ></input>
                                        <button 
                                            className="w-8 text-neutral-50 bg-green-500 flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
                                            onClick={() => {
                                                if (hpInputRef.current) {
                                                    statblock.hitPoints.current = Math.min(
                                                        statblock.hitPoints.current + hpInputRef.current.valueAsNumber,
                                                        statblock.hitPoints.maximum
                                                    )
                                                    props.updateStatblock(statblock);
                                                    forceUpdate();
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">medication_liquid</span>
                                        </button>
                                        <button 
                                            className="w-8 text-neutral-50 bg-red-500 flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
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

                                                    props.updateStatblock(statblock);
                                                    forceUpdate();
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">swords</span>
                                        </button>
                                        <button 
                                            className="w-8 text-neutral-50 bg-yellow-800 flex items-center justify-center hover:scale-110 transition-all duration-200 ease-in-out"
                                            onClick={() => {
                                                if (hpInputRef.current) {
                                                    statblock.hitPoints.temporary = hpInputRef.current.valueAsNumber + (
                                                        statblock.hitPoints.temporary ?? 0
                                                    )
                                                    props.updateStatblock(statblock);
                                                    forceUpdate();
                                                }
                                            }}
                                        >
                                            <span className="text-sm mso">update</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            statblock.stats ? (
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
                                                                props.updateStatblock(props.statblock);
                                                                forceUpdate();
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
                            ) : undefined
                        }
                    </>
                ) : (
                    <></>
                )
            }
        </div>
    )
}
