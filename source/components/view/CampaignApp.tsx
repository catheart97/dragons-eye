import React from "react";
import { Board } from "../../data/Board";
import { Campaign } from "../../data/Campaign";
import { useForceUpdate } from "../../utility";
import { CampaignDMView } from "./CampaignDMView";
import { CampaignPlayerView } from "./CampaignPlayerView";
import { IAppView, PlayerViewSettings } from "./IAppView";

export const CampaignApp = (props: IAppView & {
    campaign: React.MutableRefObject<Campaign>
    loadCampaignBoard: (board: Board) => void
}) => {

    const playerSettings = React.useRef<PlayerViewSettings>({
        initiativeEnabled: false,
        showDatetime: false,
        importanceRect: null
    });

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
            </div>

            <div className={
                [
                    "grid grid-rows-1 grow h-0",
                    props.playerViewOpen.current ? "grid-cols-2" : "grid-cols-1"
                ].join(" ")
            }>
                <CampaignDMView
                    loadCampaignBoard={props.loadCampaignBoard}
                    campaign={props.campaign}
                    dialogHandle={props.dialogHandle}
                    update={update}
                    setImage={setImage}
                    playerViewOpen={props.playerViewOpen}
                    playerSettings={playerSettings}
                />
                <CampaignPlayerView
                    open={props.playerViewOpen.current}
                    update={update}
                    image={image}
                    playerSettings={playerSettings}
                />
            </div>
        </div>
    )
}