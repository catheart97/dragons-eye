import { FullWidthButton } from "../components/ui/FullWidthButton";
import { NumberInput } from "../components/ui/NumberInput";
import { UIContainer } from "../components/ui/UIContainer";
import { UIGroup } from "../components/ui/UIGroup";
import { Board, IBoardUtility, constructDefaultBoard } from "../data/Board";


export class SizeBoardUtility implements IBoardUtility {

    private width: number = 20;
    private height: number = 20;

    constructor(private board: Board) { }

    onMount() {
        this.width = this.board.width;
        this.height = this.board.height;
    }

    icon() {
        return <span className="mso">aspect_ratio</span>
    }

    description() {
        return <>Change the board dimensions.</>
    }

    forceUpdate: (() => void) | null = null;

    userInterface(
    ) {
        return (
            <UIContainer>
                <UIGroup className="text-orange-600 uppercase" title="Resize"/>
                <UIGroup title="width">
                    <NumberInput
                        className="w-20"
                        defaultValue={this.width}
                        min={2}
                        max={200}
                        onChange={(e) => {
                            this.width = e.target.valueAsNumber;
                        }}
                    />
                </UIGroup>
                <UIGroup title="height">
                    <NumberInput
                        className="w-20"
                        defaultValue={this.height}
                        min={2}
                        max={200}
                        onChange={(e) => {
                            this.height = e.target.valueAsNumber;
                        }}
                    />
                </UIGroup>
                <div className="flex justify-end w-full pt-3">
                    <FullWidthButton
                        onClick={() => {
                            const newboard = constructDefaultBoard(this.width, this.height);

                            delete this.board.initiative;
                            

                            for (let x = 0; x < newboard.width; x++) {
                                for (let y = 0; y < newboard.height; y++) {
                                    if (x < this.board.width && y < this.board.height) {
                                        const idx = x + y * newboard.width;
                                        const oldIdx = x + y * this.board.width;

                                        newboard.terrain[idx] = this.board.terrain[oldIdx];
                                        
                                        if (this.board.hidden && this.board.hidden[oldIdx]) {
                                            if (!newboard.hidden) newboard.hidden = {};
                                            newboard.hidden[idx] = this.board.hidden[oldIdx];
                                        }

                                        if (this.board.conditions[oldIdx]) {
                                            newboard.conditions[idx] = this.board.conditions[oldIdx];
                                        }

                                        if (this.board.decorators[oldIdx]) {
                                            newboard.decorators[idx] = this.board.decorators[oldIdx];
                                        }
                                    }
                                }
                            }

                            Object.keys(this.board).forEach((key) => {
                                (this.board as any)[key] = (newboard as any)[key];
                            });

                            this.forceUpdate?.call(this);
                        }}
                    >
                        <span className="mso">check</span>
                    </FullWidthButton>
                </div>
            </UIContainer>
        )
    }

}