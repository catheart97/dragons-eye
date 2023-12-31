import React from 'react'

export const NumberInput = (props: {
  elemRef?: React.RefObject<HTMLInputElement>
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  defaultValue?: number
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <input
      style={props.style}
      min={props.min}
      max={props.max}
      defaultValue={props.defaultValue}
      type="number"
      ref={props.elemRef}
      disabled={props.disabled}
      onChange={props.onChange}
      className={[
        props.className ?? "w-full",
        "rounded-xl p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto   transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed ring-neutral-600 ring-2 active:ring-neutral-600 focus:outline-none focus:ring-4",
      ].join(' ')}
    >
    </input>
  )
}
