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
        <div className={
            "flex"
        }>
            <CampaignDMView 
                loadCampaignBoard={props.loadCampaignBoard}
                campaign={props.campaign}
                dialogHandle={props.dialogHandle}
                update={update}
                setImage={setImage}
            />
            <CampaignPlayerView
                open={props.playerViewOpen}
                update={update}
                image={image}
            />
        </div>
    )
}