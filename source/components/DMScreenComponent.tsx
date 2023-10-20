import React from "react"
import { CampaignContext } from "../data/Campaign"
import { Database } from "../data/Database"
import { useForceUpdate } from "../utility"
import { NoteList } from "./NoteComponent"
import { Dialog, DialogHandle } from "./ui/Dialog"


export const DMScreenComponent = () => {

    const forceUpdate = useForceUpdate();

    const campaign = React.useContext(CampaignContext);
    const dialogHandle = React.useRef<DialogHandle>(null);

    return (
        <div className="h-full w-full flex">
            {
                campaign ? (
                    <div className="h-full w-96">
                        <div className="text-xl font-bold">Campaign Notes</div>
                        <NoteList
                            data={campaign.current.notes}
                            update={forceUpdate}
                            // alwaysExpanded
                            dialogHandle={dialogHandle}
                        />
                    </div>
                ) : null
            }
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
                    // alwaysExpanded
                    dialogHandle={dialogHandle}
                />
            </div>
            <Dialog ref={dialogHandle}></Dialog>
        </div>
    )
}