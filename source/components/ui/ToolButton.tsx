import React from 'react'

export const ToolButton = (props: {
    onClick: () => void
    active: boolean
    children: React.ReactNode | React.ReactElement<HTMLSpanElement>
    disabled?: boolean
    className?: string
  }) => {
    return (
      <button
        disabled={props.disabled}
        className={[
          "rounded-xl p-1 m-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto enabled:hover:scale-110 enabled:active:scale-100 transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          props.active ? "bg-orange-600 text-white" : "bg-transparent",
          props.className,
          (props.children as React.ReactElement<HTMLSpanElement>).type == "span" ? "w-8" : "w-fit"
        ].join(' ')}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    )
  }
  