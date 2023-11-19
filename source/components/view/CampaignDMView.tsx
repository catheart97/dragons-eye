import { Campaign } from "../../data/Campaign";
import { Dialog } from "../ui/Dialog";
import { IDMAppView } from "./IAppView";


import AdventureIcon from "../../../resources/placeholders/adventure.png?base64";
import CampaignIcon from "../../../resources/placeholders/campaign.png?base64";
import CharacterIcon from "../../../resources/placeholders/character.png?base64";
import ItemIcon from "../../../resources/placeholders/item.png?base64";

import React, { useEffect } from "react";
import { Board, OnePageDungeon, constructFromOnePageDungeon } from "../../data/Board";
import { Database } from "../../data/Database";
import { Encounter } from "../../data/Encounter";
import { CalendarComponent, createCalendar } from "../CalendarComponent";
import { EncounterList } from "../EncounterComponent";
import { ItemList } from "../ItemComponent";
import { NoteComponent, NoteList } from "../NoteComponent";
import { SpellList } from "../SpellComponent";
import { DBStatblockList, PlayerStatblockList, StatblockList } from "../StatblockComponent";
import { Dashboard, DashboardElement, IDashboardElement } from "../ui/Dashboard";
import { Tab, TabView } from "../ui/TabView";
import { TextInput } from "../ui/TextInput";
import { UIGroup } from "../ui/UIGroup";
import { NavigationComponent } from "../ui/NavigationComponent";
import { JournalComponent } from "../JournalComponent";


