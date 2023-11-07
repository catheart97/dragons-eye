import React from "react"
import { constructDefaultBoard } from "./Board"
import { PlayerStatblock, Statblock } from "./Statblock"
import { Encounter } from "./Encounter"
import { Adventure } from "./Adventure"
import { Note } from "./Note"
import { DECalendar } from "./Calendar"
import { Spell } from "./Spell"
import { Item } from "./Item"

export type Campaign = {
    calendar?: DECalendar,
    image?: string,
    title: string,
    players: PlayerStatblock[],
    npcs: Statblock[],
    adventures: Adventure[]
    encounters: Encounter[]
    notes: Note[],
    spells?: Spell[],
    items?: Item[],
    monsters?: Statblock[],
    quickNote?: Note 
}

export const EmptyCampaign: Campaign = {
    title: "Campaign",
    adventures: [
        {
            title: "Adventure",
            npcs: [],
            encounters: [],
            notes: []
        }
    ],
    encounters: [
        {
            name: "Encounter",
            description: "Encounter Description",
            board: constructDefaultBoard(10, 10)
        }
    ],
    players: [],
    npcs: [],
    notes: []
}

export const CampaignContext = React.createContext<React.MutableRefObject<Campaign> | null>(null);

export const useCampaign = () => {
    return React.useContext(CampaignContext)
}