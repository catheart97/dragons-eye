import { BoardDMView } from './BoardDMView';
import React from 'react';
import { BoardPlayerView, BoardPlayerViewHandle } from './BoardPlayerView';
import { Board } from '../board/Board';
import { useForceUpdate } from '../utility';
import { Rect } from '../Rect';
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
