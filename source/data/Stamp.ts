import { BoardPosition } from "./Board"

export type Stamp = {
    /**
     * Normalized in board coordinates
     * Integer part: cell
     * Decimal part: relative offset in cell
     */
    position: BoardPosition
    /**
     * Either the identifier in the Texture Pool or a base64 encoded image
     */
    image: string
    rotation?: 0  | 90 | 180 | 270
}