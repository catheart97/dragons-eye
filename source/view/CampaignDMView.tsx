import { Campaign } from "../campaign/Campaign";
import { Dialog } from "../ui/Dialog";
import { IDMAppView } from "./IAppView";

import Icon from "../../resources/icon.png"
import React from "react";
import { UIGroup } from "../ui/UIGroup";
import { TextInput } from "../ui/TextInput";

export const CampaignDMView = (props: IDMAppView & {
    campaign: React.MutableRefObject<Campaign>
}) => {
    const [selectedAdventure, setSelectedAdventure] = React.useState<number>(0);
    return (
        <>
            <div className='w-full grow h-screen min-h-screen max-h-screen overflow-hidden relative flex basis-1 border-r-4 border-orange-600 grow basis-2' style={{
                minWidth: "50vw!important"
            }}>
                <div className="basis-2/12 max-w-44 bg-neutral-100 shadow h-full flex flex-col gap-2 p-4">

                    <button
                        className="w-full h-auto"
                        onClick={() => {
                            // open file dialog 
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.png,.jpg,.jpeg,.gif';
                            input.onchange = (e: any) => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onloadend = () => {
                                    props.campaign.current.image = reader.result?.toString();
                                    props.update();
                                    input.remove();
                                }
                            }
                            input.click();
                        }}
                    >
                        <img
                            className="w-full h-auto rounded-xl shadow-xl"
                            src={props.campaign.current.image ?? Icon}
                            alt="Campaign Image"
                        />
                    </button>

                    <input
                        type="text"
                        className="text-xl focus:outline-none bg-transparent mt-4"
                        defaultValue={props.campaign.current.title}
                        onChange={(e) => {
                            props.campaign.current.title = e.target.value;
                            props.update();
                        }}
                    />

                    <div className="flex items-center">
                        <div className="text-orange-600 grow">Adventures</div>
                        <button className="rounded-xl p-2 flex items-center justify-center hover:bg-neutral-200 ease-in-out duration-200 transition-all" onClick={() => {
                            let name = "New Adventure";
                            props.dialogHandle.current?.open((
                                <div className="w-full flex flex-col">
                                    <UIGroup title="Name">
                                        <TextInput
                                            defaultValue={name}
                                            onChange={(e) => {
                                                name = e.target.value;
                                            }}
                                        />
                                    </UIGroup>
                                </div>
                            ), {
                                success: () => {
                                    props.campaign.current.adventures.push({
                                        title: name,
                                        npcs: [],
                                        boards: []
                                    });
                                    props.update();
                                },
                                failure: () => {

                                }
                            }, "New Adventure"
                            )
                        }}>
                            <span className="mso">add</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-1 w-full grow shrink overflow-y-scroll">
                        {
                            props.campaign.current.adventures.map((adventure, i) => {
                                return (
                                    <button 
                                        className={"h-32 rounded-xl text-white font-black transition-all duration-200 ease-in-out bg-neutral-200 shadow shrink-0 overflow-hidden " + (selectedAdventure == i ? "saturate-100" : "saturate-0 hover:saturate-100")} 
                                        key={adventure.title}
                                        style={{
                                            backgroundImage: `url(${adventure.image ?? Icon})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center"
                                        }}
                                        onClick={() => {
                                            if (i == selectedAdventure) {
                                                // change image 
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = '.png,.jpg,.jpeg,.gif';
                                                input.onchange = (e: any) => {
                                                    const file = e.target.files[0];
                                                    const reader = new FileReader();
                                                    reader.readAsDataURL(file);
                                                    reader.onloadend = () => {
                                                        adventure.image = reader.result?.toString();
                                                        props.update();
                                                        input.remove();
                                                    }
                                                }
                                                input.click();
                                            } else {
                                                setSelectedAdventure(i);
                                            }
                                        }}
                                    >
                                        <div className="h-full w-full bg-gradient-to-t from-black/80 to-black/20 flex items-end p-3">
                                            {adventure.title}
                                        </div>
                                    </button>
                                )
                            })
                        }
                    </div>

                </div>
                <div className="basis-10/12 bg-black h-full flex flex-col">
                    {
                        props.campaign.current.adventures.length > selectedAdventure ? (
                            <div className="w-full h-full flex flex-col gap-3">
                                <div className="h-44 p-4 flex items-center">
                                    <input 
                                        type="text"
                                        className="text-3xl text-white font-black focus:outline-none bg-transparent"
                                        value={props.campaign.current.adventures[selectedAdventure].title}
                                        onChange={(e) => {
                                            props.campaign.current.adventures[selectedAdventure].title = e.target.value;
                                            props.update();
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center">
                                <div className="text-3xl text-white font-black">Select an adventure</div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Dialog ref={props.dialogHandle} />
        </>
    )
}