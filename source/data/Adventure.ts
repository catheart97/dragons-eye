import { Encounter } from "./Encounter"
import { Statblock } from "./Statblock"

export type Adventure = {
    image?: string,
    title: string,
    npcs: Statblock[],
    encounters: Encounter[]
}
