import React from "react"
import { Campaign } from "../data/Campaign"
import { DialogHandle } from "./ui/Dialog"
import { useForceUpdate } from "../utility"

export const JournalComponent = (props: {
    campaign: React.MutableRefObject<Campaign>
    className?: string
    dialogHandle?: React.RefObject<DialogHandle>
    update: () => void
}) => {

    if (props.campaign.current.journal == undefined) {
        props.campaign.current.journal = []
    }

    const forceUpdate = useForceUpdate();

    let toRender = props.campaign.current.journal;
    if (props.dialogHandle) {
        toRender = props.campaign.current.journal.slice(Math.max(0, props.campaign.current.journal.length - 2));
    }

    return (
        <div
            className={
                [
                    props.dialogHandle ? "h-24 w-72 h-24 rounded-full bg-neutral-50/80" : "h-full w-full",
                    "flex flex-col items-center justify-end  backdrop-blur text-neutral-800 overflow-hidden",
                    props.className
                ].join(" ")
            }
        >
            <input
                type="text"
                className={[
                    "w-full p-2 h-fit bg-white focus:outline-none",
                    props.dialogHandle ? "px-12" : "rounded-full px-4"
                ].join(" ")}
                placeholder="Type to add to journal..."
                onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        props.campaign.current.journal!.push((e.target as HTMLInputElement).value);
                        props.update();
                        forceUpdate();
                        (e.target as HTMLInputElement).value = "";
                    }
                }}
            />
            <div className={[
                "flex w-full grow h-0 p-1",
                props.dialogHandle ? "px-12 text-xs" : "",
            ].join(" ")}>
                <div className={"grow overflow-y-scroll flex flex-col-reverse justify-end gap-2  " + (props.dialogHandle ? "justify-center" : "py-2")}>
                    {
                        toRender.map((j, i) =>
                            <div key={i} className="flex w-full items-center gap-1">
                                <button
                                    className="hover:bg-orange-600 hover:text-white rounded-full px-2 p-1 focus:outline-none transition-all duration-200 ease-in-out flex items-center"
                                    onClick={() => {
                                        props.campaign.current.journal!.splice(props.campaign.current.journal!.length - 2 + i, 1);
                                        props.update();
                                        forceUpdate();
                                    }}
                                >
                                    <span className="mso">delete</span>
                                </button>
                                <div>{j}</div>
                            </div>
                        )

                    }
                </div>
                {
                    props.dialogHandle ? (
                        <button
                            className="p-2"
                            onClick={() => {
                                props.dialogHandle?.current?.open(
                                    <JournalComponent
                                        campaign={props.campaign}
                                        update={() => {
                                            props.update()
                                            props.dialogHandle?.current?.forceUpdate()
                                        }}
                                    />,
                                    undefined,
                                    "Journal",
                                    true
                                )
                            }}
                        >
                            <span className="mso">ungroup</span>
                        </button>
                    ) : null
                }
            </div>
        </div>
    )
}