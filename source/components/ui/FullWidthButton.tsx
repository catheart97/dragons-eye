import React from 'react';

export const FullWidthButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...props}
            className='w-full bg-orange-600 text-white p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 hover:scale-110 hover:bg-neutral-600 mt-2'
        >
            {props.children}
        </button>
    )
}