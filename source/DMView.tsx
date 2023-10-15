import * as React from 'react'

import { ToolButton } from './ui/ToolButton';
import { Board, BoardTerrain, IBoardUtility, OnePageDungeon, constructDefaultBoard, constructFromOnePageDungeon } from './board/Board';
import { TerrainBoardUtility } from './board/utilities/TerrainBoardUtility';
import { SpellBoardUtility } from './board/utilities/SpellBoardUtility';
import { BoardComponent, BoardComponentHandle } from './board/BoardComponent';
import { ConditionBoardUtility } from './board/utilities/ConditionBoardUtility';
import { CreateCreatureDecoratorBoardUtility } from './board/utilities/CreateCreatureDecoratorBoardUtility';
import { TrashDecoratorBoardUtility } from './board/utilities/TrashDecoratorBoardUtility';
import { MoveDecoratorBoardUtility } from './board/utilities/MoveDecoratorBoardUtility';

import { InteractBoardUtility } from './board/utilities/InteractBoardUtility';
import { Dialog, DialogHandle } from './ui/Dialog';
import { NumberInput } from './ui/NumberInput';
import { UIGroup } from './ui/UIGroup';
import { HiddenBoardUtility } from './board/utilities/HiddenBoardUtility';
import { Rect } from './Rect';
import { ImportanceRectUtility } from './board/utilities/ImportanceRectBoardUtility';
import { Tooltip, TooltipContent, TooltipTarget } from './ui/Tooltip';
import { InitiaitveBoardUtility } from './board/utilities/InitiativeBoardUtility';
import { CreateItemDecoratorBoardUtility } from './board/utilities/CreateItemDecoratorBoardUtility';

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
            new InitiaitveBoardUtility(board.current),
            new TerrainBoardUtility(board.current, BoardTerrain.Grass),
            new ConditionBoardUtility(board.current, null),
            new CreateCreatureDecoratorBoardUtility(board.current),
            new CreateItemDecoratorBoardUtility(board.current),
            new MoveDecoratorBoardUtility(board.current),
            new TrashDecoratorBoardUtility(board.current),
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
            <div className='w-full grow h-screen min-h-screen max-h-screen overflow-hidden relative flex justify-center items-center basis-1 border-r-4 border-orange-600 grow basis-2' style={{
                minWidth: "50vw!important"
            }}>
                <BoardComponent
                    ref={boardComponentRef}
                    board={board.current}
                    utility={utilities.current[currentUtility]}
                    importanceRect={props.importanceRect}
                    setImportanceRect={props.setImportanceRect}
                />
                <div className='absolute left-0 bottom-0 w-full p-3 pointer-events-none flex flex-col items-start gap-1 z-[60] justify-end top-0'>
                    {
                        utilities.current[currentUtility] != undefined ? (
                            utilities.current[currentUtility]!.userInterface()
                        ) : <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-end' />
                    }

                    <div className='rounded-xl bg-neutral-50 w-fit flex flex-row flex-wrap justify-start pointer-events-auto shadow-2xl shadow-black'>
                        {
                            utilities.current.map((v, i) => {
                                return (
                                    <Tooltip
                                        key={i}
                                        strategy='fixed'
                                    >
                                        <TooltipTarget>
                                            <ToolButton
                                                onClick={() => {
                                                    setCurrentUtility(i);
                                                    utilities.current[i].onMount?.call(utilities.current[i]);
                                                }}
                                                active={currentUtility === i}
                                            >
                                                {v.icon()}
                                            </ToolButton>
                                        </TooltipTarget>
                                        <TooltipContent>
                                            {v.description()}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <Dialog ref={dialogHandle} />
        </>
    )
}

export const DMView = React.forwardRef(DMViewRenderer);