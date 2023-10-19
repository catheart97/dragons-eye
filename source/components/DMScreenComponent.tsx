import React from "react"
import { Campaign } from "../data/Campaign"
import { NoteList } from "./NoteComponent"
import { useForceUpdate } from "../utility"
import { Database } from "../data/Database"


export const DMScreenComponent = (props: {
    campaign: React.MutableRefObject<Campaign>
}) => {

    const forceUpdate = useForceUpdate();
    return (
        <div className="h-full w-full flex">
            <div className="h-full w-96">
                <div className="text-xl font-bold">Campaign Notes</div>
                <NoteList
                    data={props.campaign.current.notes}
                    update={forceUpdate}
                    alwaysExpanded
                />
            </div>
            <div className="h-full grow">
                <div className="text-xl font-bold">Database General Notes</div>
                <NoteList
                    className="flex-row flex-wrap items-stretch flex gap-2"
                    data={Database.getInstance().getNotes()}
                    onUpdateData={(data) => {
                        Database.getInstance().updateNotes(data)
                        forceUpdate();
                    }}
                    update={forceUpdate}
                    allowAdd
                    allowDelete
                    alwaysExpanded
                />
            </div>
        </div>
    )
}