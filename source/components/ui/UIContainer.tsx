export const UIContainer = (props: {
    className?: string
    children: React.ReactNode
}) => {
    return (
        <div className={'rounded-xl bg-neutral-200 w-72 min-w-72 max-w-full flex flex-row flex-wrap justify-start pointer-events-auto shadow-2xl shadow-black max-h-full overflow-y-scroll ' + props.className}>
            {props.children}
        </div>
    )
}