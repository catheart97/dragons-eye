import React from 'react'

export const ToolButton = (props: {
    onClick: () => void
    active: boolean
    children: React.ReactNode
    disabled?: boolean
    className?: string
  }) => {
    return (
      <button
        disabled={props.disabled}
        className={[
          "rounded-xl p-1 m-1 h-12 flex items-center justify-center pl-3 pr-3 pointer-events-auto enabled:hover:scale-110 enabled:active:scale-100 transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          props.active ? "border-neutral-600  bg-neutral-400 border-2" : "bg-transparent border-0",
          props.className
        ].join(' ')}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    )
  }
  