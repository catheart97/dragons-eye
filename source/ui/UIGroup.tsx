import React from "react";

export const UIGroup = (props: {
    title: string
    children?: React.ReactNode
}) => {
    return (
        <>
            <div className='w-full flex p-2'>
                <div className='flex justify-left items-center pl-2 min-w-20 w-20'>
                    {props.title}
                </div>
                <div className='grow flex flex-wrap justify-end'>
                    {props.children}
                </div>
            </div>
        </>
    )
}