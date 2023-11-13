import { ToolButton } from "./ToolButton"

export const NavigationComponent = (props: {
    back?: () => void
    children: React.ReactNode
    className?: string
    playerViewOpen: React.MutableRefObject<boolean>
    update: () => void
}) => {
    return (
        <div className={" flex items-center  gap-2 pl-2 " + props.className}>
            {
                props.back ? (
                    <ToolButton
                        active={false}
                        onClick={() => {
                            props.back?.();
                        }}
                    >
                        <span className="mso text-xl">arrow_back</span>
                    </ToolButton>
                ) : null
            }
            <div className="flex items-center gap-1 overflow-x-scroll invisible-scroll grow" style={{
                justifyContent: "safe end"
            }}>
                <div className="flex items-center justify-end">
                    {props.children}
                </div>
            </div>
            <ToolButton
                active={false}
                onClick={() => {
                    props.playerViewOpen.current = !props.playerViewOpen.current;
                    props.update();
                }}
            >
                <span className="mso text-xl">{props.playerViewOpen.current ? "right_panel_close" : "right_panel_open"}</span>
            </ToolButton>
        </div>
    )
}