import React from "react"
import { Board } from "../board/Board"
import { Statblock } from "../statblock/Statblock"

export type Adventure = {
    image?: string,
    title: string,
    npcs: Statblock[],
    boards: {
        name: string,
        board: Board
    }[]
}

export type Campaign = {
    image?: string,
    title: string,
    npcs: Statblock[],
    adventures: Adventure[]
}

export const EmptyCampaign: Campaign = {
    title: "Campaign",
    adventures: [],
    npcs: []
}

export const CampaignContext = React.createContext<React.MutableRefObject<Campaign> | null>(null)