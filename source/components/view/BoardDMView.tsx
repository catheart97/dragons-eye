import * as React from 'react';

import { ConditionBoardUtility } from '../../boardUtilities/ConditionBoardUtility';
import { CreateCreatureDecoratorBoardUtility } from '../../boardUtilities/CreateCreatureDecoratorBoardUtility';
import { MoveDecoratorBoardUtility } from '../../boardUtilities/MoveDecoratorBoardUtility';
import { SpellBoardUtility } from '../../boardUtilities/SpellBoardUtility';
import { TerrainBoardUtility } from '../../boardUtilities/TerrainBoardUtility';
import { TrashDecoratorBoardUtility } from '../../boardUtilities/TrashDecoratorBoardUtility';
import { Board, BoardTerrain, IBoardUtility } from '../../data/Board';
import { BoardComponent, BoardComponentHandle } from '../BoardComponent';
import { ToolButton } from '../ui/ToolButton';

import { Rect } from '../../Rect';
import { CreateItemDecoratorBoardUtility } from '../../boardUtilities/CreateItemDecoratorBoardUtility';
import { HiddenBoardUtility } from '../../boardUtilities/HiddenBoardUtility';
import { ImportanceRectUtility } from '../../boardUtilities/ImportanceRectBoardUtility';
import { InitiaitveBoardUtility } from '../../boardUtilities/InitiativeBoardUtility';
import { InteractBoardUtility } from '../../boardUtilities/InteractBoardUtility';
import { Dialog } from '../ui/Dialog';
import { Tooltip, TooltipContent, TooltipTarget } from '../ui/Tooltip';
import { IDMAppView } from './IAppView';
import { SizeBoardUtility } from '../../boardUtilities/SizeBoardUtility';
import { DMScreenComponent } from '../DMScreenComponent';
import { StampBoardUtility } from '../../boardUtilities/StampBoardUtility';

export type BoardDMViewProps = {
    board: React.MutableRefObject<Board>;
    importanceRect: Rect | null;
    setImportanceRect: (rect: Rect | null) => void;
} & IDMAppView

export type BoardBoardDMViewHandle = {
    update: () => void
}

const BoardDMViewRenderer: React.ForwardRefRenderFunction<BoardBoardDMViewHandle, BoardDMViewProps> = (props, ref) => {
    const board = props.board;
    const boardComponentRef = React.useRef<BoardComponentHandle>(null);

    const renderUI = () => {
        boardComponentRef.current!.update();
        props.update();
    }

    const handle: BoardBoardDMViewHandle = {
        update: () => {
            renderUI();
        }
    }

    React.useImperativeHandle(ref, () => handle);

    React.useEffect(() => {
        renderUI()
    }, [])

    const setupUtilities = () => {
        utilities.current = [
            new InteractBoardUtility(board.current),
            new MoveDecoratorBoardUtility(board.current),
            new InitiaitveBoardUtility(board.current),
            new SpellBoardUtility(),
            new CreateCreatureDecoratorBoardUtility(board.current),
            new CreateItemDecoratorBoardUtility(board.current),
            new TrashDecoratorBoardUtility(board.current),
            new TerrainBoardUtility(board.current, BoardTerrain.Grass),
            new StampBoardUtility(board.current),
            new ConditionBoardUtility(board.current, null),
            new HiddenBoardUtility(board.current),
            new ImportanceRectUtility(props.setImportanceRect),
            new SizeBoardUtility(board.current)
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
                <div className='absolute right-0 bottom-0 w-full p-3 pointer-events-none flex flex-col items-end gap-1 z-[60] justify-end top-0'>
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
                        <ToolButton
                            onClick={() => {
                                props.dialogHandle.current?.open(<>
                                    <DMScreenComponent />
                                </>, undefined, "Dungeon Master's Screen", true);
                            }}
                            active={false}
                        >
                            <span className='msf'>map</span>
                        </ToolButton>
                    </div>
                </div>
            </div>
            <Dialog ref={props.dialogHandle} />
        </>
    )
}

export const BoardDMView = React.forwardRef(BoardDMViewRenderer);