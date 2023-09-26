import React from 'react'

export const NumberInput = (props: {
    ref?: React.RefObject<HTMLInputElement>
    disabled?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    min?: number
    max?: number
    defaultValue?: number
    className?: string
  }) => {
    return (
      <input
        min={props.min}
        max={props.max}
        defaultValue={props.defaultValue}
        type="number"
        ref={props.ref}
        disabled={props.disabled}
        onChange={props.onChange}
        className={[
          "w-full rounded-xl p-1 m-1 h-12 flex items-center justify-center pl-3 pr-3 pointer-events-auto enabled:hover:scale-[105%] enabled:active:scale-100 transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed ring-neutral-600 ring-2 active:ring-neutral-600 focus:outline-none focus:ring-4",
          props.className
        ].join(' ')}
      >
      </input>
    )
  }
  