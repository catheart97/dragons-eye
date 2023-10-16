import React from "react"
import { Board, OnePageDungeon, constructDefaultBoard, constructFromOnePageDungeon } from "./data/Board"
import BoardApp from "./components/view/BoardApp"
import { Campaign, CampaignContext, EmptyCampaign } from "./data/Campaign"
import { DialogHandle } from "./components/ui/Dialog"
import { useForceUpdate } from "./utility"
import { CampaignApp } from "./components/view/CampaignApp"
import { UIGroup } from "./components/ui/UIGroup"
import { NumberInput } from "./components/ui/NumberInput"

enum AppMode {
    Campaign,
    Board
}

export const App = () => {

    const forceUpdate = useForceUpdate();

    // mode and data depending on mode
    const mode = React.useRef<AppMode>(AppMode.Campaign);
    const board = React.useRef<Board>(constructDefaultBoard(15, 15));
    const campaign = React.useRef<Campaign>(structuredClone(EmptyCampaign));
    const registered = React.useRef<boolean>(false);

    // handle for dialogs (these shall only be shown on dm views)
    const dialogHandle: React.MutableRefObject<DialogHandle | null> = React.useRef<DialogHandle | null>(null);
    const fileName = React.useRef<string>("");
    const playerViewOpen = React.useRef<boolean>(false);

    const campaignBoard = React.useRef<Board | null>(null);
    const loadCampaignBoard = (board: Board | null) => {
        campaignBoard.current = board;
        forceUpdate();
    }

    React.useEffect(() => {
        if (registered.current) {
            return;
        }
        window.ipcRenderer.on("r-show-hide-player-view", (_e, ..._args) => {
            playerViewOpen.current = !playerViewOpen.current;
            console.log(playerViewOpen.current)
            forceUpdate();
        });
        window.ipcRenderer.on('r-import-onepagedungeon', (_e, fn) => {
            try {
                board.current = constructFromOnePageDungeon(window.fsExtra.readJsonSync(fn) as OnePageDungeon);
            } catch (e: any) {
                dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
            }
        });
        window.ipcRenderer.on('r-open-file', (_e, fn: string) => {
            try {

                if (fn.endsWith(".deb")) {
                    mode.current = AppMode.Board;
                    const data = window.fsExtra.readJsonSync(fn);
                    board.current = data as Board;
                } else {
                    mode.current = AppMode.Campaign;
                    const data = window.fsExtra.readJsonSync(fn);
                    campaign.current = data as Campaign;
                }
                fileName.current = fn;
                forceUpdate();
            } catch (e: any) {
                dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
            }
        });
        window.ipcRenderer.on('r-save-file', () => {
            if (fileName.current == "") {
                window.ipcRenderer.send('m-save-file-as');
            } else {
                try {
                    if (mode.current == AppMode.Campaign) {
                        window.fsExtra.writeFileSync(fileName.current, JSON.stringify(campaign.current));
                    } else {
                        window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                    }
                } catch (e: any) {
                    dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
                }
            }
        });
        window.ipcRenderer.on('r-save-file-as', (_e, fn: string) => {
            fileName.current = fn;
            try {
                if (mode.current == AppMode.Campaign) {
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(campaign.current));
                } else {
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(board.current));
                }
            } catch (e: any) {
                dialogHandle.current?.open(<div className='flex flex-col gap-2 w-full'>{e}</div>, undefined, "Error");
            }
        });
        window.ipcRenderer.on('r-new-board', async (_e) => {
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
                    mode.current = AppMode.Board;
                    forceUpdate();
                },
                failure: () => {
                    console.log("Board creation cancelled");
                }
            }, "New Board")
        });

        window.ipcRenderer.on('r-new-campaign', (_e) => {
            mode.current = AppMode.Campaign;
            campaign.current = structuredClone(EmptyCampaign);
            forceUpdate();
        });

        window.ipcRenderer.send('m-ready');
        registered.current = true;
    }, [])

    return (
        mode.current == AppMode.Board ? (
            <CampaignContext.Provider
                value={null}
            >
                <BoardApp
                    board={board}
                    playerViewOpen={playerViewOpen.current}
                    dialogHandle={dialogHandle}
                />
            </CampaignContext.Provider>
        ) : (
            <CampaignContext.Provider
                value={campaign}
            >
                {
                    campaignBoard.current ? (
                        <div className="h-full w-full relative">
                            <BoardApp
                                board={campaignBoard as React.MutableRefObject<Board>}
                                playerViewOpen={playerViewOpen.current}
                                dialogHandle={dialogHandle}
                            />
                            <button 
                                className="absolute top-4 left-4 h-12 w-12 rounded-full bg-white z-[2000] flex justify-center items-center shadow-md hover:scale-110 active:scale-100 transition-all duration-200 ease-in-out"
                                onClick={() => {
                                    loadCampaignBoard(null);
                                }}
                            >
                                <span className="mso">arrow_back</span>
                            </button>
                        </div>
                    ) : (
                        <CampaignApp
                            campaign={campaign}
                            loadCampaignBoard={loadCampaignBoard}
                            dialogHandle={dialogHandle}
                            playerViewOpen={playerViewOpen.current}
                        />
                    )
                }
            </CampaignContext.Provider>
        )
    )
}