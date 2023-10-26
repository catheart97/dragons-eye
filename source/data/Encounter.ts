import { Board } from "./Board"

export type Encounter = {
    name: string,
    image?: string,
    description: string,
    board?: Board
}