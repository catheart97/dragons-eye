import * as React from 'react'

import 'material-icons/iconfont/material-icons.css';
import { ToolButton } from '../ui/ToolButton';
import { Board, BoardTerrain, IBoardUtility, OnePageDungeon, constructFromOnePageDungeon, constructRandomBoard } from '../board/Board';
import { TerrainBoardUtility } from '../board/utilities/TerrainBoardUtility';
import { SpellBoardUtility } from '../board/utilities/SpellBoardUtility';
import { BoardComponent } from '../board/BoardComponent';
import { ConditionBoardUtility } from '../board/utilities/ConditionBoardUtility';
import { DecoratorBoardUtility } from '../board/utilities/DecoratorBoardUtility';
import { useForceUpdate } from '../utility';

import { InteractBoardUtility } from './utilities/InteractBoardUtility';
import { Dialog, DialogHandle } from '../ui/Dialog';
import { NumberInput } from '../ui/NumberInput';
import { UIGroup } from '../ui/UIGroup';

const BoardUtilty = () => {
    const board = React.useRef<Board>(constructRandomBoard(25, 25));
    const fileName = React.useRef<string>('');
    const forceUpdate = useForceUpdate();

    const dialogHandle = React.useRef<DialogHandle>(null);
    const registerListener = React.useRef<boolean>(false);

    React.useEffect(() => {
        if (!registerListener.current) {
            registerListener.current = true;
            window.ipcRenderer.on('r-new-file', async (_e) => {
                let w = 20;
                let h = 20;

                dialogHandle.current!.open(<div className='flex flex-col gap-2 w-full'>
                    <UIGroup title="Width">
                        <NumberInput
                            className='grow w-full'
                            defaultValue={w}
                            min={2}
                            max={300}
                            onChange={(e) => {
                                w = e.target.valueAsNumber;
                            }}
                        ></NumberInput>
                    </UIGroup>
                    <UIGroup title="Height">
                        <NumberInput
                            className='grow'
                            defaultValue={h}
                            min={2}
                            max={300}
                            onChange={(e) => {
                                h = e.target.valueAsNumber;
                            }}
                        ></NumberInput>
                    </UIGroup>
                </div>, {
                    success: () => {
                        board.current = constructRandomBoard(w, h);
                        forceUpdate();
                    },
                    failure: () => {
                        console.log("Board creation cancelled");
                    }
                }, "New Board")
            });
            window.ipcRenderer.on('r-import-onepagedungeon', (_e, fn) => {
                try {
                    board.current = constructFromOnePageDungeon(window.fsExtra.readJsonSync(fn) as OnePageDungeon);
                    forceUpdate();
                } catch (e : any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            });
            window.ipcRenderer.on('r-open-file', (_e, fn: string) => {
                try {
                    const data = window.fsExtra.readJsonSync(fn);
                    board.current = data as Board;
                    fileName.current = fn;
                    forceUpdate();
                } catch (e : any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            });
            window.ipcRenderer.on('r-save-file', () => {
                if (fileName.current == "") {
                    window.ipcRenderer.send('m-save-file-as');
                } else {
                    try {
                        window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                    } catch (e : any) {
                        dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                    }
                }
            });
            window.ipcRenderer.on('r-save-file-as', (_e, fn: string) => {
                fileName.current = fn;
                try {
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                } catch (e : any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            });
            window.ipcRenderer.send('m-ready');
        }
        forceUpdate()
    }, [])

    const setupUtilities = () => {
        utilities.current = [
            new InteractBoardUtility(board.current),
            new SpellBoardUtility(),
            new TerrainBoardUtility(board.current, BoardTerrain.Grass),
            new ConditionBoardUtility(board.current, null),
            new DecoratorBoardUtility(board.current)
        ];
        utilities.current.forEach(element => {
            element.forceUpdate = forceUpdate;
        });
    }

    const [currentUtility, setCurrentUtility] = React.useState<number>(0);
    const utilities = React.useRef<Array<IBoardUtility>>([]);
    React.useEffect(setupUtilities, [board.current]);
    return (
        <>
            <div className='w-full h-screen min-h-screen max-h-screen overflow-hidden relative flex justify-center items-center'>
                <BoardComponent
                    board={board.current}
                    utility={utilities.current[currentUtility]}
                />
                <div className='absolute right-0 bottom-0 w-full p-3 pointer-events-none flex flex-col items-end gap-1 z-50'>

                    {
                        utilities.current[currentUtility] != undefined ? (
                            <div className='rounded-xl bg-neutral-200 w-fit flex flex-row flex-wrap justify-end pointer-events-auto shadow-2xl shadow-black'>
                                {utilities.current[currentUtility]!.userInterface()}
                            </div>
                        ) : <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end' />
                    }

                    <div className='rounded-xl bg-neutral-50 w-fit flex flex-row flex-wrap justify-end pointer-events-auto shadow-2xl shadow-black'>
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
            <Dialog ref={dialogHandle} />
        </>
    )
}

export default BoardUtilty
