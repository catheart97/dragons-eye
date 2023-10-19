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
        <div className={
            "flex"
        }>
            <BoardDMView
                dialogHandle={props.dialogHandle}
                board={props.board}
                update={update}
                importanceRect={importanceRect}
                setImportanceRect={setImportanceRect}
            />
            <BoardPlayerView
                open={props.playerViewOpen}
                ref={playerView}
                board={props.board}
                update={update}
                importanceRect={importanceRect}
            />
        </div>
    )
}

export default BoardApp
