import * as React from 'react'
import { Board, BoardComponent, BoardTerrain, IBoardUtility, SpellUtility, TerrainBoardUtility, TerrainColors, constructRandomBoard } from './Board'
import 'material-icons/iconfont/material-icons.css';

const ToolButton = (props: {
  onClick: () => void
  active: boolean
  children: React.ReactNode
}) => {
  return (
    <button
      className={[
        "rounded-xl p-1 m-1 h-12 flex items-center justify-center pl-3 pr-3 pointer-events-auto hover:scale-110 active:scale-100 transition-all linear duration-300",
        props.active ? "border-neutral-600  bg-neutral-400 border-2" : "bg-transparent border-0"
      ].join(' ')}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

function App() {
  const board = React.useRef<Board>(constructRandomBoard(100, 100));

  const [currentUtility, setCurrentUtility] = React.useState<number>(0);
  const utilities = React.useRef<Array<IBoardUtility | undefined>>([
    undefined,
    new TerrainBoardUtility(board.current, BoardTerrain.Wall),
    new TerrainBoardUtility(board.current, BoardTerrain.Grass),
    new TerrainBoardUtility(board.current, BoardTerrain.Water),
    new TerrainBoardUtility(board.current, BoardTerrain.Mountain),
    new TerrainBoardUtility(board.current, BoardTerrain.Desert),
    new TerrainBoardUtility(board.current, BoardTerrain.Forest),
    new SpellUtility()
  ]);

  return (
    <div className='w-full h-screen relative'>
      <BoardComponent
        board={board.current}
        utility={utilities.current[currentUtility]}
      />
      <div className='absolute right-0 bottom-0 w-80 p-3 pointer-events-none flex flex-col gap-1'>
        <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end'>
          <ToolButton
            onClick={() => {
              setCurrentUtility(0);
            }}
            active={currentUtility === 0}
          >
            <span className="material-symbols-outlined">arrow_selector_tool</span>
          </ToolButton>
        </div>
        <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end'>
          <ToolButton
            onClick={() => {
              setCurrentUtility(1);
            }}
            active={currentUtility === 1}
          ><div className={'w-4 h-4 border-2 border-dashed border-black ' + TerrainColors[BoardTerrain.Wall]}>
          </div></ToolButton>
          <ToolButton
            onClick={() => {
              setCurrentUtility(2);
            }}
            active={currentUtility === 2}
          ><div className={'w-4 h-4 border-2 border-dashed border-black ' + TerrainColors[BoardTerrain.Grass]}>
          </div></ToolButton>
          <ToolButton
            onClick={() => {
              setCurrentUtility(3);
            }}
            active={currentUtility === 3}
          ><div className={'w-4 h-4 border-2 border-dashed border-black ' + TerrainColors[BoardTerrain.Water]}>
          </div></ToolButton>
          <ToolButton
            onClick={() => {
              setCurrentUtility(4);
            }}
            active={currentUtility === 4}
          ><div className={'w-4 h-4 border-2 border-dashed border-black ' + TerrainColors[BoardTerrain.Mountain]}>
          </div></ToolButton>
          <ToolButton
            onClick={() => {
              setCurrentUtility(5);
            }}
            active={currentUtility === 5}
          ><div className={'w-4 h-4 border-2 border-dashed border-black ' + TerrainColors[BoardTerrain.Desert]}>
          </div></ToolButton>
          <ToolButton
            onClick={() => {
              setCurrentUtility(6);
            }}
            active={currentUtility === 6}
          ><div className={'w-4 h-4 border-2 border-dashed border-black ' + TerrainColors[BoardTerrain.Forest]}>
          </div></ToolButton>
        </div>
        <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end'>
          <ToolButton
            onClick={() => {
              setCurrentUtility(7);
            }}
            active={currentUtility === 7}
          >
            <span className="material-icons">bolt</span>
          </ToolButton>
        </div>
        {
          utilities.current[currentUtility] != undefined ? (
            utilities.current[currentUtility]!.userInterface()
          ) : null
        }
      </div>
    </div>
  )
}

export default App
