import React from "react";
import { ToolButton } from "./ToolButton";
import { useForceUpdate } from "../../utility";

export type DialogProps = {}

export type DialogHandle = {
    open: (
        children: React.ReactNode,
        confirm?: {
            success: () => void
            failure: () => void
        },
        title?: string,
        full?: boolean
    ) => void
    close: () => void
    forceUpdate: () => void
}

const DialogRenderer: React.ForwardRefRenderFunction<DialogHandle, DialogProps> = (_props, ref) => {

    const [children, setChildren] = React.useState<React.ReactNode>(null)
    const [confirm, setConfirm] = React.useState<{
        success: () => void
        failure: () => void
    } | null>(null)
    const [title, setTitle] = React.useState<string>("")
    const [full, setFull] = React.useState(false);

    const forceUpdate = useForceUpdate();

    const handle: DialogHandle = {
        open: (children: React.ReactNode, confirm?: {
            success: () => void
            failure: () => void
        }, title?: string, full?: boolean) => {
            setChildren(children)
            setConfirm(confirm || null)
            setTitle(title || "")
            setFull(full ?? false);
        },
        close: () => {
            setChildren(null)
            setConfirm(null)
        },
        forceUpdate: forceUpdate
    }

    React.useImperativeHandle(ref, () => handle)

    const containerRef = React.useRef<HTMLDivElement>(null)

    return (
        <div 
            className={"absolute left-0 right-0 bottom-0 top-0 pointer-events-none bg-black/20 transition-opacity duration-200 flex justify-center items-center ease-in-out p-3 " + (children ? "opacity-100" : "opacity-0")}
            ref={containerRef}
        >
            <div 
                className={(full ? "h-full" : "w-96 h-96") + " max-w-full bg-neutral-50 m-0 focus:outline-none rounded-xl shadow-2xl shadow-black flex flex-col p-3 items-start gap-2 transition-opacity " + (children ? "pointer-events-auto opacity-100" : "opacity-0")} 
            >
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
            </div>
        </div>
    )

}

export const Dialog = React.forwardRef(DialogRenderer)