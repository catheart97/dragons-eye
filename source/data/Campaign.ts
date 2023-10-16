import React from "react"
import { constructDefaultBoard } from "./Board"
import { PlayerStatblock, Statblock } from "./Statblock"
import { Encounter } from "./Encounter"
import { Adventure } from "./Adventure"

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
            encounters: [
                {
                    name: "Encounter",
                    description: "Encounter Description",
                    board: constructDefaultBoard(10, 10)
                }
            ]
        }
    ],
    encounters: [],
    players: [],
    npcs: []
}

export const CampaignContext = React.createContext<React.MutableRefObject<Campaign> | null>(null)