import React from "react";

export const UIGroup = (props: {
    title: string
    children?: React.ReactNode
    className?: string
}) => {
    return (
        <>
            <div className={'w-full flex p-1 gap-3 ' + props.className}>
                <div className='flex justify-left items-center pl-2 min-w-20 w-fit uppercase'>
                    {props.title}
                </div>
                <div className='grow flex flex-wrap justify-end'>
                    {props.children}
                </div>
            </div>
        </>
    )
}