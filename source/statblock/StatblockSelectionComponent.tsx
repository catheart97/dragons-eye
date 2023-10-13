import React from "react"
import { Statblock } from "./Statblock"
import { Database } from "../database/Database"
import { useForceUpdate } from "../utility"

export const StatblockSelectionComponent = (props: {
    onSelect: (statblock: Statblock) => void
}) => {
    const [filter, setFilter] = React.useState<string>('')
    const db = Database.getInstance();
    const data = db.getMonsters();

    const forceUpdate = useForceUpdate();

    return (
        <div className="flex flex-col w-full p-2 gap-2">
            <div className="flex w-full rounded-xl shadow items-center">
                <span className="mso p-2">search</span>
                <input
                    className="grow h-full"
                    type="text"
                    onChange={(e) => {
                        setFilter(e.target.value)
                    }}
                />
            </div>
            {
                data.map((statblock, i) => {

                    if (!statblock.name.toLowerCase().includes(filter.toLowerCase())) return null;

                    return (
                        <div className="flex rounded-xl overflow-hidden" key={statblock.name}>
                            <button
                                onClick={() => {
                                    props.onSelect(statblock)
                                }}
                                className="w-full grow p-2 flex items-center hover:bg-neutral-200 transition-all duration-200 ease-in-out"
                            >
                                {statblock.name}
                            </button>
                            <button
                                onClick={() => {
                                    data.splice(i, 1)
                                    db.updateMonsters(data);
                                    forceUpdate();
                                }}
                                className="transition-all duration-200 ease-in-out hover:bg-red-500 p-2 hover:text-white flex items-center"
                            >
                                <span className="mso">delete</span>
                            </button>
                        </div>
                    )
                })
            }
        </div>
    )
}