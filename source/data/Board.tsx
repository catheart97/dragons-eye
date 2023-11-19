import { PlayerViewSettings } from "../components/view/IAppView";
import { Item } from "./Item";
import { Stamp } from "./Stamp";
import { CreatureCondition, CreatureSize, PlayerStatblock, Statblock } from "./Statblock";

export const MAX_LAYERS = 10;

export type BoardPosition = {
    x: number,
    y: number
}

export enum BoardDecoratorType {
    Creature,
    Item
}

export enum CreatureType {
    Humanoid,
    Animal,
    Monster
}

export enum CreatureAttitude {
    Player,
    Ally,
    Enemy
}

export enum BoardItemType {
    Door,
    Trap,
    Note,
    Item
}

export type DoorData = "locked" | "unlocked";
export type TrapData = {
    armed: boolean,
    effect: string
}
export type NoteData = string

export type BoardItem = {
    type: BoardItemType,
    data: DoorData | TrapData | NoteData | ItemData
}
export type ItemData = Item[]

export type BoardCreature = {
    type: CreatureType,
    attitude: CreatureAttitude,
    statblock: PlayerStatblock | Statblock
}

export type BoardDecorator = {
    type: BoardDecoratorType,
    attachment: BoardCreature | BoardItem
    key: number
}

export type InitiaitveData = {
    id: number
    initiative: number
    conditions: CreatureCondition[]
}

export type LegacyBoard_0_5_7 = {
    width: number,
    height: number,
    terrain: Array<BoardTerrain>,
    decorators: { [key: number]: BoardDecorator }
    hidden: { [key: number]: boolean }
    stamps: Array<Stamp>
    decoratorCounter: number
    initiative?: InitiaitveData[]
    initiativeIndex?: number
}

export type Board = {
    width: number,
    height: number,
    
    // board / layer data
    layers: BoardLayer[]
    activeLayer: number
    decoratorCounter: number

    initiative?: InitiaitveData[]
    initiativeIndex?: number
}

export enum BoardMarkerType {
    Circle,
    Square
}

export type BoardMarker = {
    type: BoardMarkerType
    color: string
    width: number
    height: number
    position: BoardPosition
}

export type BoardLayer = {
    terrain: Array<BoardTerrain>
    decorators: { [key: number]: BoardDecorator }
    hidden: { [key: number]: boolean }
    stamps: Array<Stamp>
    markers?: BoardMarker[]
}

export const MarkerTypeIcons : {[key in BoardMarkerType] : JSX.Element} = {
    [BoardMarkerType.Circle]: <span className="msf">circle</span>,
    [BoardMarkerType.Square]: <span className="msf">stop</span>
}

export enum SpellShape {
    Cone,
    OuterCone,
    Cube,
    LargeCube,
    Cylinder,
    Sphere,
    Line
}

export enum BoardCondition {
    None,
    Fire,
    Acid,
    Ice,
    Lightning,
    Wet,
    Poison,
    Healing,
    Oil,
    Fog,
    Muted,
    Blinded,
    Invulnerable,
    Slow
}

export enum BoardTerrain {
    Grass,
    Water,
    Stone,
    Scrub,
    Sand,
    Dirt,
    Wall,
    Wood,
    Tile,
    Ice,
    Lava,
    Snow,
    Air
}

export const TerrainColors: { [key in BoardTerrain]: string } = {
    [BoardTerrain.Grass]: '#a3e635',
    [BoardTerrain.Water]: '#7dd3fc',
    [BoardTerrain.Stone]: '#9ca3af',
    [BoardTerrain.Scrub]: '#365314',
    [BoardTerrain.Sand]: '#fef08a',
    [BoardTerrain.Dirt]: '#854d0e',
    [BoardTerrain.Wall]: '#000000',
    [BoardTerrain.Wood]: '#a27035',
    [BoardTerrain.Tile]: '#ffffff',
    [BoardTerrain.Ice]: '#ffffff',
    [BoardTerrain.Lava]: '#ef4444',
    [BoardTerrain.Snow]: '#ffffff',
    [BoardTerrain.Air]: '#ffffff00'
}

