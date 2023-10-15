import { Campaign } from "../campaign/Campaign";
import { useForceUpdate } from "../utility";
import { CampaignDMView } from "./CampaignDMView";
import { CampaignPlayerView } from "./CampaignPlayerView";
import { IAppView } from "./IAppView";

export const CampaignApp = (props: IAppView & {
    campaign: React.MutableRefObject<Campaign>
}) => {

    const forceUpdate = useForceUpdate();
    const update = () => {
        forceUpdate();
    }

    return (
        <div className={
            "flex"
        }>
            <CampaignDMView 
                campaign={props.campaign}
                dialogHandle={props.dialogHandle}
                update={update}
            />
            <CampaignPlayerView
                open={props.playerViewOpen}
                update={update}
            />
        </div>
    )
}