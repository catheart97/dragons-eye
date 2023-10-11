import * as React from 'react'

import { ToolButton } from '../ui/ToolButton';
import { Board, BoardTerrain, IBoardUtility, OnePageDungeon, constructDefaultBoard, constructFromOnePageDungeon } from './Board';
import { TerrainBoardUtility } from './utilities/TerrainBoardUtility';
import { SpellBoardUtility } from './utilities/SpellBoardUtility';
import { BoardComponent, BoardComponentHandle } from './BoardComponent';
import { ConditionBoardUtility } from './utilities/ConditionBoardUtility';
import { DecoratorBoardUtility } from './utilities/DecoratorBoardUtility';

import { InteractBoardUtility } from './utilities/InteractBoardUtility';
import { Dialog, DialogHandle } from '../ui/Dialog';
import { NumberInput } from '../ui/NumberInput';
import { UIGroup } from '../ui/UIGroup';
import { HiddenBoardUtility } from './utilities/HiddenBoardUtility';
import { Rect } from '../Rect';
import { ImportanceRectUtility } from './utilities/ImportanceRectBoardUtility';

export type DMViewProps = {
    board: React.MutableRefObject<Board>;
    update: () => void;
    importanceRect: Rect | null;
    setImportanceRect: (rect: Rect | null) => void;
}

export type DMViewHandle = {
    update: () => void
}

const DMViewRenderer: React.ForwardRefRenderFunction<DMViewHandle, DMViewProps> = (props, ref) => {
    const board = props.board;
    const boardComponentRef = React.useRef<BoardComponentHandle>(null);

    const fileName = React.useRef<string>('');
    const renderUI = () => {
        boardComponentRef.current!.update();
        props.update();
    }

    const handle: DMViewHandle = {
        update: () => {
            renderUI();
        }
    }

    React.useImperativeHandle(ref, () => handle);

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
                        board.current = constructDefaultBoard(w, h);
                        setupUtilities();
                        renderUI();
                    },
                    failure: () => {
                        console.log("Board creation cancelled");
                    }
                }, "New Board")
            });
            window.ipcRenderer.on('r-import-onepagedungeon', (_e, fn) => {
                try {
                    board.current = constructFromOnePageDungeon(window.fsExtra.readJsonSync(fn) as OnePageDungeon);
                    setupUtilities();
                    renderUI();
                } catch (e: any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            });
            window.ipcRenderer.on('r-open-file', (_e, fn: string) => {
                try {
                    const data = window.fsExtra.readJsonSync(fn);
                    board.current = data as Board;
                    fileName.current = fn;
                    renderUI();
                } catch (e: any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            });
            window.ipcRenderer.on('r-save-file', () => {
                if (fileName.current == "") {
                    window.ipcRenderer.send('m-save-file-as');
                } else {
                    try {
                        window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                    } catch (e: any) {
                        dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                    }
                }
            });
            window.ipcRenderer.on('r-save-file-as', (_e, fn: string) => {
                fileName.current = fn;
                try {
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                } catch (e: any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            });
            window.ipcRenderer.send('m-ready');
        }
        renderUI()
    }, [])

    const setupUtilities = () => {
        utilities.current = [
            new InteractBoardUtility(board.current),
            new SpellBoardUtility(),
            new TerrainBoardUtility(board.current, BoardTerrain.Grass),
            new ConditionBoardUtility(board.current, null),
            new DecoratorBoardUtility(board.current),
            new HiddenBoardUtility(board.current),
            new ImportanceRectUtility(props.setImportanceRect)
        ];
        utilities.current.forEach(element => {
            element.forceUpdate = renderUI;
        });
    }

    const [currentUtility, setCurrentUtility] = React.useState<number>(0);
    const utilities = React.useRef<Array<IBoardUtility>>([]);
    React.useEffect(setupUtilities, [board.current]);
    return (
        <>
            <div className='w-full grow h-screen min-h-screen max-h-screen overflow-hidden relative flex justify-center items-center basis-1 border-l-4 border-orange-600 grow basis-2' style={{
                minWidth: "50vw!important"
            }}>
                <BoardComponent
                    ref={boardComponentRef}
                    board={board.current}
                    utility={utilities.current[currentUtility]}
                    importanceRect={props.importanceRect}
                    setImportanceRect={props.setImportanceRect}
                />
                <div className='absolute right-0 bottom-0 w-full p-3 pointer-events-none flex flex-col items-end gap-1 z-[60]'>

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
                                setCurrentUtility(5);
                            }}
                            active={currentUtility === 5}
                        >
                            <span className="mso text-xl">visibility_off</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                setCurrentUtility(4);
                            }}
                            active={currentUtility === 4}
                        >
                            <span className="mso text-xl">person</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                setCurrentUtility(6);
                            }}
                            active={currentUtility === 6}
                        >
                            <span className="mso text-xl">crop_square</span>
                        </ToolButton>
                    </div>
                </div>
            </div>
            <Dialog ref={dialogHandle} />
        </>
    )
}

export const DMView = React.forwardRef(DMViewRenderer);