export const ItemTypeIcons: { [key in BoardItemType]: React.ReactNode } = {
    [BoardItemType.Door]: <span className="msf">door_front</span>,
    [BoardItemType.Trap]: <span className="msf">crisis_alert</span>,
    [BoardItemType.Note]: <span className="msf">note</span>,
    [BoardItemType.Item]: <span className="msf">backpack</span>
}

export const CreatureAttitudeColors: { [key in CreatureAttitude]: string } = {
    [CreatureAttitude.Player]: '#22c55e',
    [CreatureAttitude.Ally]: '#a78bfa',
    [CreatureAttitude.Enemy]: '#f87171'
}

export const CanvasCreatureTypeIcons: { [key in CreatureType]: string } = {
    [CreatureType.Humanoid]: "person",
    [CreatureType.Animal]: "pets",
    [CreatureType.Monster]: "diversity_2"
}

export const CreatureTypeIcons: { [key in CreatureType]: JSX.Element } = {
    [CreatureType.Humanoid]: <span className="msf">{CanvasCreatureTypeIcons[CreatureType.Humanoid]}</span>,
    [CreatureType.Animal]: <span className="msf">{CanvasCreatureTypeIcons[CreatureType.Animal]}</span>,
    [CreatureType.Monster]: <span className="msf">{CanvasCreatureTypeIcons[CreatureType.Monster]}</span>
}

export const CreatureSizeDimension: { [key in CreatureSize]: number } = {
    [CreatureSize.Tiny]: 1,
    [CreatureSize.Small]: 2,
    [CreatureSize.Medium]: 2,
    [CreatureSize.Large]: 4,
    [CreatureSize.Huge]: 8,
    [CreatureSize.Gargantuan]: 16,
}

export interface IBoardUtility {

    onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void
    onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement>) => void
    onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void

    onShapeClick?: (position: BoardPosition) => void
    onShapeRelease?: (position: BoardPosition) => void
    onShapeHover?: (position: BoardPosition) => void
    customComponent?: (zoom?: number) => JSX.Element
    onMount?: () => void

    icon: () => JSX.Element
    description: () => JSX.Element

    forceUpdate: (() => void) | null
    userInterface: (
        playerSettings: React.MutableRefObject<PlayerViewSettings>
    ) => JSX.Element
}

export const constructRandomBoard = (width: number, height: number): Board => {
    const board = new Array<BoardTerrain>(width * height)
    board.fill(BoardTerrain.Grass)
    for (let i = 0; i < board.length; i++) {
        const random = Math.random()
        if (random < 0.1) {
            board[i] = BoardTerrain.Water;
        } else if (random < 0.2) {
            board[i] = BoardTerrain.Stone
        } else if (random < 0.3) {
            board[i] = BoardTerrain.Scrub
        } else if (random < 0.4) {
            board[i] = BoardTerrain.Sand
        } else if (random < 0.5) {
            board[i] = BoardTerrain.Dirt
        } else if (random < 0.6) {
            board[i] = BoardTerrain.Wall
        }
    }
    return {
        width,
        height,
        decoratorCounter: 0,
        activeLayer: 0,
        layers: [
            {
                terrain: board,
                decorators: {},
                hidden: {},
                stamps: []
            }
        ]
    }
}

export type OnePageDungeon = {
    version: string,
    title: string,
    story: string,
    rects: Array<{
        x: number,
        y: number,
        w: number,
        h: number,
        ending?: boolean,
        rotunda?: boolean,
    }>,
    doors: Array<{
        x: number,
        y: number,
        dir: {
            x: number,
            y: number
        }
        type?: number
    }>,
    columns: Array<{
        x: number,
        y: number
    }>,
    water: Array<{
        x: number,
        y: number
    }>,
    notes: Array<{
        pos: { x: number, y: number }
        ref: string
        text: string
    }>,
}

