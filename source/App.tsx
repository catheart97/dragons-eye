import * as React from 'react'

import 'material-icons/iconfont/material-icons.css';
import { ToolButton } from './ui/ToolButton';
import { Board, BoardCondition, BoardTerrain, ConditionIcons, IBoardUtility, TerrainColors, constructRandomBoard } from './board/Board';
import { TerrainBoardUtility } from './board/utilities/TerrainBoardUtility';
import { SpellBoardUtility } from './board/utilities/SpellBoardUtility';
import { BoardComponent } from './board/BoardComponent';
import { ConditionBoardUtility } from './board/utilities/ConditionBoardUtility';
import { DecoratorBoardUtility } from './board/utilities/DecoratorBoardUtility';

function App() {
    const board = React.useRef<Board>(constructRandomBoard(100, 100));

    const [renderUIHelper, setRenderUIHelper] = React.useState<boolean>(false);
    const renderUI = () => {
        setRenderUIHelper(!renderUIHelper);
    }

    const [currentUtility, setCurrentUtility] = React.useState<number>(0);
    const utilities = React.useRef<Array<IBoardUtility | undefined>>([
        undefined,
        new SpellBoardUtility(),
        new TerrainBoardUtility(board.current, BoardTerrain.Grass),
        new ConditionBoardUtility(board.current, null),
        new DecoratorBoardUtility(board.current)
    ]);

    utilities.current.forEach(element => {
        if (element != undefined) {
            element.renderUI = renderUI;
        }
    });

    return (
        <div className='w-full h-screen relative'>
            <BoardComponent
                board={board.current}
                utility={utilities.current[currentUtility]}
            />
            <div className='absolute right-0 bottom-0 w-96 p-3 pointer-events-none flex flex-col gap-1'>

                {
                    utilities.current[currentUtility] != undefined ? (
                        <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end'>
                            {utilities.current[currentUtility]!.userInterface()}
                        </div>
                    ) : <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end' />
                }

                <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end'>
                    <ToolButton
                        onClick={() => {
                            setCurrentUtility(0);
                        }}
                        active={currentUtility === 0}
                    >
                        <span className="mso text-xl">arrow_selector_tool</span>
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            setCurrentUtility(1);
                        }}
                        active={currentUtility === 1}
                    >
                        <span className="mso text-xl">bolt</span>
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            setCurrentUtility(2);
                        }}
                        active={currentUtility === 2}
                    >
                        <span className="mso text-xl">edit</span>
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            setCurrentUtility(3);
                        }}
                        active={currentUtility === 3}
                    >
                        <span className="mso text-xl">question_mark</span>
                    </ToolButton>
                    <ToolButton
                        onClick={() => {
                            setCurrentUtility(4);
                        }}
                        active={currentUtility === 4}
                    >
                        <span className="mso text-xl">person</span>
                    </ToolButton>
                </div>
            </div>
        </div>
    )
}

export default App
