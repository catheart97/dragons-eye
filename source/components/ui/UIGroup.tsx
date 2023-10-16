import React from "react";

export const UIGroup = (props: {
    title: string
    children?: React.ReactNode
    className?: string
    noPadding?: boolean
}) => {
    return (
        <>
            <div className={(props.noPadding ? "" : "p-1") + ' w-full flex  gap-3 ' + props.className}>
                <div className={'flex justify-left items-center min-w-20 w-fit uppercase ' + (props.noPadding ? "" : "pl-2")}>
                    {props.title}
                </div>
                <div className='grow flex flex-wrap justify-end'>
                    {props.children}
                </div>
            </div>
        </>
    )
}