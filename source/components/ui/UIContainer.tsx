export const UIContainer = (props: {
    className?: string
    children: React.ReactNode
}) => {
    return (
        <div className={'rounded-xl bg-neutral-200 w-96 min-w-96 max-w-full flex flex-row flex-wrap justify-start pointer-events-auto shadow-2xl shadow-black max-h-full overflow-y-scroll ' + props.className}>
            {props.children}
        </div>
    )
}