import { IPlayerAppView } from "./IAppView";

import Icon from "../../../resources/icon.png"

export const CampaignPlayerView = (props: IPlayerAppView & {
    image: string
}) => {
    return (
        props.open ? ( 
            <div className="text-2xl bg-black h-screen flex items-center justify-center relative grow basis-2 p-6" style={{
                minWidth: "50vw",
                maxWidth: "50vw",
                width: "50vw",
            }}>
                <img 
                    className="w-full h-auto rounded-xl shadow-xl"
                    src={props.image != "" ? props.image : Icon}
                    alt="Campaign Image"
                />
            </div>
        ) : null
    )
}