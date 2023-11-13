import * as React from 'react';

import { ConditionBoardUtility } from '../../boardUtilities/ConditionBoardUtility';
import { CreateCreatureDecoratorBoardUtility } from '../../boardUtilities/CreateCreatureDecoratorBoardUtility';
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
import { IDMAppView } from './IAppView';
import { SettingsBoardUtility } from '../../boardUtilities/SettingsBoardUtility';
import { StampBoardUtility } from '../../boardUtilities/StampBoardUtility';
import { CampaignContext } from '../../data/Campaign';
import { Adventure } from '../../data/Adventure';
import { NavigationComponent } from '../ui/NavigationComponent';
import { DMScreenComponent } from '../DMScreenComponent';

export type BoardDMViewProps = {
    board: React.MutableRefObject<Board>;
    importanceRect: Rect | null;
    setImportanceRect: (rect: Rect | null) => void;
    playerViewOpen: React.MutableRefObject<boolean>;
    setInitiativeEnabled: (enabled: boolean) => void;
    initiativeEnabled: boolean;
    isMac: boolean;
    back?: () => void
} & IDMAppView

export type BoardBoardDMViewHandle = {
    update: () => void
}

const DividerComponent = () => {
    return (
        <div className='w-[1px] bg-orange-600 h-full border-orange-600'>&nbsp;
        </div>
    )
}

const BoardDMViewRenderer: React.ForwardRefRenderFunction<BoardBoardDMViewHandle, BoardDMViewProps> = (props, ref) => {
    const board = props.board;
    const boardComponentRef = React.useRef<BoardComponentHandle>(null);

    const campaign = React.useContext(CampaignContext);
    const adventure = React.useRef<Adventure | null>(null);

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
        if (campaign != null) {
            campaign.current.adventures.forEach((a) => {
                a.encounters.forEach((e) => {
                    console.log(e.name);
                    if (e.board === board.current) {
                        adventure.current = a;
                    }
                })
            })
        }
    }, [])

    const setupUtilities = () => {

        const interactUtility = new InteractBoardUtility(board.current);

        utilities.current = [
            interactUtility,
            new TrashDecoratorBoardUtility(board.current),
            null,
            new InitiaitveBoardUtility(board.current, interactUtility),
            new SpellBoardUtility(),
            null,
            new CreateCreatureDecoratorBoardUtility(
                board.current,
                campaign || undefined,
                adventure.current || undefined
            ),
            new CreateItemDecoratorBoardUtility(
                board.current,
                campaign || undefined,
                adventure.current || undefined
            ),
            new TerrainBoardUtility(board.current, BoardTerrain.Grass),
            new ConditionBoardUtility(board.current, null),
            new StampBoardUtility(board.current),
            null,
            new HiddenBoardUtility(board.current),
            new ImportanceRectUtility(props.setImportanceRect),
            null,
            new SettingsBoardUtility(board.current) // needs to be last !!!
        ];
        utilities.current.forEach(element => {
            if (element != null) {
                element.forceUpdate = renderUI;
            }
        });

    }

    const [currentUtility, setCurrentUtility] = React.useState<number>(0);
    const utilities = React.useRef<Array<IBoardUtility | null>>([]);
    React.useEffect(setupUtilities, [board.current]);

    return (
        <div className='h-full grow relative flex flex-col justify-center items-center basis-1 border-r-4 border-orange-600 grow basis-2' style={{
            minWidth: "50vw!important",
            width: props.playerViewOpen.current ? "50vw" : "100vw",
        }}>
            <div className='absolute left-0 right-0 top-0 h-20' style={{
                zIndex: 999998
            }}>
                <NavigationComponent
                    playerViewOpen={props.playerViewOpen}
                    update={props.update}
                    className='text-white'
                    back={props.back}
                >
                    {
                        utilities.current.slice(0, utilities.current.length - 2).map((v, i) => {
                            if (v != null) {
                                return (
                                    <ToolButton
                                        onClick={() => {
                                            setCurrentUtility(i);
                                            utilities.current[i]!.onMount?.call(utilities.current[i]);
                                        }}
                                        active={currentUtility === i}
                                    >
                                        {v.icon()}
                                    </ToolButton>
                                )
                            } else {
                                return (
                                    <DividerComponent key={i} />
                                )
                            }
                        })
                    }
                    <DividerComponent />
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
                    <DividerComponent />
                    {
                        utilities.current.length > 0 ? (
                            <ToolButton
                                onClick={() => {
                                    const i = utilities.current.length - 1;
                                    setCurrentUtility(i);
                                    utilities.current[i]!.onMount?.call(utilities.current[i]);
                                }}
                                active={currentUtility === utilities.current.length - 1}
                            >
                                {utilities.current[utilities.current.length - 1]!.icon()}
                            </ToolButton>
                        ) : null
                    }
                </NavigationComponent>
            </div>
            <BoardComponent
                ref={boardComponentRef}
                board={board.current}
                utility={utilities.current[currentUtility]!}
                importanceRect={props.importanceRect}
                setImportanceRect={props.setImportanceRect}
            />
            <div className='absolute right-0 bottom-0 w-full p-3 pointer-events-none flex flex-col items-end gap-1 z-[60] justify-start top-12'>
                {
                    utilities.current[currentUtility] != undefined ? (
                        utilities.current[currentUtility]!.userInterface(
                            props.setInitiativeEnabled,
                            props.initiativeEnabled
                        )
                    ) : <div className='rounded-xl bg-neutral-200 w-full flex flex-row flex-wrap justify-start' />
                }
            </div>
            <Dialog ref={props.dialogHandle} />
        </div>
    )
}

export const BoardDMView = React.forwardRef(BoardDMViewRenderer);