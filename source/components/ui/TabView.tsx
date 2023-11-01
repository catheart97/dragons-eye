import React from "react";

export interface ITab {
    title: string,
    children: React.ReactNode
}

export const Tab = (_props: ITab) => {
    return <></>
}

export type TabViewProps = {
    defaultIndex?: number
    children: Array<React.ReactElement<ITab> | undefined>
    className?: string
    tabClassName?: string
    tabStyle?: React.CSSProperties
}

export type TabViewHandle = {
    setActiveIndex: (index: number) => void
}

export const TabViewRenderer : React.ForwardRefRenderFunction<TabViewHandle, TabViewProps> = (props, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(props.defaultIndex ?? 0);

    React.useImperativeHandle(ref, () => ({
        setActiveIndex: setActiveIndex
    }));

    const tabs = props.children.filter(v => v) as React.ReactElement<ITab>[];

    return (
        <div className={"w-full flex flex-col rounded-xl bg-white overflow-hidden " + props.className}>
            {/* Header */}
            <div className="relative w-full h-8 min-h-8 max-h-8 shrink-0 bg-orange-600">
                <div
                    className=" absolute bg-white transition-all duration-200"
                    style={{
                        left: activeIndex / tabs.length * 100 + "%",
                        width: 1 / tabs.length * 100 + "%",
                        top: 0,
                        bottom: 0
                    }}
                >
                </div>

                {
                    tabs.map((v, i) => {
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={"overflow-hidden absolute " + (i == activeIndex ? "text-neutral-800" : "text-neutral-50")}
                                style={{
                                    left: i / tabs.length * 100 + "%",
                                    top: 0,
                                    bottom: 0,
                                    width: 1 / tabs.length * 100 + "%"
                                }}
                            >
                                {v.props.title}
                            </button>
                        )
                    })
                }
            </div>

            {/* Body */}
            <div 
                className={"w-full grow flex flex-col gap-1 " + props.tabClassName}
            >
                {tabs[activeIndex].props.children ?? <></>}
            </div>

        </div>
    )
}

export const TabView = React.forwardRef(TabViewRenderer);