import React from "react";
import { ToolButton } from "./ToolButton";

export type DialogProps = {}

export type DialogHandle = {
    open: (
        children: React.ReactNode,
        confirm?: {
            success: () => void
            failure: () => void
        },
        title?: string
    ) => void
    close: () => void
}

const DialogRenderer: React.ForwardRefRenderFunction<DialogHandle, DialogProps> = (_props, ref) => {

    const [children, setChildren] = React.useState<React.ReactNode>(null)
    const [confirm, setConfirm] = React.useState<{
        success: () => void
        failure: () => void
    } | null>(null)
    const [title, setTitle] = React.useState<string>("")

    const dialogRef = React.useRef<HTMLDialogElement>(null)

    const handle: DialogHandle = {
        open: (children: React.ReactNode, confirm?: {
            success: () => void
            failure: () => void
        }, title?: string) => {
            setChildren(children)
            setConfirm(confirm || null)
            setTitle(title || "")
            dialogRef.current?.showModal()
        },

        close: () => {
            setChildren(null)
            setConfirm(null)
            dialogRef.current?.close()
        }
    }

    React.useImperativeHandle(ref, () => handle)

    return (
        <>
            <div className={"pointer-events-none fixed top-0 bottom-0 right-0 left-0 bg-black/20 transition-opacity duration-200 ease-in-out " + (children ? "opacity-100" : "opacity-0")}>&nbsp;</div>
            <dialog className={"w-10/12 h-full bg-neutral-50 focus:outline-none rounded-xl shadow-2xl shadow-black flex flex-col p-3 items-start gap-2 " + (children ? "" : "hidden")} ref={dialogRef}>
                <div className="flex items-center select-none w-full justify-between">
                    <div className="text-3xl">{title}</div>
                    <button className="focus:outline-none transition-all hover:scale-110 active:scale-100 duration-200 ease-in" onClick={() => {
                        if (confirm) confirm.failure()
                        handle.close()
                    }}>
                        <span className="msf text-3xl">close</span>
                    </button>
                </div>
                <div className="grow overflow-scroll h-0 w-full">
                    {children}
                </div>
                {
                    confirm ? (
                        <div className="w-full flex justify-end gap-2 text-2xl">
                            <ToolButton
                                onClick={() => {
                                    confirm.failure();
                                    handle.close();
                                }}
                                active={false}
                                className="hover:bg-red-400"
                            >
                                <span className="msf text-xl">close</span>
                            </ToolButton>
                            <ToolButton
                                onClick={() => {
                                    confirm.success()
                                    handle.close()
                                }}
                                active={false}
                                className="hover:bg-green-400"
                            >
                                <span className="msf text-xl">check</span>
                            </ToolButton>
                        </div>
                    ) : null
                }
            </dialog>
        </>
    )

}

export const Dialog = React.forwardRef(DialogRenderer)