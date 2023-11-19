import { Board, BoardMarkerType, BoardPosition, IBoardUtility, MarkerTypeIcons } from "../data/Board"
import { ToolButton } from "../components/ui/ToolButton"
import { CanvasBaseSize } from "../components/BoardComponent"
import { UIContainer } from "../components/ui/UIContainer"
import { UIGroup } from "../components/ui/UIGroup"

enum MarkerBoardUtilityMode {
    Place,
    Remove
}

export class MarkerBoardUtility implements IBoardUtility {
    private board: Board
    private markerType: BoardMarkerType = BoardMarkerType.Square
    private mode: MarkerBoardUtilityMode = MarkerBoardUtilityMode.Place
    private color: string = "#ffffff"

    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    forceUpdate: (() => void) | null = null;

    constructor(board: Board) {
        this.board = board
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;
    }

    icon() {
        return <span className="mso text-xl">palette</span>;
    }

    private setBoardCondition(position: BoardPosition, condition: boolean) {
        if (condition) {
            if (!this.board.layers[this.board.activeLayer].hidden) {
                this.board.layers[this.board.activeLayer].hidden = {}
            }
            this.board.layers[this.board.activeLayer].hidden[position.x + position.y * this.board.width] = condition;
        } else {
            if (!this.board.layers[this.board.activeLayer].hidden) {
                this.board.layers[this.board.activeLayer].hidden = {}
            } else {
                delete this.board.layers[this.board.activeLayer].hidden[position.x + position.y * this.board.width];
            }
        }
    }

    onShapeHover(position: BoardPosition) {
        this.hoverTile = position;
    }

    onShapeRelease(position: BoardPosition) {

        if (this.downTile) {
            if (this.board.layers[this.board.activeLayer].markers == undefined) {
                this.board.layers[this.board.activeLayer].markers = []
            }

            const width = Math.abs(position.x - this.downTile!.x) + 1
            const height = Math.abs(position.y - this.downTile!.y) + 1

            if (this.mode == MarkerBoardUtilityMode.Place) {

                const x = Math.min(position.x, this.downTile!.x)
                const y = Math.min(position.y, this.downTile!.y)

                this.board.layers[this.board.activeLayer].markers!.push({
                    type: this.markerType,
                    position: { x: x, y: y },
                    width: width,
                    height: height,
                    color: this.color
                })
            } else {
                const markers = this.board.layers[this.board.activeLayer].markers!

                const selectionX = Math.min(position.x, this.downTile!.x)
                const selectionY = Math.min(position.y, this.downTile!.y)
                const selectionWidth = Math.abs(position.x - this.downTile!.x) + 1
                const selectionHeight = Math.abs(position.y - this.downTile!.y) + 1

                for (let i = 0; i < markers.length; i++) {
                    const marker = markers[i]
                    // delete if it intersects with the selection 
                    if (
                        marker.position.x < selectionX + selectionWidth &&
                        marker.position.x + marker.width > selectionX &&
                        marker.position.y < selectionY + selectionHeight &&
                        marker.position.y + marker.height > selectionY
                    ) {
                        markers.splice(i, 1)
                        i--
                    }
                }
            }
        }

        this.downTile = null;
        this.forceUpdate?.call(this);
    }

    customComponent() {
        if (this.downTile != null && this.hoverTile != null) {
            const dx = Math.abs(this.hoverTile.x - this.downTile.x) + 1;
            const dy = Math.abs(this.hoverTile.y - this.downTile.y) + 1;
            return (
                <div
                    style={{
                        left: Math.min(this.hoverTile.x, this.downTile.x) * CanvasBaseSize + 'px',
                        top: Math.min(this.hoverTile.y, this.downTile.y) * CanvasBaseSize + 'px',
                        width: dx * CanvasBaseSize + 'px',
                        height: dy * CanvasBaseSize + 'px',
                        minWidth: dx * CanvasBaseSize + 'px',
                        minHeight: dy * CanvasBaseSize + 'px',
                        maxWidth: dx * CanvasBaseSize + 'px',
                        maxHeight: dy * CanvasBaseSize + 'px',
                    }}
                    className={'border-4 border-red-500 absolute pointer-events-none'}
                >
                    <div className={"h-full w-full opacity-80 bg-neutral-500"}></div>
                </div>
            )
        } else {
            return <></>
        }
    }

    userInterface() {
        return (
            <UIContainer>
                <UIGroup title="Mode">
                    <div className="flex w-full">
                        <ToolButton
                            className="grow"
                            onClick={() => {
                                this.mode = MarkerBoardUtilityMode.Place
                                this.forceUpdate?.call(this)
                            }}
                            active={this.mode == MarkerBoardUtilityMode.Place}
                        >
                            <span className="mso text-xl">add</span>
                        </ToolButton>
                        <ToolButton
                            className="grow"
                            onClick={() => {
                                this.mode = MarkerBoardUtilityMode.Remove
                                this.forceUpdate?.call(this)
                            }}
                            active={this.mode == MarkerBoardUtilityMode.Remove}
                        >
                            <span className="mso text-xl">delete</span>
                        </ToolButton>
                    </div>
                </UIGroup>
                {
                    this.mode == MarkerBoardUtilityMode.Place ? (
                        <>
                            <UIGroup title="Color">
                                <input
                                    type="color"
                                    className="w-full"
                                    value={this.color}
                                    onChange={(e) => {
                                        this.color = e.target.value
                                        this.forceUpdate?.call(this)
                                    }}
                                />
                            </UIGroup>
                            {
                                (Object.values(BoardMarkerType).filter(v => typeof v != "string") as Array<BoardMarkerType>).map((v, i) => {
                                    return (
                                        <ToolButton
                                            key={i}
                                            onClick={() => {
                                                this.markerType = v
                                                this.forceUpdate?.call(this)
                                            }}
                                            active={this.markerType == v}
                                        >
                                            {MarkerTypeIcons[v]}
                                        </ToolButton>
                                    )
                                })
                            }
                        </>
                    ) : null
                }
            </UIContainer>
        )
    }

    description() {
        return (
            <>Place Markers for specific things.</>
        )
    }
}