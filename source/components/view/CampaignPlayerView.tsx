import { IPlayerAppView } from "./IAppView";

import Icon from "../../../resources/icon.png?base64"
import { useCampaign } from "../../data/Campaign";
import { CalendarComponent } from "../CalendarComponent";

export const CampaignPlayerView = (props: IPlayerAppView & {
    image: string
}) => {

    const campaign = useCampaign();

    return (
        props.open ? (
            <div className="text-2xl bg-black grow basis-2" style={{
                minWidth: "50vw",
                maxWidth: "50vw",
                width: "50vw",
                backgroundImage: `url(${props.image != "" ? props.image : Icon})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <div className="h-full w-full backdrop-blur-xl p-10 flex flex-col items-center justify-center gap-3">
                    <img
                        className="w-full h-auto rounded-xl shadow-xl"
                        src={props.image != "" ? props.image : Icon}
                        alt="Campaign Image"
                    />
                    {
                        props.playerSettings.current.showDatetime && campaign?.current.calendar ? (
                            <div className="pointer-events-none text-base">
                                <CalendarComponent
                                    player
                                    campaign={campaign}
                                    update={() => { }}
                                />
                            </div>
                        ) : null
                    }
                </div>
            </div>
        ) : null
    )
}