import { MouseEvent } from "react";
import { UIContainer } from "../components/ui/UIContainer";
import { UIGroup } from "../components/ui/UIGroup";
import { Board, IBoardUtility } from "../data/Board"
import { TexturePool } from "../data/TexturePool";

export class StampBoardUtility implements IBoardUtility {

    board: Board;
    keys: string[] = [];
    selected: string | null = null;
    mousePosition: { x: number, y: number } | null = null;
    rotation = 0;
    scale = 5;
    zoom = 1;
    toDeleteIndex = -1;

    constructor(board: Board) {
        this.board = board;
        this.keys = Object.keys(TexturePool.getInstance().get()?.StampTextures ?? {});
    }

    icon() {
        return <span className="mso text-xl">approval</span>;
    }
    description() {
        return <>Place or delete Stamps on/from the board.</>
    }
    forceUpdate: (() => void) | null = null;

    posInRect(x: number, y: number, rect: { x: number, y: number, width: number, height: number }) {
        return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    onMouseDown(_e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) {
        if (this.selected && this.mousePosition) {
            const img = TexturePool.getInstance().get()?.StampTextures[this.selected]!;
            const w = img.width * this.scale;
            const h = img.height * this.scale;
            if (!this.board.layers[this.board.activeLayer].stamps) this.board.layers[this.board.activeLayer].stamps = [];
            this.board.layers[this.board.activeLayer].stamps.push(
                {
                    position: {
                        x: (this.mousePosition.x - w / 2) / this.zoom,
                        y: (this.mousePosition.y - h / 2) / this.zoom
                    },
                    rotation: this.rotation,
                    width: w,
                    height: h,
                    image: this.selected,
                }
            );
            this.forceUpdate?.call(this);
        } else if (this.mousePosition && this.toDeleteIndex != -1) {
            this.board.layers[this.board.activeLayer].stamps?.splice(this.toDeleteIndex, 1);
            this.toDeleteIndex = -1;
            this.forceUpdate?.call(this);
        } 
    }

    onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
        this.mousePosition = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY
        }
        this.forceUpdate?.call(this);
    }

    customComponent(zoom?: number) {
        this.zoom = zoom!;
        if (this.selected && this.mousePosition) {
            const img = TexturePool.getInstance().get()?.StampTextures[this.selected]!;
            const w = img.width * this.scale;
            const h = img.height * this.scale;
            return (
                <img
                    src={(TexturePool.getInstance().get()?.StampTextures[this.selected] as HTMLImageElement).src}
                    className="absolute pointer-events-none opacity-50"
                    style={{
                        width: w,
                        height: h,
                        left: ((this.mousePosition.x - w / 2) / zoom!) + "px",
                        top: ((this.mousePosition.y - h / 2) / zoom!) + "px",
                        imageRendering: "pixelated",
                        transform: "rotate(" + this.rotation + "deg)"
                    }}
                />
            )
        } else if (this.mousePosition) {

            if (!this.board.layers[this.board.activeLayer].stamps) return <></>

            // delete mode // search for stamp 
            let stampIndex = -1;
            for (let i = 0; i < this.board.layers[this.board.activeLayer].stamps?.length; i++) {
                const stamp = this.board.layers[this.board.activeLayer].stamps![i];
                const w = stamp.width;
                const h = stamp.height;
                if (this.posInRect(this.mousePosition.x, this.mousePosition.y, {
                    x: stamp.position.x * zoom!,
                    y: stamp.position.y * zoom!,
                    width: w * zoom!,
                    height: h * zoom!
                })) {
                    stampIndex = i;
                    break;
                }
            }

            // draw outline 
            if (stampIndex >= 0) {
                this.toDeleteIndex = stampIndex;
                const stamp = this.board.layers[this.board.activeLayer].stamps![stampIndex];
                const w = stamp.width;
                const h = stamp.height;

                const l = stamp.position.x;
                const t = stamp.position.y;

                return (
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            left: l + "px",
                            top: t + "px",
                            width: w + "px",
                            height: h + "px",
                            border: "2px solid red",
                            borderRadius: "5px"
                        }}
                    />
                )
            } else {
                this.toDeleteIndex = -1;
            }
        }

        return <></>;
    }

    userInterface() {
        return (
            <UIContainer
                className="grow flex flex-col gap-2 py-3"
            >
                <div className="shrink-0 grow-0">
                    <UIGroup title="Scale">
                        <input
                            min={0.1}
                            max={10}
                            step={0.1}
                            defaultValue={this.scale}
                            type="range"
                            onChange={(e) => {
                                this.scale = e.target.valueAsNumber;
                                this.forceUpdate?.call(null);
                            }}
                        />
                    </UIGroup>
                    <UIGroup title="Rotation">
                        <input
                            min={0}
                            max={359}
                            step={1}
                            defaultValue={this.rotation}
                            type="range"
                            onChange={(e) => {
                                this.rotation = e.target.valueAsNumber;
                                this.forceUpdate?.call(null);
                            }}
                        />
                    </UIGroup>
                </div>
                <div className="grow h-0 overflow-y-scroll p-2 rounded-xl bg-neutral-300">
                    <div className="flex flex-wrap gap-2 h-fit p-2 items-stretch justify-around">
                        {
                            this.keys.map((key) => (
                                <button
                                    key={key}
                                    className={"w-[30%] flex items-center rounded-xl bg-black hover:bg-neutral-500 p-auto p-2 " + (this.selected == key ? "bg-orange-600" : "")}
                                    onClick={() => {
                                        this.selected = this.selected == key ? null : key;
                                        this.forceUpdate?.call(null);
                                    }}
                                >
                                    <img
                                        style={{
                                            imageRendering: "pixelated"
                                        }}
                                        className="w-full h-auto m-auto bg-transparent"
                                        src={(TexturePool.getInstance().get()?.StampTextures[key] as HTMLImageElement).src}
                                    />
                                </button>
                            ))
                        }
                    </div>
                </div>
            </UIContainer>
        )
    }

}