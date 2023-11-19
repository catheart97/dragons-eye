import React from 'react';
import { Board, OnePageDungeon, constructFromOnePageDungeon } from '../../data/Board';
import { useForceUpdate } from '../../utility';
import { BoardDMView } from './BoardDMView';
import { BoardPlayerView, BoardPlayerViewHandle } from './BoardPlayerView';
import { IAppView, PlayerViewSettings } from './IAppView';

const BoardApp = (props: IAppView & {
    board: React.MutableRefObject<Board>
    back?: () => void
}) => {

    const playerView = React.useRef<BoardPlayerViewHandle>(null);

    const playerSettings = React.useRef<PlayerViewSettings>({
        initiativeEnabled: true,
        showDatetime: true,
        importanceRect: null
    });

    const forceUpdate = useForceUpdate();
    const update = () => {
        forceUpdate();
        playerView.current?.update();
    }

    React.useEffect(() => {
        window.ipcRenderer.on('r-import-onepagedungeon', (_e, fn) => {
            try {
                const newBoard = constructFromOnePageDungeon(window.fsExtra.readJsonSync(fn) as OnePageDungeon);
                Object.keys(newBoard).forEach((key) => {
                    (props.board.current as any)[key] = (newBoard as any)[key];
                });
                update();
            } catch (e: any) {
                props.dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
            }
        });
    }, [])

    React.useEffect(() => {
        playerView.current?.update();
    }, [props.playerViewOpen]);

    return (
        <div className="flex flex-col w-full h-screen min-h-screen max-h-screen overflow-hidden">
            <div
                style={{
                    height: props.isMac ? 42 : 0,
                    width: "100%",
                }}
                className={"flex justify-end items-center px-2 shrink-0 grow-0 overflow-hidden transition-[height,border] duration-300 ease-in-out bg-black text-white " + (props.isMac ? "border-b-4 border-orange-600" : "")}
            >
                <div className="mac h-full grow flex justify-center items-center text-sm">
                    Dragon's Eye
                </div>
            </div>
            <div className={
                [
                    "grid grid-rows-1 h-full",
                    props.playerViewOpen.current ? "grid-cols-2" : "grid-cols-1"
                ].join(" ")
            }>
                <BoardDMView
                    dialogHandle={props.dialogHandle}
                    board={props.board}
                    update={update}
                    playerViewOpen={props.playerViewOpen}
                    isMac={props.isMac}
                    playerSettings={playerSettings}
                    back={props.back}
                />
                <BoardPlayerView
                    open={props.playerViewOpen.current}
                    ref={playerView}
                    board={props.board}
                    update={update}
                    playerSettings={playerSettings}
                />
            </div>
        </div>
    )
}

export default BoardApp
