import { IPlayerAppView } from "./IAppView";

import Icon from "../../resources/icon.png"

export const CampaignPlayerView = (props: IPlayerAppView) => {
    return (
        props.open ? ( 
            <div className="text-2xl bg-black h-screen flex items-center justify-center relative grow basis-2" style={{
                minWidth: "50vw",
                maxWidth: "50vw",
                width: "50vw",
            }}>
                <img 
                    className="w-96 h-96 rounded-xl shadow-xl"
                    src={Icon}
                    alt="Campaign Image"
                />
            </div>
        ) : null
    )
}