export const constructFromOnePageDungeon = (data: OnePageDungeon): Board => {
    const padSize = 2;

    // compute bounds
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const rect of data.rects) {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.w);
        maxY = Math.max(maxY, rect.y + rect.h);
    }
    for (const water of data.water) {
        minX = Math.min(minX, water.x);
        minY = Math.min(minY, water.y);
        maxX = Math.max(maxX, water.x);
        maxY = Math.max(maxY, water.y);
    }

    // normalize data to be positive
    for (const rect of data.rects) {
        rect.x -= minX - padSize;
        rect.y -= minY - padSize;
    }
    for (const door of data.doors) {
        door.x -= minX - padSize;
        door.y -= minY - padSize;
    }
    for (const column of data.columns) {
        column.x -= minX - padSize;
        column.y -= minY - padSize;
    }
    for (const water of data.water) {
        water.x -= minX - padSize;
        water.y -= minY - padSize;
    }
    for (const note of data.notes) {
        note.pos.x -= minX - padSize;
        note.pos.y -= minY - padSize;
    }
    console.log(minX, minY, maxX, maxY)

    maxX -= minX - 2 * padSize;
    maxY -= minY - 2 * padSize;
    minX = 0;
    minY = 0;

    console.log(minX, minY, maxX, maxY)

    let decoratorCounter = 0;

    // construct board
    const board = new Array<BoardTerrain>(maxX * maxY);
    board.fill(BoardTerrain.Wall);

    // draw rooms
    for (const rect of data.rects) {
        if (rect.rotunda) {
            const r = Math.min(rect.w, rect.h) / 2;
            const cx = rect.x + rect.w / 2;
            const cy = rect.y + rect.h / 2;
            for (let x = rect.x; x < rect.x + rect.w; x++) {
                for (let y = rect.y; y < rect.y + rect.h; y++) {
                    if (Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) < r) {
                        board[y + x * maxY] = BoardTerrain.Stone;
                    }
                }
            }
        } else {
            for (let x = rect.x; x < rect.x + rect.w; x++) {
                for (let y = rect.y; y < rect.y + rect.h; y++) {
                    board[y + x * maxY] = BoardTerrain.Stone;
                }
            }
        }
    }

    // place water 
    for (const water of data.water) {
        if (board[water.y + water.x * maxY] === BoardTerrain.Stone) {
            board[water.y + water.x * maxY] = BoardTerrain.Water;
        }
    }

    // place doors
    const decorators: { [key: number]: BoardDecorator } = {};
    for (const door of data.doors) {
        if (board[door.y + door.x * maxY] === BoardTerrain.Stone) {
            decorators[door.y + door.x * maxY] = {
                type: BoardDecoratorType.Item,
                attachment: {
                    type: BoardItemType.Door,
                    data: "unlocked"
                },
                key: decoratorCounter++
            }
        }
    }

    // place notes
    for (const note of data.notes) {
        decorators[Math.floor(note.pos.y) + Math.floor(note.pos.x) * maxY] = {
            type: BoardDecoratorType.Item,
            attachment: {
                type: BoardItemType.Note,
                data: note.text
            },
            key: decoratorCounter++
        }
    }

    return {
        width: maxY,
        height: maxX,
        activeLayer: 0,
        layers: [
            {
                terrain: board,
                decorators: decorators,
                hidden: {},
                stamps: []
            }
        ],
        decoratorCounter
    };
}

/**
 * Constructs a board with wall boarders and a floor of stone
 * @param w 
 * @param h 
 */
export const constructDefaultBoard = (w: number, h: number): Board => {
    const board = new Array<BoardTerrain>(w * h);
    board.fill(BoardTerrain.Wall);
    for (let i = 0; i < w * h; i++) {
        const x = i % w;
        const y = Math.floor(i / w);
        if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
            board[i] = BoardTerrain.Stone;
        }
    }
    return {
        width: w,
        height: h,
        decoratorCounter: 0,
        activeLayer: 0,
        layers: [
            {
                terrain: board,
                decorators: {},
                hidden: {},
                stamps: []
            }
        ]
    }
}