export const CompendiumDashboardElement = (props: IDashboardElement & {
    update: () => void
    setImage?: (image: string) => void,
    campaign: React.MutableRefObject<Campaign>
}) => {

    if (!props.campaign.current.spells) {
        props.campaign.current.spells = [];
    }
    if (!props.campaign.current.monsters) {
        props.campaign.current.monsters = [];
    }
    if (!props.campaign.current.items) {
        props.campaign.current.items = [];
    }

    return (
        <DashboardElement>
            <div className="text-xl font-bold">Campaign Compedium</div>
            <TabView
                className="shadow xl grow bg-neutral-200"
                tabClassName="overflow-y-scroll h-1/2"
            >
                <Tab title="Spells">
                    <SpellList
                        allowDelete
                        allowAdd
                        searchBar
                        onUpdateData={(data) => {
                            props.campaign.current.spells = data;
                            props.update();
                        }}
                        data={props.campaign.current.spells!}
                        update={props.update}
                    />
                </Tab>
                <Tab title="Monsters">
                    <StatblockList
                        allowDelete
                        allowAdd
                        searchBar
                        onUpdateData={(data) => {
                            props.campaign.current.monsters = data;
                            props.update();
                        }}
                        data={props.campaign.current.monsters!}
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
                            props.campaign.current.items = data;
                            props.update();
                        }}
                        data={props.campaign.current.items!}
                        update={props.update}
                        setImage={props.setImage}
                        onSelect={(item) => {
                            if (props.setImage) {
                                props.setImage(item.image ? item.image : ItemIcon);
                            }
                        }}
                    />
                </Tab>
            </TabView>
            <div className="text-xl font-bold">Compendium</div>
            <TabView
                className="shadow xl grow bg-neutral-200 h-1/2"
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
                        setImage={props.setImage}
                        onSelect={(item) => {
                            if (props.setImage) {
                                props.setImage(item.image ? item.image : ItemIcon);
                            }
                        }}
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
    playerViewOpen: React.MutableRefObject<boolean>
}) => {
    const [selectedAdventure, setSelectedAdventure] = React.useState<number>(-1);
    const selectedRef = React.useRef<number>(selectedAdventure);

    useEffect(() => {
        props.setImage(props.campaign.current.image ?? CampaignIcon);
    }, [])

    const bgImage = (
        selectedAdventure >= 0 ? (
            props.campaign.current.adventures[selectedAdventure]?.image ?? AdventureIcon
        ) : (
            props.campaign.current.image ?? CampaignIcon
        )
    )

    const addEncounter = (encounter: Encounter) => {
        if (selectedRef.current >= 0) {
            props.campaign.current.adventures[selectedRef.current].encounters.push(encounter);
        } else {
            props.campaign.current.encounters.push(encounter);
        }
        props.update();
    }

    React.useEffect(() => {
        selectedRef.current = selectedAdventure;
    }, [selectedAdventure])

    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        window.ipcRenderer.on('r-import-onepagedungeon', (_e, fn) => {
            try {
                const newBoard = constructFromOnePageDungeon(window.fsExtra.readJsonSync(fn) as OnePageDungeon);

                let encounterTitle = "";
                let encounterDescription = "";

                props.dialogHandle.current?.open((
                    <>
                        <UIGroup title="Encounter Title">
                            <TextInput
                                onChange={(e) => {
                                    encounterTitle = e.target.value;
                                }}
                            />
                        </UIGroup>

                        <UIGroup title="Encounter Description">
                            <TextInput
                                onChange={(e) => {
                                    encounterDescription = e.target.value;
                                }}
                            />
                        </UIGroup>
                    </>
                ), {
                    success() {
                        const encounter: Encounter = {
                            name: encounterTitle,
                            description: encounterDescription,
                            board: newBoard
                        }
                        console.log();
                        addEncounter(encounter);
                    },
                    failure() { }
                }, "Import Dungeon")

                props.update();
            } catch (e: any) {
                props.dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
            }
        });
    }, [])

    return (
        <>
            <div className='grow flex basis-1 border-r-4 border-orange-600 basis-2' style={{
                minWidth: "50vw!important",
                backgroundImage: "url('" + (bgImage) + "')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>
                <div className="w-full relative h-full flex">
                    <div className="w-72 bg-neutral-100/90 shadow h-full flex items-center justify-end gap-2 transition-[width] ease-in-out duration-200" style={{
                        width: sidebarOpen ? "18rem" : "1rem",
                    }}>

                        <div className="grow flex flex-col overflow-hidden h-full p-4">
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
                                    "w-full py-2 rounded-xl text-start text-orange-600 transition-all duration-200 ease-in-out shrink-0 overflow-hidden hover:text-orange-600",
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
                                            <div
                                                className={"h-32 rounded-xl text-white font-black transition-all duration-200 ease-in-out bg-neutral-200 shadow shrink-0 overflow-hidden flex items-end cursor-pointer " + (selectedAdventure == i ? "saturate-100" : "saturate-0 hover:saturate-100")}
                                                key={adventure.title + i}
                                                style={{
                                                    backgroundImage: "url('" + (adventure.image ?? AdventureIcon) + "')",
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "top"
                                                }}
                                                onClick={() => {
                                                    setSelectedAdventure(i);
                                                    // props.setImage(adventure.image ?? AdventureIcon);
                                                }}
                                            >
                                                <div className="h-full w-full items-end flex bg-gradient-to-t from-black/80 to-black/20 gap-2">
                                                    <div className="grow p-3 text-start">
                                                        {adventure.title}
                                                    </div>
                                                    {
                                                        i != 0 && (
                                                            <button
                                                                className="p-2 flex justify-center items-center hover:bg-orange-600 ease-in-out duration-200 transition-all"
                                                                onClick={() => {
                                                                    const temp = props.campaign.current.adventures[i];
                                                                    props.campaign.current.adventures[i] = props.campaign.current.adventures[i - 1];
                                                                    props.campaign.current.adventures[i - 1] = temp;
                                                                    props.update();
                                                                }}
                                                            >
                                                                <span className="mso">arrow_upward</span>
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        i != props.campaign.current.adventures.length - 1 && (
                                                            <button
                                                                className="p-2 flex justify-center items-center hover:bg-orange-600 ease-in-out duration-200 transition-all"
                                                                onClick={() => {
                                                                    const temp = props.campaign.current.adventures[i];
                                                                    props.campaign.current.adventures[i] = props.campaign.current.adventures[i + 1];
                                                                    props.campaign.current.adventures[i + 1] = temp;
                                                                    props.update();
                                                                }}
                                                            >
                                                                <span className="mso">arrow_downward</span>
                                                            </button>
                                                        )
                                                    }
                                                    <button
                                                        className="p-2 flex justify-center items-center hover:bg-orange-600 ease-in-out duration-200 transition-all"
                                                        onClick={() => {
                                                            setSelectedAdventure(-1);
                                                            props.campaign.current.adventures.splice(i, 1);
                                                            props.update();
                                                        }}
                                                    >
                                                        <span className="mso">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <button className="w-4 hover:text-orange-600 h-full flex items-center bg-neutral-800/20" onClick={() => {
                            setSidebarOpen(!sidebarOpen);
                        }}>
                            <span className="mso" >{
                                sidebarOpen ? "chevron_left" : "chevron_right"
                            }</span>
                        </button>
                    </div>
                    <div
                        className="grow h-full flex flex-col backdrop-blur-lg"

                    >
                        <div className="w-full h-full flex flex-col gap-1">

                            <div className="flex justify-between bg-neutral-800/20 items-center">
                                <input
                                    type="text"
                                    className="text-xl text-white font-black focus:outline-none grow h-9 bg-transparent p-4"
                                    value={
                                        props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1 ? (
                                            props.campaign.current.adventures[selectedAdventure].title
                                        ) : (
                                            props.campaign.current.title
                                        )
                                    }
                                    onChange={(e) => {
                                        if (props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1) {
                                            props.campaign.current.adventures[selectedAdventure].title = e.target.value;
                                            props.update();
                                        } else {
                                            props.campaign.current.title = e.target.value;
                                            props.update();
                                        }
                                    }}
                                />
                                <NavigationComponent
                                    className="text-white"
                                    update={props.update}
                                    playerViewOpen={props.playerViewOpen}
                                    playerSettings={props.playerSettings}
                                ></NavigationComponent>
                            </div>

                            <div className="h-26 w-full px-4 p-2 flex justify-between items-center shrink-0 gap-6">
                                {
                                    props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1 ? (
                                        <>
                                            <div
                                                className="w-fit h-full shrink-0 relative rounded-full shadow-xl overflow-hidden"
                                            >
                                                <img
                                                    className="w-24 h-24"
                                                    src={props.campaign.current.adventures[selectedAdventure].image ?? AdventureIcon}
                                                />

                                                <div className="bottom-0 h-full left-0 right-0 flex absolute">
                                                    <button
                                                        className="h-full w-full bg-neutral-800/80 opacity-0 hover:opacity-100 transition-all duration-200 ease-in-out text-white flex items-center justify-center"
                                                        onClick={() => {
                                                            props.setImage(props.campaign.current.adventures[selectedAdventure].image ?? AdventureIcon)
                                                        }}
                                                    >
                                                        <span className="mso">visibility</span>
                                                    </button>
                                                    <button
                                                        className="h-full w-full bg-neutral-800/80 opacity-0 hover:opacity-100 transition-all duration-200 ease-in-out text-white flex items-center justify-center"
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
                                                        <span className="mso">edit</span>
                                                    </button>
                                                </div>
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="w-fit h-full shrink-0"
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
                                                    className="w-24 h-24 rounded-full shadow-xl"
                                                    src={props.campaign.current.image ?? CampaignIcon}
                                                    alt="Campaign Image"
                                                />
                                            </button>

                                        </>
                                    )
                                }
                                
                                <JournalComponent 
                                    campaign={props.campaign}
                                    update={props.update}
                                    dialogHandle={props.dialogHandle}
                                    className="grow"
                                />
                                {
                                    props.campaign.current.calendar ? (
                                        <CalendarComponent
                                            campaign={props.campaign}
                                            update={props.update}
                                        />
                                    ) : (
                                        <button
                                            className="w-24 h-24 rounded-full bg-neutral-50/60 flex items-center justify-center text-5xl backdrop-blur text-neutral-800"
                                            onClick={() => {
                                                const process = async () => {
                                                    const res = await createCalendar(props.dialogHandle);
                                                    if (res) {
                                                        props.campaign.current.calendar = {
                                                            stats: res,
                                                            current: {
                                                                day: 1,
                                                                month: 1,
                                                                year: 1,
                                                                hours: 0,
                                                                minutes: 0,
                                                            }
                                                        }
                                                        props.update();
                                                    }
                                                }
                                                process();
                                            }}
                                        >
                                            <span className="msf">more_time</span>
                                        </button>
                                    )
                                }
                            </div>
                            <div className="grow w-full overflow-x-scroll">
                                <Dashboard>
                                    <CompendiumDashboardElement
                                        update={props.update}
                                        campaign={props.campaign}
                                        setImage={props.setImage}
                                    >
                                    </CompendiumDashboardElement>
                                    <DashboardElement>
                                        <NoteComponent
                                            hideTitle
                                            data={props.campaign.current.quickNote ?? {
                                                name: "Quick Note",
                                                description: "",
                                                images: [],
                                            }}
                                            updateData={(data) => {
                                                props.campaign.current.quickNote = data;
                                                props.update();
                                            }}
                                            dialogHandle={props.dialogHandle}
                                        ></NoteComponent>
                                        {
                                            props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1 ? (
                                                <>
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
                                                        dialogHandle={props.dialogHandle}
                                                    />
                                                </>
                                            ) : undefined
                                        }

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
                                            dialogHandle={props.dialogHandle}
                                        />
                                        <div className="text-xl font-bold">Database General Notes</div>
                                        <NoteList
                                            data={Database.getInstance().getNotes()}
                                            onUpdateData={(data) => {
                                                Database.getInstance().updateNotes(data)
                                                props.update();
                                            }}
                                            update={props.update}
                                            allowAdd
                                            allowDelete
                                            // alwaysExpanded
                                            dialogHandle={props.dialogHandle}
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
                                            onSelect={(statblock) => {
                                                props.setImage(statblock.image != "" ? statblock.image : CharacterIcon);
                                            }}
                                        />
                                        {
                                            props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1 ? (
                                                <>
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
                                                        onSelect={(statblock) => {
                                                            props.setImage(statblock.image != "" ? statblock.image : CharacterIcon);
                                                        }}
                                                    />
                                                </>
                                            ) : undefined
                                        }
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
                                            onSelect={(statblock) => {
                                                props.setImage(statblock.image != "" ? statblock.image : CharacterIcon);
                                            }}
                                        />
                                    </DashboardElement>
                                    <DashboardElement>
                                        <div className="text-xl font-bold">Encounters</div>
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
                                            dialogHandle={props.dialogHandle}
                                            openBoard={(board) => {
                                                props.loadCampaignBoard(board);
                                            }}
                                        />
                                        {
                                            props.campaign.current.adventures.length > selectedAdventure && selectedAdventure != -1 ? (
                                                <>
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
                                                        dialogHandle={props.dialogHandle}
                                                        openBoard={(board) => {
                                                            props.loadCampaignBoard(board);
                                                        }}
                                                    />
                                                </>
                                            ) : undefined
                                        }
                                    </DashboardElement>
                                </Dashboard>
                            </div>
                        </div>
                    </div>
                    <Dialog ref={props.dialogHandle} />
                </div>
            </div >
        </>
    )
}