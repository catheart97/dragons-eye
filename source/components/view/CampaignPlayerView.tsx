import { IPlayerAppView } from "./IAppView";

import Icon from "../../../resources/icon.png?base64"

export const CampaignPlayerView = (props: IPlayerAppView & {
    image: string
}) => {
    return (
        props.open ? (
            <div className="text-2xl bg-black h-screen grow basis-2" style={{
                minWidth: "50vw",
                maxWidth: "50vw",
                width: "50vw",
                backgroundImage: `url(${props.image != "" ? props.image : Icon})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <div className="h-full w-full backdrop-blur-xl p-10 flex items-center justify-center">
                    <img
                        className="w-full h-auto rounded-xl shadow-xl"
                        src={props.image != "" ? props.image : Icon}
                        alt="Campaign Image"
                    />
                </div>
            </div>
        ) : null
    )
}