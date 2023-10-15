import { Campaign } from "../campaign/Campaign";
import { Dialog } from "../ui/Dialog";
import { IDMAppView } from "./IAppView";

import Icon from "../../resources/icon.png"
import React from "react";
import { UIGroup } from "../ui/UIGroup";
import { TextInput } from "../ui/TextInput";
import { Dashboard, DashboardElement, IDashboardElement } from "../ui/Dashboard";
import { Tab, TabView, TabViewHandle } from "../ui/TabView";
import { NewSpellComponent, SpellComponent } from "../statblock/SpellComponent";
import { Database } from "../database/Database";
import { PlayerStatblock, Statblock, constructDefaultStatblock } from "../statblock/Statblock";
import { StatblockComponent } from "../statblock/StatblockComponent";
import { ItemComponent, NewItemComponent } from "../statblock/ItemComponent";
import { StatblockSelectionComponent } from "../statblock/StatblockSelectionComponent";
import { Board, constructDefaultBoard } from "../board/Board";

export const SpellList = (props: {
    update: () => void
}) => {

    const [filter, setFilter] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <>
            <div className="flex rounded-xl shadow items-center m-2">
                <span className="mso p-2">search</span>
                <input
                    className="grow h-full"
                    type="text"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                {
                    filter != "" && (
                        <button
                            onClick={() => {
                                setFilter("");
                            }}
                        >
                            <span className="mso p-2">close</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <span className="mso p-2">add</span>
                </button>
            </div>
            {
                expanded && (
                    <div
                        className="h-fit transition-all duration-200 ease-in-out px-2"
                    >
                        <NewSpellComponent
                            onSubmit={(spell) => {
                                const spells = Database.getInstance().getSpells();
                                spells.push(spell);
                                Database.getInstance().updateSpells(spells);
                                props.update();
                            }}
                        />
                    </div>
                )
            }
            <div className="flex flex-col gap-1 p-2">
                {
                    Database.getInstance().getSpells().map((spell, i) => {

                        if (filter != "") {
                            if (!spell.name.toLowerCase().includes(filter.toLowerCase())) {
                                return <></>;
                            }
                        }

                        return (
                            <SpellComponent
                                key={spell.name}
                                spell={spell}
                                onDeleteRequest={() => {
                                    const spells = Database.getInstance().getSpells();
                                    spells.splice(i, 1);
                                    Database.getInstance().updateSpells(spells);
                                    props.update();
                                }}
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

export const MonsterComponent = (props: {
    player?: boolean
    onDeleteRequest: () => void
    monster: Statblock | PlayerStatblock
}) => {

    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <div className="rounded-xl overflow-hidden bg-neutral-100">
            <div className='w-full flex'>
                <div className='flex justify-left items-center grow p-1 pl-2'>
                    {props.monster.name}
                </div>
                <button
                    className='text-xs hover:bg-gray-200 w-8 p-1 flex justify-center items-center'
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    {
                        !expanded ? <span className="mso">arrow_downward</span> : <span className="mso">arrow_upward</span>
                    }
                </button>
                {
                    props.onDeleteRequest ? (
                        <button
                            className='text-xs hover:bg-gray-200 w-8 flex justify-center items-center p-1'
                            onClick={props.onDeleteRequest}
                        >
                            <span className="mso">delete</span>
                        </button>
                    ) : null
                }

            </div>
            {
                expanded ? (
                    <div
                        className="overflow-hidden"
                    >
                        <StatblockComponent
                            player={props.player}
                            uniqueKey={-1}
                            statblock={props.monster}
                            updateStatblock={(s) => {
                                const monsters = Database.getInstance().getMonsters();
                                monsters[monsters.findIndex((v) => v.name == props.monster.name)] = s as Statblock;
                                Database.getInstance().updateMonsters(monsters);
                            }}
                        />
                    </div>
                ) : null
            }
        </div>
    )
}

export const MonsterList = (props: {
    update: () => void
}) => {
    const [filter, setFilter] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const tempStatblock = React.useRef<Statblock>(constructDefaultStatblock());

    return (
        <>
            <div className="flex rounded-xl shadow items-center m-2">
                <span className="mso p-2">search</span>
                <input
                    className="grow h-full"
                    type="text"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                {
                    filter != "" && (
                        <button
                            onClick={() => {
                                setFilter("");
                            }}
                        >
                            <span className="mso p-2">close</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <span className="mso p-2">add</span>
                </button>
            </div>
            <div className="px-2 w-full">
                {
                    expanded && (
                        <div
                            className="h-fit transition-all duration-200 ease-in-out p-2 rounded-xl shadow"
                        >
                            <StatblockComponent
                                uniqueKey={-1}
                                statblock={tempStatblock.current}
                                updateStatblock={(s) => {
                                    tempStatblock.current = s as Statblock;
                                }}
                            />
                            <div className="w-full flex justify-end">
                                <button
                                    className="rounded-xl text-white self-end p-2 pl-4 bg-orange-600 flex items-center"
                                    onClick={() => {
                                        const monsters = Database.getInstance().getMonsters();
                                        monsters.push(tempStatblock.current);
                                        Database.getInstance().updateMonsters(monsters);
                                        props.update();
                                    }}
                                >
                                    Add <span className="mso px-2 p-1">add</span>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-1 p-2">
                {
                    Database.getInstance().getMonsters().map((monster, i) => {

                        if (filter != "") {
                            if (!monster.name.toLowerCase().includes(filter.toLowerCase())) {
                                return <></>;
                            }
                        }

                        return (
                            <MonsterComponent
                                key={monster.name}
                                monster={monster}
                                onDeleteRequest={() => {
                                    const spells = Database.getInstance().getSpells();
                                    spells.splice(i, 1);
                                    Database.getInstance().updateSpells(spells);
                                    props.update();
                                }}
                            />
                        )
                    })
                }
            </div>
        </>
    )

}

export const ItemList = (props: {
    update: () => void
}) => {

    const [filter, setFilter] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<boolean>(false);

    return (
        <>
            <div className="flex rounded-xl shadow items-center m-2">
                <span className="mso p-2">search</span>
                <input
                    className="grow h-full"
                    type="text"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                {
                    filter != "" && (
                        <button
                            onClick={() => {
                                setFilter("");
                            }}
                        >
                            <span className="mso p-2">close</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <span className="mso p-2">add</span>
                </button>
            </div>
            {
                expanded && (
                    <div
                        className="h-fit transition-all duration-200 ease-in-out px-2"
                    >
                        <NewItemComponent
                            onSubmit={(item) => {
                                const items = Database.getInstance().getItems();
                                items.push(item);
                                Database.getInstance().updateItems(items);
                                props.update();
                            }}
                        />
                    </div>
                )
            }
            <div className="flex flex-col gap-1 p-2">
                {
                    Database.getInstance().getItems().map((item, i) => {

                        if (filter != "") {
                            if (!item.name.toLowerCase().includes(filter.toLowerCase())) {
                                return <></>;
                            }
                        }

                        return (
                            <ItemComponent
                                key={item.name}
                                item={item}
                                onDeleteRequest={() => {
                                    const items = Database.getInstance().getItems();
                                    items.splice(i, 1);
                                    Database.getInstance().updateItems(items);
                                    props.update();
                                }}
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

export const CompendiumDashboardElement = (props: IDashboardElement & {
    update: () => void
}) => {
    return (
        <DashboardElement title="Compendium">
            <TabView
                className="shadow xl grow bg-neutral-200"
                tabClassName="overflow-y-scroll"
            >
                <Tab title="Spells">
                    <SpellList update={props.update} />
                </Tab>
                <Tab title="Monsters">
                    <MonsterList update={props.update} />
                </Tab>
                <Tab title="Items">
                    <ItemList update={props.update} />
                </Tab>
                {props.children as React.ReactElement}
            </TabView>
        </DashboardElement>
    )
}

export const NPCList = (props: {
    data: Statblock[],
    update: () => void
}) => {
    const [filter, setFilter] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const tempStatblock = React.useRef<Statblock>(constructDefaultStatblock());
    const tabViewHandle = React.useRef<TabViewHandle>(null);

    return (
        <>
            <div className="flex rounded-xl shadow items-center m-2">
                <span className="mso p-2">search</span>
                <input
                    className="grow h-full"
                    type="text"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                {
                    filter != "" && (
                        <button
                            onClick={() => {
                                setFilter("");
                            }}
                        >
                            <span className="mso p-2">close</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <span className="mso p-2">add</span>
                </button>
            </div>
            <div className="px-2 w-full flex">
                {
                    expanded && (
                        <TabView 
                            ref={tabViewHandle}
                            className="shadow-xl grow bg-neutral-200"
                            tabClassName="overflow-y-scroll"
                        >
                            <Tab title="New Creature">
                                <div
                                    className="h-fit transition-all duration-200 ease-in-out p-2 rounded-xl shadow"
                                >
                                    <StatblockComponent
                                        uniqueKey={-1}
                                        statblock={tempStatblock.current}
                                        updateStatblock={(s) => {
                                            tempStatblock.current = s as Statblock;
                                        }}
                                    />
                                    <div className="w-full flex justify-end">
                                        <button
                                            className="rounded-xl text-white self-end p-2 pl-4 bg-orange-600 flex items-center"
                                            onClick={() => {
                                                props.data.push(tempStatblock.current);
                                                props.update();
                                            }}
                                        >
                                            Add <span className="mso px-2 p-1">add</span>
                                        </button>
                                    </div>
                                </div>
                            </Tab>
                            <Tab title="From DB">
                                <StatblockSelectionComponent
                                    onSelect={(statblock) => {
                                        tempStatblock.current = structuredClone(statblock);
                                        tabViewHandle.current?.setActiveIndex(0);
                                        props.update();
                                    }}
                                />
                            </Tab>
                        </TabView>
                    )
                }
            </div>
            <div className="flex flex-col gap-1 p-2">
                {
                    props.data.map((npc, i) => {

                        if (filter != "") {
                            if (!npc.name.toLowerCase().includes(filter.toLowerCase())) {
                                return <></>;
                            }
                        }

                        return (
                            <MonsterComponent
                                key={npc.name}
                                monster={npc}
                                onDeleteRequest={() => {
                                    props.data.splice(i, 1);
                                    props.update();
                                }}
                            />
                        )
                    }
                    )
                }
            </div>
        </>
    )
}

export const PlayerList = (props: {
    campaign: React.MutableRefObject<Campaign>,
    update: () => void
}) => {
    const [filter, setFilter] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const tempStatblock = React.useRef<PlayerStatblock>(constructDefaultStatblock() as PlayerStatblock);

    return (
        <>
            <div className="flex rounded-xl shadow items-center m-2">
                <span className="mso p-2">search</span>
                <input
                    className="grow h-full"
                    type="text"
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                />
                {
                    filter != "" && (
                        <button
                            onClick={() => {
                                setFilter("");
                            }}
                        >
                            <span className="mso p-2">close</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <span className="mso p-2">add</span>
                </button>
            </div>
            <div className="px-2 w-full">
                {
                    expanded && (
                        <div
                            className="h-fit transition-all duration-200 ease-in-out p-2 rounded-xl shadow"
                        >
                            <StatblockComponent
                                player
                                uniqueKey={-1}
                                statblock={tempStatblock.current}
                                updateStatblock={(s) => {
                                    tempStatblock.current = s as PlayerStatblock;
                                }}
                            />
                            <div className="w-full flex justify-end">
                                <button
                                    className="rounded-xl text-white self-end p-2 pl-4 bg-orange-600 flex items-center"
                                    onClick={() => {
                                        props.campaign.current.players.push(tempStatblock.current);
                                        props.update();
                                    }}
                                >
                                    Add <span className="mso px-2 p-1">add</span>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-1 p-2">
                {
                    props.campaign.current.players.map((player, i) => {

                        if (filter != "") {
                            if (!player.name.toLowerCase().includes(filter.toLowerCase())) {
                                return <></>;
                            }
                        }

                        return (
                            <MonsterComponent
                                player
                                key={player.name}
                                monster={player}
                                onDeleteRequest={() => {
                                    props.campaign.current.players.splice(i, 1);
                                    props.update();
                                }}
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

export const CampaignDMView = (props: IDMAppView & {
    campaign: React.MutableRefObject<Campaign>
    loadCampaignBoard: (board: Board) => void
}) => {
    const [selectedAdventure, setSelectedAdventure] = React.useState<number>(-1);
    return (
        <>
            <div className='w-full grow h-screen min-h-screen max-h-screen overflow-hidden relative flex basis-1 border-r-4 border-orange-600 grow basis-2' style={{
                minWidth: "50vw!important"
            }}>
                <div className="w-full h-full flex">
                    <div className="basis-2/12 max-w-44 bg-neutral-100 shadow h-full flex flex-col gap-2 p-4">

                        <img
                            className="w-full h-auto rounded-xl shadow-xl"
                            src={props.campaign.current.image ?? Icon}
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
                                            encounters: []
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
                                                setSelectedAdventure(i);
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
                                                        props.update();
                                                        input.remove();
                                                    }
                                                }
                                                input.click();
                                            }}
                                        >
                                            <img
                                                className="w-auto h-full rounded-xl shadow-xl"
                                                src={props.campaign.current.adventures[selectedAdventure].image ?? Icon}
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
                                                <Tab title="Notes">
                                                    Adventure Notes
                                                </Tab>
                                            </CompendiumDashboardElement>
                                            <DashboardElement>
                                                <div className="text-xl font-bold">Players</div>
                                                <PlayerList
                                                    campaign={props.campaign}
                                                    update={props.update}
                                                />
                                                <div className="text-xl font-bold">NPCs</div>
                                                <NPCList
                                                    data={props.campaign.current.npcs}
                                                    update={props.update}
                                                />
                                                <div className="text-xl font-bold">Adventure NPCs</div>
                                                <NPCList
                                                    data={props.campaign.current.adventures[selectedAdventure].npcs}
                                                    update={props.update}
                                                />
                                            </DashboardElement>
                                            <DashboardElement
                                                title="Encounters"
                                            >
                                                <div>You can put <i>random</i> Encounters here!</div>
                                                <button
                                                    onClick={() => {
                                                        const board = constructDefaultBoard(10, 10);
                                                        props.loadCampaignBoard(board);
                                                    }}
                                                >
                                                    Open
                                                </button>
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
                                                        props.update();
                                                        input.remove();
                                                    }
                                                }
                                                input.click();
                                            }}
                                        >
                                            <img
                                                className="w-auto h-full rounded-xl shadow-xl"
                                                src={props.campaign.current.image ?? Icon}
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
                                            >
                                                <Tab title="Notes">
                                                    Campaign Notes
                                                </Tab>
                                            </CompendiumDashboardElement>
                                            <DashboardElement>
                                                <div className="text-xl font-bold">Players</div>
                                                <PlayerList
                                                    campaign={props.campaign}
                                                    update={props.update}
                                                />
                                                <div className="text-xl font-bold">NPCs</div>
                                                <NPCList
                                                    data={props.campaign.current.npcs}
                                                    update={props.update}
                                                />
                                            </DashboardElement>
                                            <DashboardElement
                                                title="Encounters"
                                            >

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