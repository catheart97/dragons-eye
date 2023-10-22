import React from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


export const ZoomImage = (
    props: React.ImgHTMLAttributes<HTMLImageElement>
) => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <TransformWrapper
                wheel={{
                    step: 1.5,
                    smoothStep: .2
                }}
            >
                <TransformComponent>
                    <img {...props} className="rounded-xl max-h-[80vh] max-w-[90vw] m-auto aspect-1" />
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}