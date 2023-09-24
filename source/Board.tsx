import React from 'react'

export enum BoardTerrain {
    Grass,
    Water,
    Mountain,
    Forest,
    Desert,
    Road,
    Wall
}

export const TerrainColors: Record<BoardTerrain, string> = {
    0: 'bg-green-500',
    1: 'bg-blue-500',
    2: 'bg-gray-500',
    3: 'bg-green-800',
    4: 'bg-yellow-500',
    5: 'bg-gray-400',
    6: 'bg-gray-900'
}

export const BoardShapeComponent = (props: {
    board: Board,
    position: BoardPosition
    onClick?: (p: BoardPosition) => void
    onHover?: (p: BoardPosition) => void
}) => {



    return (
        <div
            className={
                'border-2 border-black border-dashed ' + 
                TerrainColors[props.board.terrain[props.position.x + props.position.y * props.board.width]]
            }
            style={{
                width: '50px',
                height: '50px',
                minWidth: '50px',
                minHeight: '50px',
                maxWidth: '50px',
                maxHeight: '50px'
            }}
            onMouseOver={() => { props.onHover ? props.onHover(props.position) : null }}
            onClick={() => { props.onClick ? props.onClick(props.position) : null }}
        >&nbsp;</div>
    )
}

export type BoardPosition = {
    x: number,
    y: number
}

export type Board = {
    width: number,
    height: number,
    terrain: Array<BoardTerrain>
    decorators: {}
}


export const constructRandomBoard = (width: number, height: number): Board => {
    const board = new Array<BoardTerrain>(width * height)
    board.fill(BoardTerrain.Grass)
    for (let i = 0; i < board.length; i++) {
        const random = Math.random()
        if (random < 0.1) {
            board[i] = BoardTerrain.Water;
        } else if (random < 0.2) {
            board[i] = BoardTerrain.Mountain
        } else if (random < 0.3) {
            board[i] = BoardTerrain.Forest
        } else if (random < 0.4) {
            board[i] = BoardTerrain.Desert
        } else if (random < 0.5) {
            board[i] = BoardTerrain.Road
        } else if (random < 0.6) {
            board[i] = BoardTerrain.Wall
        }
    }
    return {
        width,
        height,
        terrain: board,
        decorators: {}
    }
}

export interface IBoardUtility {
    onShapeClick: (position: BoardPosition) => void
    onShapeHover: (position: BoardPosition) => void
    userInterface: () => JSX.Element
    customComponent?: () => JSX.Element
}

export class TerrainBoardUtility implements IBoardUtility {
    private board: Board
    private targetTerrain: BoardTerrain

    constructor(board: Board, targetTerrain: BoardTerrain) {
        this.board = board
        this.targetTerrain = targetTerrain
    }

    onShapeClick(position: BoardPosition) {
        this.board.terrain[position.x + position.y * this.board.width] = this.targetTerrain;
    }

    onShapeHover(_: BoardPosition) {}

    userInterface() {
        return <></>
    }
}

export class SpellUtility implements IBoardUtility {
    position = { x: 0, y: 0 }
    renderUI = () => {}

    constructor() {
    }

    onHover(mousEvent: MouseEvent) {
        this.position = {
            x: mousEvent.clientX,
            y: mousEvent.clientY
        }
    }

    onShapeClick(_position: BoardPosition) {}

    onShapeHover(position: BoardPosition) {
        this.position = {
            x: position.x * 50 + 25,
            y: position.y * 50 + 25
        }
    }

    userInterface() {
        return <></>
    }

    customComponent() {
        return (
            <div
                style={{
                    width: '250px',
                    height: '250px',
                    minWidth: '250px',
                    minHeight: '250px',
                    maxWidth: '250px',
                    maxHeight: '250px',
                    left: (this.position.x - 125) + 'px',
                    top: (this.position.y - 125) + 'px'
                }}
                className='absolute pointer-events-none rounded-full bg-red-500/50'
            >
                &nbsp;
            </div>
        )
    }

}

export const BoardComponent = (props: {
    board: Board,
    utility?: IBoardUtility
}) => {

    const [renderUIHelper, setRenderUIHelper] = React.useState<boolean>(false)
    const renderUI = () => {
        setRenderUIHelper(!renderUIHelper);
    }
    const hovered = React.useRef<BoardPosition | null>(null)

    React.useEffect(() => {
        console.log(props.utility)
        if (props.utility) {
            renderUI();
        }
    }, [props.utility]);

    const rows = new Array<Array<JSX.Element>>(props.board.height)
    for (let i = 0; i < props.board.height; i++) {
        const row = new Array<JSX.Element>(props.board.width)
        for (let j = 0; j < props.board.width; j++) {
            row[j] = (
                <BoardShapeComponent
                    position={{ x: j, y: i }}
                    board={props.board}
                    key={j + i * props.board.width}
                    onHover={(p) => {
                        hovered.current = p
                        props.utility?.onShapeHover(p)
                        renderUI()
                    }}
                    onClick={(p) => {
                        props.utility?.onShapeClick(p)
                        renderUI();
                    }}
                />
            )
        }
        rows.push(row)
    }

    return (
        <div
            className='relative h-[inherit] w-[inherit]'
        >
            <div className='absolute top-0 left-0 right-0 bottom-0 overflow-scroll flex flex-col select-none'>
                {
                    rows.map((row, index) => {
                        return (
                            <div className='flex' key={index}>
                                {row}
                            </div>
                        )
                    })
                }
            </div>

            {
                props.utility && props.utility.customComponent ? (
                    props.utility.customComponent()
                ) : (
                    <></>
                )
            }

            <div className='absolute h-8 left-0 bottom-0 bg-neutral-50 rounded m-2 p-2'>
                {
                    hovered.current ? (
                        <div className='flex items-center h-full'>
                            <div className='font-mono'>({hovered.current.x}, {hovered.current.y})</div>&nbsp;- {
                               BoardTerrain[props.board.terrain[hovered.current.x + hovered.current.y * props.board.width]]
                            }
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </div>
        </div>
    )
}