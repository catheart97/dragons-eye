import { Campaign } from "../../data/Campaign";
import { Dialog } from "../ui/Dialog";
import { IDMAppView } from "./IAppView";


import AdventureIcon from "../../../resources/placeholders/adventure.png?base64";
import CampaignIcon from "../../../resources/placeholders/campaign.png?base64";
import CharacterIcon from "../../../resources/placeholders/character.png?base64";

import React, { useEffect } from "react";
import { Board } from "../../data/Board";
import { Database } from "../../data/Database";
import { EncounterList } from "../EncounterComponent";
import { ItemList } from "../ItemComponent";
import { SpellList } from "../SpellComponent";
import { DBStatblockList, PlayerStatblockList, StatblockList } from "../StatblockComponent";
import { Dashboard, DashboardElement, IDashboardElement } from "../ui/Dashboard";
import { Tab, TabView } from "../ui/TabView";
import { TextInput } from "../ui/TextInput";
import { UIGroup } from "../ui/UIGroup";
import { NoteList } from "../NoteComponent";


export const CompendiumDashboardElement = (props: IDashboardElement & {
    update: () => void
    setImage?: (image: string) => void
}) => {
    return (
        <DashboardElement title="Compendium">
            <TabView
                className="shadow xl grow bg-neutral-200"
                tabClassName="overflow-y-scroll"
            >
                <Tab title="Spells">
                    <SpellList
                        allowDelete
                        allowAdd
                        searchBar
                        onUpdateData={(data) => {
                            Database.getInstance().updateSpells(data);
                            props.update();
                        }}
                        data={Database.getInstance().getSpells()}
                        update={props.update}
                    />
                </Tab>
                <Tab title="Monsters">
                    <StatblockList
                        allowDelete
                        allowAdd
                        searchBar
                        onUpdateData={(data) => {
                            Database.getInstance().updateMonsters(data);
                            props.update();
                        }}
                        data={Database.getInstance().getMonsters()}
                        update={props.update}
                        onSelect={(statblock) => {
                            if (props.setImage) {
                                props.setImage(statblock.image != "" ? statblock.image : CharacterIcon);
                            }
                        }}
                    />
                </Tab>
                <Tab title="Items">
                    <ItemList
                        allowDelete
                        searchBar
                        onUpdateData={(data) => {
                            Database.getInstance().updateItems(data);
                            props.update();
                        }}
                        data={Database.getInstance().getItems()}
                        update={props.update}
                    />
                </Tab>
            </TabView>
        </DashboardElement>
    )
}

