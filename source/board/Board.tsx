export enum BoardTerrain {
    Grass,
    Water,
    Stone,
    Forest,
    Sand,
    Dirt,
    Wall
}

export const TerrainColors: { [key in BoardTerrain] : string } = {
    [BoardTerrain.Grass]: '#a3e635',
    [BoardTerrain.Water]: '#7dd3fc',
    [BoardTerrain.Stone]: '#9ca3af',
    [BoardTerrain.Forest]: '#365314',
    [BoardTerrain.Sand]: '#fef08a',
    [BoardTerrain.Dirt]: '#854d0e',
    [BoardTerrain.Wall]: '#020617'
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
    Player,
    PlayerAnimal,
    NPC,
    Enemy,
    Animal
}

export enum ItemType {
    Chest
}

export type BoardItem = {
    type: ItemType,
    contents: string[],
}

export type BoardCreature = {
    type: CreatureType,
    name: string,
}

export type BoardDecorator = {
    type: BoardDecoratorType,
    data: BoardCreature | BoardItem 
}

export type Board = {
    width: number,
    height: number,
    terrain: Array<BoardTerrain>
    conditions: { [key: number] : BoardCondition }
    decorators: { [key: number] : BoardDecorator }
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
            board[i] = BoardTerrain.Forest
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
    [BoardCondition.Muted]: <span className="msf">volume_off</span>,
    [BoardCondition.Blinded]: <span className="msf">visibility_off</span>,
    [BoardCondition.Invulnerable]: <span className="msf">shield</span>,
    [BoardCondition.Slow]: <span className="msf">speed</span>
}

export interface IBoardUtility {
    onShapeClick?: (position: BoardPosition) => void
    onShapeRelease?: (position: BoardPosition) => void
    onShapeHover?: (position: BoardPosition) => void
    customComponent?: () => JSX.Element

    renderUI: (() => void) | null
    userInterface: () => JSX.Element
}