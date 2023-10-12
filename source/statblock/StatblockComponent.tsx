import React from "react";
import { PlayerStatblock, Statblock } from "./Statblock";

export const StatblockComponent = (props: {
    statblock: Statblock | PlayerStatblock;
}) => {

    const statblock = props.statblock as Statblock;
    return (
        <div className="flex flex-col rounded-xl">
            <div className="text-3xl" >{props.statblock.name}</div>
            {
                statblock ? (
                    <>
                        <div className="text-sm">{statblock.type ?? "" + statblock.alignment ?? ""}</div>
                    </>
                ) : (
                    <></>
                )
            }
        </div>
    )
}
