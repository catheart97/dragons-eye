import { Rect } from "../../Rect"
import { DialogHandle } from "../ui/Dialog"

export interface IAppView {
    dialogHandle: React.MutableRefObject<DialogHandle | null>
    playerViewOpen: React.MutableRefObject<boolean>
    isMac: boolean
}

export interface IPlayerAppView {
    update: () => void
    open: boolean
    playerSettings: React.MutableRefObject<PlayerViewSettings>
}

export interface IDMAppView {
    dialogHandle: React.MutableRefObject<DialogHandle | null>
    playerSettings: React.MutableRefObject<PlayerViewSettings>
    update: () => void
}

export type PlayerViewSettings = {
    initiativeEnabled: boolean
    showDatetime: boolean
    importanceRect: Rect | null
}