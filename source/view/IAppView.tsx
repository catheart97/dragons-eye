import { DialogHandle } from "../ui/Dialog"

export interface IAppView {
    playerViewOpen: boolean
    dialogHandle: React.MutableRefObject<DialogHandle | null>
}

export interface IPlayerAppView {
    update: () => void
    open: boolean
}

export interface IDMAppView {
    dialogHandle: React.MutableRefObject<DialogHandle | null>
    update: () => void
}