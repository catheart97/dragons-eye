import * as React from 'react'

import 'material-icons/iconfont/material-icons.css';
import { ToolButton } from './ui/ToolButton';
import { Board, BoardTerrain, IBoardUtility, constructRandomBoard } from './board/Board';
import { TerrainBoardUtility } from './board/utilities/TerrainBoardUtility';
import { SpellBoardUtility } from './board/utilities/SpellBoardUtility';
import { BoardComponent } from './board/BoardComponent';
import { ConditionBoardUtility } from './board/utilities/ConditionBoardUtility';
import { DecoratorBoardUtility } from './board/utilities/DecoratorBoardUtility';
import { useForceUpdate } from './utility';

const App = () => {
    const board = React.useRef<Board>(constructRandomBoard(100, 100));
    const fileName = React.useRef<string>('');
    const forceUpdate = useForceUpdate();

    const registerListener = React.useRef<boolean>(false);

    React.useEffect(() => {
        if (!registerListener.current) {
            registerListener.current = true;
            window.ipcRenderer.on('r-new-file', () => {
                board.current = constructRandomBoard(100, 100);
                forceUpdate();
            });
            window.ipcRenderer.on('r-open-file', (_e, fn : string) => {
                console.log(fn);
                const data = window.fsExtra.readJsonSync(fn);
                board.current = data as Board;
                fileName.current = fn;
                forceUpdate();
            });
            window.ipcRenderer.on('r-save-file', () => {
                if (fileName.current == "") {
                    window.ipcRenderer.send('m-save-file-as');
                } else {
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                }
            });
            window.ipcRenderer.on('r-save-file-as', (_e, fn: string) => {
                fileName.current = fn;
                console.log(fn);
                window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
            });
        }
    }, [])

    const setupUtilities = () => {
        utilities.current = [
            undefined,
            new SpellBoardUtility(),
            new TerrainBoardUtility(board.current, BoardTerrain.Grass),
            new ConditionBoardUtility(board.current, null),
            new DecoratorBoardUtility(board.current)
        ];
        utilities.current.forEach(element => {
            if (element != undefined) {
                element.forceUpdate = forceUpdate;
            }
        });
    }
    
    const [currentUtility, setCurrentUtility] = React.useState<number>(0);
    const utilities = React.useRef<Array<IBoardUtility | undefined>>([]);
    React.useEffect(setupUtilities, [board.current]);

    return (
        <div className='w-full h-screen relative'>
            <BoardComponent
                board={board.current}
                utility={utilities.current[currentUtility]}
            />
            <div className='absolute right-0 bottom-0 w-96 p-3 pointer-events-none flex flex-col gap-1 z-50'>

                {
                    utilities.current[currentUtility] != undefined ? (
                        <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end pointer-events-auto'>
                            {utilities.current[currentUtility]!.userInterface()}
                        </div>
                    ) : <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end' />
                }

                <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end pointer-events-auto'>
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
