import React from "react";
import ReactDOM from "react-dom";

import MaterialSymbolsCSSBase64 from "../../resources/fonts/material-symbols-base64.css?inline";

export type WindowComponentProps = {
    title: string;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    children: React.ReactNode;
}

export type WindowComponentHandle = {
    open: () => void;
    close: () => void;
}

const WindowComponentRenderer: React.ForwardRefRenderFunction<WindowComponentHandle, WindowComponentProps> = (props, ref) => {
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
    const win = React.useRef<Window | null>(null);

    const handle: WindowComponentHandle = {
        open: () => {
            if (!win.current || win.current.closed) {
                const openWin = async () => {
                    win.current = window.open(
                        "about:blank",
                        "_blank",
                        [
                            `width=${props.width ?? 400}`,
                            `height=${props.height ?? 400}`,
                            `left=${props.left ?? 0}`,
                            `top=${props.top ?? 0}`,
                            `title=${props.title}`
                        ].join(',')
                    );

                    const inlineBase64 = async (txt: string) => {
                        try {
                            const urlRegex = /url\((.*?)\)/g;
                            const matches = txt.matchAll(urlRegex);
                            for (let match of matches) {
                                const url = match[1].replace(/['"]/g, '');
                                const data = await(await fetch(url)).arrayBuffer();
                                const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
                                txt = txt.replace(match[1], `'data:application/octet-stream;base64,${base64}'`);
                            }
                            return txt;
                        } catch (e) {
                            return txt;
                        }
                    }

                    for (let child of document.head.children) {
                        
                        if (child instanceof HTMLLinkElement) {
                            const newChild = win.current!.document.createElement('style');
                            const txt = await (await fetch(child.href)).text();
                            newChild.innerHTML = await inlineBase64(txt);
                            win.current?.document.head.appendChild(newChild);
                        }
                         
                        if (child instanceof HTMLStyleElement) {
                            const newChild = win.current!.document.createElement('style');
                            newChild.innerHTML = await inlineBase64(child.innerHTML);
                            win.current?.document.head.appendChild(newChild);
                        }
                    }

                    const newChild = win.current!.document.createElement('style');
                    newChild.innerHTML = MaterialSymbolsCSSBase64;
                    win.current?.document.head.appendChild(newChild);

                    win.current?.document.body.appendChild(container!);
                }
                openWin();
            }
        },
        close: () => {
            win.current?.close();
        }
    }

    React.useImperativeHandle(ref, () => handle);

    React.useEffect(() => {
        setContainer(document.createElement('div'));
        return () => {
            win.current?.close();
            container?.remove();
        }
    }, []);

    return container && (
        ReactDOM.createPortal(
            props.children,
            container
        )
    );
}

export const WindowComponent = React.forwardRef(WindowComponentRenderer);