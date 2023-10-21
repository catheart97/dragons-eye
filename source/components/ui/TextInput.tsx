import React from 'react'

export const TextInput = (props: {
    ref?: React.RefObject<HTMLInputElement>
    disabled?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    defaultValue?: string
    className?: string
  }) => {
    return (
      <input
        defaultValue={props.defaultValue}
        ref={props.ref}
        disabled={props.disabled}
        onChange={props.onChange}
        className={[
          "w-full rounded-xl p-1 m-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed ring-neutral-600 ring-2 active:ring-neutral-600 focus:outline-none focus:ring-4",
          props.className
        ].join(' ')}
      >
      </input>
    )
  }
  