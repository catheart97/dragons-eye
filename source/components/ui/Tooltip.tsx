import * as React from "react"
import { usePopper } from 'react-popper';

export const TooltipTarget = (props: {
    children: React.ReactNode
}) => {
    return (
        props.children
    )
}

export const TooltipContent = (props: {
    children: React.ReactNode
}) => {
    return (
        props.children
    )
}

export const Tooltip = (props: {
    children: [
        React.ReactElement<typeof TooltipTarget>,
        React.ReactElement<typeof TooltipContent>
    ]
    className?: string
    strategy?: "absolute" | "fixed"
}) => {
    const [referenceElement, setReferenceElement] = React.useState(null);
    const [popperElement, setPopperElement] = React.useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "auto",
        strategy: props.strategy ?? "absolute"
    });

    const [animationState, setAnimationState] = React.useState<string>("opacity-0");

    const showTooltip = () => {
        setAnimationState("opacity-100")
    }

    const hideTooltip = () => {
        setAnimationState("opacity-0")
    }

    return (
        <>
            <div
                onPointerEnter={showTooltip}
                onPointerLeave={hideTooltip}
                onClick={() => {
                    setAnimationState(animationState === "opacity-0" ? "opacity-100" : "opacity-0")
                }}
                ref={setReferenceElement as any}
                className={"p-0 m-0 h-fit w-fit " + props.className}
            >
                {props.children[0]}
            </div>

            <div className={[
                "z-[9999999] shadow bg-neutral-200 text-black transition-all duration-300 ease-in-out p-2 m-1 text-sm pointer-events-none rounded-xl",
                animationState
            ].join(" ")}
                ref={setPopperElement as any}
                style={styles.popper} {...attributes.popper}>
                {props.children[1]}
            </div>
        </>
    );
}

