import { DMView } from './board/DMView';
import React from 'react';
import { PlayerView, PlayerViewHandle } from './board/PlayerView';
import { Board, constructDefaultBoard } from './board/Board';
import { useForceUpdate } from './utility';
import { Rect } from './Rect';

const App = () => {
    const board = React.useRef<Board>(constructDefaultBoard(15, 15))
    const playerView = React.useRef<PlayerViewHandle>(null);

    const [importanceRect, setImportanceRect] = React.useState<Rect | null>(null);

    const forceUpdate = useForceUpdate();
    const update = () => {
        forceUpdate();
        playerView.current?.update();
    }

    React.useEffect(() => {
        window.ipcRenderer.on("r-show-hide-player-view", (_e, ..._args) => {
            if (playerView.current?.isOpen()) {
                playerView.current.close();
            } else {
                playerView.current?.open();
            }
        });
    }, []);

    return (
        <div className={
            "flex"
        }>
            <PlayerView
                ref={playerView}
                board={board}
                update={update}
                importanceRect={importanceRect}
            />
            <DMView
                board={board}
                update={update}
                importanceRect={importanceRect}
                setImportanceRect={setImportanceRect}
            />
        </div>
    )
}

export default App
