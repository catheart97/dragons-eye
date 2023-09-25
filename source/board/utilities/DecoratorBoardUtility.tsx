import React from "react";

import { BoardPosition, IBoardUtility, BoardDecoratorType, Board, CreatureType } from "../Board"
import { ToolButton } from "../../ui/ToolButton";
import { TextInput } from "../../ui/TextInput";
import { UIGroup } from "../../ui/UIGroup";

enum DecoratorBoardUtilityMode {
    Drag,
    Place,
    Delete
}

export class DecoratorBoardUtility implements IBoardUtility {
    board: Board;
    position: BoardPosition | null = null;
    decoratorType: BoardDecoratorType = BoardDecoratorType.Creature;
    mode: DecoratorBoardUtilityMode = DecoratorBoardUtilityMode.Drag;
    creatureType: CreatureType = CreatureType.Player;
    text: string = "";

    renderUI: (() => void) | null = null;

    constructor(board: Board) {
        this.board = board;
    }

    onShapeClick(position: BoardPosition) {
        if (this.mode == DecoratorBoardUtilityMode.Drag) {
            this.position = position;
        }
    }

    onShapeRelease(position: BoardPosition) {

        const idxTo = position.x + position.y * this.board.width;
        if (this.mode == DecoratorBoardUtilityMode.Drag) {
            const idxFrom = this.position!.x + this.position!.y * this.board.width;

            if (this.board.decorators[idxFrom] && this.board.decorators[idxTo] == undefined) {
                this.board.decorators[idxTo] = this.board.decorators[idxFrom];
                delete this.board.decorators[idxFrom];
            }

            this.position = null;
        } else if (this.mode == DecoratorBoardUtilityMode.Place) {
            if (this.board.decorators[idxTo] == undefined) {
                this.board.decorators[idxTo] = {
                    type: this.decoratorType,
                    data: {
                        type: CreatureType.Player,
                        name: "Player"
                    }
                }
            }
        } else {
            delete this.board.decorators[idxTo];
        }

    }


    onShapeHover(position: BoardPosition) {
        // this.p1 = position;
    }

    userInterface() {
        return (
            <>
                <div className="w-full">
                    <UIGroup title="Mode">
                        <ToolButton
                            onClick={() => {
                                this.mode = DecoratorBoardUtilityMode.Place;
                                this.renderUI?.call(this);
                            }}
                            active={this.mode == DecoratorBoardUtilityMode.Place}
                        >
                            <span className="mso text-xl">location_on</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.mode = DecoratorBoardUtilityMode.Drag;
                                this.renderUI?.call(this);
                            }}
                            active={this.mode == DecoratorBoardUtilityMode.Drag}
                        >
                            <span className="mso text-xl">drag_pan</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.mode = DecoratorBoardUtilityMode.Delete;
                                this.renderUI?.call(this);
                            }}
                            active={this.mode == DecoratorBoardUtilityMode.Delete}
                        >
                            <span className="mso text-xl">delete</span>
                        </ToolButton>
                    </UIGroup>
                    {
                        this.mode == DecoratorBoardUtilityMode.Place ? (

                            <>
                                <UIGroup title="Element Type">
                                    <ToolButton
                                        onClick={() => {
                                            this.decoratorType = BoardDecoratorType.Creature;
                                            this.renderUI?.call(this);
                                        }}
                                        active={this.decoratorType == BoardDecoratorType.Creature}
                                    >
                                        <span className="mso text-xl">raven</span>
                                    </ToolButton>
                                    <ToolButton
                                        onClick={() => {
                                            this.decoratorType = BoardDecoratorType.Item;
                                            this.renderUI?.call(this);
                                        }}
                                        active={this.decoratorType == BoardDecoratorType.Item}
                                    >
                                        <span className="mso text-xl">category</span>
                                    </ToolButton>
                                </UIGroup>
                                <UIGroup title="Name">
                                    <TextInput onChange={(e) => {
                                        this.text = e.target.value;
                                    }} />
                                </UIGroup>
                            </>
                        ) : null
                    }

                    {
                        this.mode == DecoratorBoardUtilityMode.Place && this.decoratorType == BoardDecoratorType.Creature ? (
                            <UIGroup title="Creature Type">
                                <ToolButton
                                    className="grow"
                                    onClick={() => {
                                        this.creatureType = CreatureType.Player;
                                        this.renderUI?.call(this);
                                    }}
                                    active={this.creatureType == CreatureType.Player}
                                >
                                    <span className="mso text-xl">domino_mask</span>
                                </ToolButton>
                                <ToolButton
                                    className="grow"
                                    onClick={() => {
                                        this.creatureType = CreatureType.PlayerAnimal;
                                        this.renderUI?.call(this);
                                    }}
                                    active={this.creatureType == CreatureType.PlayerAnimal}
                                >
                                    <span className="mso text-xl">pets</span>
                                </ToolButton>
                                <ToolButton
                                    className="grow"
                                    onClick={() => {
                                        this.creatureType = CreatureType.NPC;
                                        this.renderUI?.call(this);
                                    }}
                                    active={this.creatureType == CreatureType.NPC}
                                >
                                    <span className="mso text-xl">face</span>
                                </ToolButton>
                                <ToolButton
                                    className="grow"
                                    onClick={() => {
                                        this.creatureType = CreatureType.Animal;
                                        this.renderUI?.call(this);
                                    }}
                                    active={this.creatureType == CreatureType.Animal}
                                >
                                    <span className="mso text-xl">raven</span>
                                </ToolButton>
                                <ToolButton
                                    className="grow"
                                    onClick={() => {
                                        this.creatureType = CreatureType.Enemy;
                                        this.renderUI?.call(this);
                                    }}
                                    active={this.creatureType == CreatureType.Enemy}
                                >
                                    <span className="mso text-xl">emergency_home</span>
                                </ToolButton>
                            </UIGroup>
                        ) : null
                    }
                </div>
            </>
        )
    }

    customComponent() {
        return (
            <></>
        )
    }

}