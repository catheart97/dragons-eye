import { BoardDMView } from './BoardDMView';
import React from 'react';
import { BoardPlayerView, BoardPlayerViewHandle } from './BoardPlayerView';
import { Board, OnePageDungeon, constructFromOnePageDungeon } from '../../data/Board';
import { useForceUpdate } from '../../utility';
import { Rect } from '../../Rect';
import { IAppView } from './IAppView';

const BoardApp = (props: IAppView & {
    board: React.MutableRefObject<Board>
}) => {

    const playerView = React.useRef<BoardPlayerViewHandle>(null);

    const [importanceRect, setImportanceRect] = React.useState<Rect | null>(null);

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
                <button
                    className=" h-full flex items-center"
                    onClick={() => {
                        props.playerViewOpen.current = !props.playerViewOpen.current;
                        forceUpdate();
                    }}
                >
                    <span className="mso flex text-xl">{props.playerViewOpen.current ? "right_panel_close" : "right_panel_open"}</span>
                </button>
            </div>
            <div className={
                "flex grow relative h-0"
            }>
                <BoardDMView
                    dialogHandle={props.dialogHandle}
                    board={props.board}
                    update={update}
                    importanceRect={importanceRect}
                    setImportanceRect={setImportanceRect}
                />
                <BoardPlayerView
                    open={props.playerViewOpen.current}
                    ref={playerView}
                    board={props.board}
                    update={update}
                    importanceRect={importanceRect}
                />
            </div>
        </div>
    )
}

export default BoardApp
