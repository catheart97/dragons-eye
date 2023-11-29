import React from "react"
import { DialogHandle } from "./components/ui/Dialog"
import { NumberInput } from "./components/ui/NumberInput"
import { UIGroup } from "./components/ui/UIGroup"
import BoardApp from "./components/view/BoardApp"
import { CampaignApp } from "./components/view/CampaignApp"
import { Board, constructDefaultBoard } from "./data/Board"
import { Campaign, CampaignContext, EmptyCampaign } from "./data/Campaign"
import { DEFile, DEFileType, makeBoardFile, makeCampaignFile, upgradeBoardFile, upgradeCampaignFile } from "./data/DEFile"
import { useForceUpdate } from "./utility"

enum AppMode {
    Campaign,
    Board
}

export const App = (props: {
    isMac: boolean
}) => {

    const forceUpdate = useForceUpdate();

    // mode and data depending on mode
    const mode = React.useRef<AppMode>(AppMode.Campaign);
    const playerViewOpen = React.useRef<boolean>(false);
    
    const board = React.useRef<Board>(constructDefaultBoard(15, 15));
    const campaign = React.useRef<Campaign>(structuredClone(EmptyCampaign));
    
    // handle for dialogs (these shall only be shown on dm views)
    const dialogHandle: React.MutableRefObject<DialogHandle | null> = React.useRef<DialogHandle | null>(null);
    const fileName = React.useRef<string>("");
    const registered = React.useRef<boolean>(false);

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
        window.ipcRenderer.on('r-open-file', (_e, fn: string) => {
            try {

                const data = window.fsExtra.readJsonSync(fn);
                let file = data as DEFile;

                if (file.type == DEFileType.BoardFile) {
                    mode.current = AppMode.Board;

                    file = upgradeBoardFile(file);

                    board.current = file.data as Board;
                } else {
                    mode.current = AppMode.Campaign;

                    file = upgradeCampaignFile(file);

                    campaign.current = file.data as Campaign;
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
                        window.fsExtra.writeFileSync(fileName.current, JSON.stringify(makeCampaignFile(campaign.current)));
                    } else {
                        window.fsExtra.writeFileSync(fileName.current, JSON.stringify(makeBoardFile(board.current)));
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
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(makeCampaignFile(campaign.current)));
                } else {
                    window.fsExtra.writeFileSync(fileName.current, JSON.stringify(makeBoardFile(board.current)));
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
                    playerViewOpen={playerViewOpen}
                    dialogHandle={dialogHandle}
                    isMac={props.isMac}
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
                                playerViewOpen={playerViewOpen}
                                dialogHandle={dialogHandle}
                                isMac={props.isMac}
                                back={() => {
                                    loadCampaignBoard(null);
                                }}
                            />
                        </div>
                    ) : (
                        <CampaignApp
                            campaign={campaign}
                            loadCampaignBoard={loadCampaignBoard}
                            dialogHandle={dialogHandle}
                            playerViewOpen={playerViewOpen}
                            isMac={props.isMac}
                        />
                    )
                }
            </CampaignContext.Provider>
        )
    )
}