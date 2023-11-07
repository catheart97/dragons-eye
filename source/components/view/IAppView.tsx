import { DialogHandle } from "../ui/Dialog"

export interface IAppView {
    playerViewOpen: React.MutableRefObject<boolean>
    dialogHandle: React.MutableRefObject<DialogHandle | null>
    isMac: boolean
}

export interface IPlayerAppView {
    update: () => void
    open: boolean
}

export interface IDMAppView {
    dialogHandle: React.MutableRefObject<DialogHandle | null>
    update: () => void
}