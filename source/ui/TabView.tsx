import React from "react";
import { DamageType } from "../statblock/Statblock";

export interface ITab {
    title: string,
    children: React.ReactNode
}

export const Tab = (props: ITab) => {
    return <></>
}

export const TabView = (props: {
    defaultIndex?: number
    children: React.ReactElement<ITab>[]
    className?: string
}) => {
    const [activeIndex, setActiveIndex] = React.useState(props.defaultIndex ?? 0);
    return (
        <div className={"w-full flex flex-col rounded-xl bg-white overflow-hidden " + props.className}>
            {/* Header */}
            <div className="relative w-full h-8 bg-orange-600">
                <div
                    className=" absolute bg-white transition-all duration-200"
                    style={{
                        left: activeIndex / props.children.length * 100 + "%",
                        width: 1 / props.children.length * 100 + "%",
                        top: 0,
                        bottom: 0
                    }}
                >
                </div>

                {
                    props.children.map((v, i) => {
                        return (
                            <button
                                onClick={() => setActiveIndex(i)}
                                className={"overflow-hidden absolute " + (i == activeIndex ? "text-neutral-800" : "text-neutral-50")}
                                style={{
                                    left: i / props.children.length * 100 + "%",
                                    top: 0,
                                    bottom: 0,
                                    width: 1 / props.children.length * 100 + "%"
                                }}
                            >
                                {v.props.title}
                            </button>
                        )
                    })
                }
            </div>

            {/* Body */}
            <div className="w-full h-fit grow overflow-y-scroll">
                {props.children[activeIndex].props.children ?? <></>}
            </div>

        </div>
    )
}