export enum BoardTerrain {
    Grass,
    Water,
    Stone,
    Scrub,
    Sand,
    Dirt,
    Wall,
    Wood
}

export const TerrainColors: { [key in BoardTerrain] : string } = {
    [BoardTerrain.Grass]: '#a3e635',
    [BoardTerrain.Water]: '#7dd3fc',
    [BoardTerrain.Stone]: '#9ca3af',
    [BoardTerrain.Scrub]: '#365314',
    [BoardTerrain.Sand]: '#fef08a',
    [BoardTerrain.Dirt]: '#854d0e',
    [BoardTerrain.Wall]: '#020617',
    [BoardTerrain.Wood]: '#a27035'
}

export const BaseSize = 3;

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
    NPC,
    Hostile
}

export enum CreatureSize {
    Tiny,
    MediumSmall,
    Large,
    Huge,
    Gargantuan
}

export enum ItemType {
    Door,
    Trap,
    Treasure,
    Container,
    Furniture,
    LightSource,
    Note,
    Tree
}

export type DoorData = "locked" | "unlocked";
export type TrapData = {
    armed: boolean,
    effect: string
}
export type TreasureData = string[]
export type ContainerData = string[]
export type FurnitureData = {
    type: string,
    contents: string[]
}
export type LightSourceData = string
export type NoteData = string
export type TreeData = {
    size: CreatureSize
}


export type BoardItem = {
    type: ItemType,
    data: DoorData | TrapData | TreasureData | ContainerData | FurnitureData | LightSourceData | NoteData | TreeData
}

export type BoardCreature = {
    name: string,
    type: CreatureType,
    attitude: CreatureAttitude,
    size: CreatureSize,
}

export type BoardDecorator = {
    type: BoardDecoratorType,
    attachment: BoardCreature | BoardItem 
}

export type Board = {
    width: number,
    height: number,
    terrain: Array<BoardTerrain>
    conditions: { [key: number] : BoardCondition }
    decorators: { [key: number] : BoardDecorator }
}

export enum SpellShape {
    Cone,
    OuterCone,
    Cube,
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

export const ConditionIcons: { [key in BoardCondition] : React.ReactNode } = {
    [BoardCondition.None]: <></>,
    [BoardCondition.Fire]: <span className="msf text-red-500 rounded-full bg-white m-1">local_fire_department</span>,
    [BoardCondition.Acid]: <span className="msf text-green-800 rounded-full bg-white m-1">science</span>,
    [BoardCondition.Ice]: <span className="msf text-sky-600 rounded-full bg-white m-1">ac_unit</span>,
    [BoardCondition.Lightning]: <span className="msf rounded-full bg-white m-1 text-sky-800">bolt</span>,
    [BoardCondition.Wet]: <span className="msf rounded-full bg-white m-1 text-sky-400">water_drop</span>,
    [BoardCondition.Poison]: <span className="msf text-black rounded-full bg-white m-1">skull</span>,
    [BoardCondition.Healing]: <span className="msf rounded-full bg-white m-1 text-red-600">healing</span>,
    [BoardCondition.Oil]: <span className="msf text-black rounded-full bg-white m-1">water_drop</span>,
    [BoardCondition.Fog]: <span className="msf rounded-full bg-white m-1 text-blue-900">cloud</span>,
    [BoardCondition.Muted]: <span className="msf rounded-full bg-white m-1">volume_off</span>,
    [BoardCondition.Blinded]: <span className="msf rounded-full bg-white m-1">visibility_off</span>,
    [BoardCondition.Invulnerable]: <span className="msf rounded-full bg-white m-1">shield</span>,
    [BoardCondition.Slow]: <span className="msf rounded-full bg-white m-1">speed</span>
}

export const ItemTypeIcons: { [key in ItemType] : React.ReactNode } = {
    [ItemType.Door]: <span className="msf">door_front</span>,
    [ItemType.Trap]: <span className="msf">crisis_alert</span>,
    [ItemType.Treasure]: <span className="msf">payments</span>,
    [ItemType.Container]: <span className="msf">archive</span>,
    [ItemType.Furniture]: <span className="msf">shelves</span>,
    [ItemType.LightSource]: <span className="msf">lightbulb</span>,
    [ItemType.Note]: <span className="msf">note</span>,
    [ItemType.Tree]: <span className="msf">park</span>
}

export const CreatureAttitudeColors: { [key in CreatureAttitude]: string } = {
    [CreatureAttitude.Player]: '#22c55e',
    [CreatureAttitude.NPC]: '#a78bfa',
    [CreatureAttitude.Hostile]: '#f87171'
}

export const CreatureTypeIcons: { [key in CreatureType]: JSX.Element } = {
    [CreatureType.Humanoid]: <span className="msf">person</span>,
    [CreatureType.Animal]: <span className="msf">pets</span>,
    [CreatureType.Monster]: <span className="msf">diversity_2</span>
}

export const CreatureSizeDimension: { [key in CreatureSize]: number } = {
    [CreatureSize.Tiny]: 1,
    [CreatureSize.MediumSmall]: 2,
    [CreatureSize.Large]: 4,
    [CreatureSize.Huge]: 8,
    [CreatureSize.Gargantuan]: 16,
}

export interface IBoardUtility {
    onShapeClick?: (position: BoardPosition) => void
    onShapeRelease?: (position: BoardPosition) => void
    onShapeHover?: (position: BoardPosition) => void
    customComponent?: () => JSX.Element

    forceUpdate: (() => void) | null
    userInterface: () => JSX.Element
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
        terrain: board,
        conditions: {},
        decorators: {}
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
    const decorators : {[key: number]: BoardDecorator} = {};
    for (const door of data.doors) {
        if (board[door.y + door.x * maxY] === BoardTerrain.Stone) {
            decorators[door.y + door.x * maxY] = {
                type: BoardDecoratorType.Item,
                attachment: {
                    type: ItemType.Door,
                    data: [ "unlocked" ]
                }
            }
        }
    }

    // place notes
    for (const note of data.notes) {
        decorators[Math.floor(note.pos.y) + Math.floor(note.pos.x) * maxY] = {
            type: BoardDecoratorType.Item,
            attachment: {
                type: ItemType.Note,
                data: note.text
            }
        }
    }

    return {
        width: maxY,
        height: maxX,
        terrain: board,
        conditions: {},
        decorators
    };
}