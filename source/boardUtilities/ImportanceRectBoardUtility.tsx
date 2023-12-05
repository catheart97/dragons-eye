import { CanvasBaseSize } from "../components/BoardConstants"
import { PlayerViewSettings } from "../components/view/IAppView"
import { BoardPosition, IBoardUtility } from "../data/Board"

/**
 * The goal is that the importance rect is always the core view of the player view.
 */
export class ImportanceRectUtility implements IBoardUtility {
    private downTile: BoardPosition | null = null
    private hoverTile: BoardPosition | null = null

    forceUpdate: (() => void) | null = null;

    constructor(private playerSettings: React.MutableRefObject<PlayerViewSettings>) {
    }

    icon() {
        return <span className="mso text-xl">crop_square</span>;
    }

    onShapeClick(position: BoardPosition) {
        this.downTile = position;
    }

    onShapeHover(position: BoardPosition) {
        this.hoverTile = position;
    }

    onShapeRelease(position: BoardPosition) {
        this.playerSettings.current.importanceRect = {
            x: Math.min(position.x, this.downTile!.x),
            y: Math.min(position.y, this.downTile!.y),
            width: Math.abs(position.x - this.downTile!.x) + 1,
            height: Math.abs(position.y - this.downTile!.y) + 1
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
            <>
            </>
        )
    }

    description() {
        return (
            <>Mark an important area.</>
        )
    }
}