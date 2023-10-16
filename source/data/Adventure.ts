import { Encounter } from "./Encounter"
import { Note } from "./Note"
import { Statblock } from "./Statblock"

export type Adventure = {
    image?: string,
    title: string,
    npcs: Statblock[],
    encounters: Encounter[]
    notes: Note[]
}