export const CampaignDMView = (props: IDMAppView & {
    campaign: React.MutableRefObject<Campaign>
    loadCampaignBoard: (board: Board) => void
    setImage: (image: string) => void
}) => {
    const [selectedAdventure, setSelectedAdventure] = React.useState<number>(-1);

    useEffect(() => {
        props.setImage(props.campaign.current.image ?? CampaignIcon);
    }, [])

    return (
        <>
            <div className='w-full grow h-screen min-h-screen max-h-screen overflow-hidden relative flex basis-1 border-r-4 border-orange-600 grow basis-2' style={{
                minWidth: "50vw!important"
            }}>
                <div className="w-full h-full flex">
                    <div className="basis-2/12 max-w-44 bg-neutral-100 shadow h-full flex flex-col gap-2 p-4">

                        <img
                            className="w-full h-auto rounded-xl shadow-xl"
                            src={props.campaign.current.image ?? CampaignIcon}
                            alt="Campaign Image"
                        />

                        <div
                            className="text-xl focus:outline-none bg-transparent mt-4 select-none"
                        >
                            {props.campaign.current.title}
                        </div>

                        <button
                            className={[
                                "w-full py-2 rounded-xl text-start text-orange-600 transition-all duration-200 ease-in-out shrink-0 overflow-hidden hover:bg-neutral-100",
                                selectedAdventure == -1 ? "saturate-100" : "saturate-0 hover:saturate-100"
                            ].join(" ")}
                            onClick={() => {
                                setSelectedAdventure(-1);
                                props.setImage(props.campaign.current.image ?? CampaignIcon)
                            }}
                        >
                            Overview
                        </button>

                        <div className="flex items-center">
                            <div className={"text-orange-600 grow " + (selectedAdventure >= 0 ? "saturate-100" : "saturate-0")}>Adventures</div>
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
                                            encounters: [],
                                            notes: []
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
                                                backgroundImage: "url('" + (adventure.image ?? AdventureIcon) + "')",
                                                backgroundSize: "cover",
                                                backgroundPosition: "top"
                                            }}
                                            onClick={() => {
                                                setSelectedAdventure(i);
                                                props.setImage(adventure.image ?? AdventureIcon);
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
                            props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1 ? (
                                <div className="w-full h-full flex flex-col gap-3">
                                    <div className="h-44 p-4 flex items-center shrink-0 gap-6">
                                        <button
                                            className="w-auto h-full"
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
                                                        props.campaign.current.adventures[selectedAdventure].image = reader.result?.toString();
                                                        props.setImage(props.campaign.current.adventures[selectedAdventure].image ?? AdventureIcon);
                                                        props.update();
                                                        input.remove();
                                                    }
                                                }
                                                input.click();
                                            }}
                                        >
                                            <img
                                                className="w-auto h-full rounded-xl shadow-xl"
                                                src={props.campaign.current.adventures[selectedAdventure].image ?? AdventureIcon}
                                            />
                                        </button>
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
                                    <div className="grow w-full overflow-x-scroll">
                                        <Dashboard>
                                            <CompendiumDashboardElement
                                                update={props.update}
                                            >
                                            </CompendiumDashboardElement>
                                            <DashboardElement>
                                                <div className="text-xl font-bold">Adventure Notes</div>
                                                <NoteList
                                                    data={props.campaign.current.adventures[selectedAdventure].notes}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.adventures[selectedAdventure].notes = data;
                                                        props.update();
                                                    }}
                                                    setImage={props.setImage}
                                                />
                                                <div className="text-xl font-bold">Notes</div>
                                                <NoteList
                                                    setImage={props.setImage}
                                                    data={props.campaign.current.notes}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.notes = data;
                                                        props.update();
                                                    }}
                                                />
                                            </DashboardElement>
                                            <DashboardElement>
                                                <div className="text-xl font-bold">Players</div>
                                                <PlayerStatblockList
                                                    data={props.campaign.current.players}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.players = data;
                                                        props.update();
                                                    }}
                                                    update={props.update}
                                                />
                                                <div className="text-xl font-bold">NPCs</div>
                                                <DBStatblockList
                                                    data={props.campaign.current.npcs}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.npcs = data;
                                                        props.update();
                                                    }}
                                                />
                                                <div className="text-xl font-bold">Adventure NPCs</div>
                                                <DBStatblockList
                                                    data={props.campaign.current.adventures[selectedAdventure].npcs}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.adventures[selectedAdventure].npcs = data;
                                                        props.update();
                                                    }}
                                                />
                                            </DashboardElement>
                                            <DashboardElement>
                                                <div className="text-xl font-bold">Adventure Encounters</div>
                                                <EncounterList
                                                    data={props.campaign.current.adventures[selectedAdventure].encounters}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.adventures[selectedAdventure].encounters = data;
                                                        props.update();
                                                    }}
                                                    onSelect={(encounter) => {
                                                        const board = encounter.board;
                                                        props.loadCampaignBoard(board);
                                                    }}
                                                />
                                                <div className="text-xl font-bold">Adventure Encounters</div>
                                                <EncounterList
                                                    data={props.campaign.current.encounters}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.encounters = data;
                                                        props.update();
                                                    }}
                                                    onSelect={(encounter) => {
                                                        const board = encounter.board;
                                                        props.loadCampaignBoard(board);
                                                    }}
                                                />
                                            </DashboardElement>
                                        </Dashboard>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col gap-3">
                                    <div className="h-44 p-4 flex items-center shrink-0 gap-6">
                                        <button
                                            className="w-auto h-full"
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
                                                        props.setImage(props.campaign.current.image ?? CampaignIcon);
                                                        props.update();
                                                        input.remove();
                                                    }
                                                }
                                                input.click();
                                            }}
                                        >
                                            <img
                                                className="w-auto h-full rounded-xl shadow-xl"
                                                src={props.campaign.current.image ?? CampaignIcon}
                                                alt="Campaign Image"
                                            />
                                        </button>
                                        <input
                                            type="text"
                                            className="text-3xl text-white font-black focus:outline-none bg-transparent"
                                            value={props.campaign.current.title}
                                            onChange={(e) => {
                                                props.campaign.current.title = e.target.value;
                                                props.update();
                                            }}
                                        />
                                    </div>
                                    <div className="grow w-full overflow-x-scroll">
                                        <Dashboard>
                                            <CompendiumDashboardElement
                                                update={props.update}
                                                setImage={props.setImage}
                                            >
                                            </CompendiumDashboardElement>
                                            <DashboardElement title="Notes">
                                                <NoteList
                                                    setImage={props.setImage}
                                                    data={props.campaign.current.notes}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.notes = data;
                                                        props.update();
                                                    }}
                                                />
                                            </DashboardElement>
                                            <DashboardElement>
                                                <div className="text-xl font-bold">Players</div>
                                                <PlayerStatblockList
                                                    data={props.campaign.current.players}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.players = data;
                                                        props.update();
                                                    }}
                                                    update={props.update}
                                                />
                                                <div className="text-xl font-bold">NPCs</div>
                                                <DBStatblockList
                                                    data={props.campaign.current.npcs}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.npcs = data;
                                                        props.update();
                                                    }}
                                                />
                                            </DashboardElement>
                                            <DashboardElement
                                                title="Encounters"
                                            >
                                                <EncounterList
                                                    data={props.campaign.current.encounters}
                                                    update={props.update}
                                                    allowAdd
                                                    allowDelete
                                                    searchBar
                                                    onUpdateData={(data) => {
                                                        props.campaign.current.encounters = data;
                                                        props.update();
                                                    }}
                                                    onSelect={(encounter) => {
                                                        const board = encounter.board;
                                                        props.loadCampaignBoard(board);
                                                    }}
                                                />
                                            </DashboardElement>
                                        </Dashboard>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <Dialog ref={props.dialogHandle} />
        </>
    )
}