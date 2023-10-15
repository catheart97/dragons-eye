import React from "react"
import { Board } from "../board/Board"
import { PlayerStatblock, Statblock } from "../statblock/Statblock"

export type Encounter = {
    title: string,
    description: string,
    board: Board
}

export type Adventure = {
    image?: string,
    title: string,
    npcs: Statblock[],
    encounters: Encounter[]
}

export type Campaign = {
    image?: string,
    title: string,
    players: PlayerStatblock[],
    npcs: Statblock[],
    adventures: Adventure[]
    encounters: Encounter[]
}

export const EmptyCampaign: Campaign = {
    title: "Campaign",
    adventures: [
        {
            title: "Adventure",
            npcs: [],
            encounters: []
        }
    ],
    encounters: [],
    players: [],
    npcs: []
}

export const CampaignContext = React.createContext<React.MutableRefObject<Campaign> | null>(null)