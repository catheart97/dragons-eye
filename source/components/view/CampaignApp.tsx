import React from "react";
import { Board } from "../../data/Board";
import { Campaign } from "../../data/Campaign";
import { useForceUpdate } from "../../utility";
import { CampaignDMView } from "./CampaignDMView";
import { CampaignPlayerView } from "./CampaignPlayerView";
import { IAppView } from "./IAppView";

export const CampaignApp = (props: IAppView & {
    campaign: React.MutableRefObject<Campaign>
    loadCampaignBoard: (board: Board) => void
}) => {

    const [image, setImage] = React.useState<string>("");
    const forceUpdate = useForceUpdate();
    const update = () => {
        forceUpdate();
    }

    return (
        <div className="flex flex-col h-screen min-h-screen max-h-screen overflow-hidden">

            <div
                style={{
                    height: props.isMac ? 38 : 0,
                    width: "100%"
                }}
                className="flex justify-end items-center px-2 overflow-hidden transition-height duration-300 ease-in-out"
            >
                <div className="mac h-full grow flex justify-center items-center text-sm">
                    {props.campaign.current!.title} - Dragon's Eye
                </div>
                <button
                    className=" h-full flex items-center"
                    onClick={() => {
                        props.playerViewOpen.current = !props.playerViewOpen.current;
                        forceUpdate();
                    }}
                >
                    <span className="mso flex text-xl">{props.playerViewOpen.current ? "right_panel_close" : "right_panel_open"}</span>
                </button>
            </div>

            <div className="flex grow h-0">
                <CampaignDMView
                    loadCampaignBoard={props.loadCampaignBoard}
                    campaign={props.campaign}
                    dialogHandle={props.dialogHandle}
                    update={update}
                    setImage={setImage}
                />
                <CampaignPlayerView
                    open={props.playerViewOpen.current}
                    update={update}
                    image={image}
                />
            </div>
        </div>
    )
}