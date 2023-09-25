import React from "react";

import { ToolButton } from "../../ui/ToolButton";
import { BoardPosition, BoardCondition, IBoardUtility, BaseSize, SpellShape } from "../Board"

export class SpellBoardUtility implements IBoardUtility {
    p0: BoardPosition | null = null
    p1: BoardPosition = { x: 0, y: 0 }

    spellshape: SpellShape | null = null;
    areaEffect: BoardCondition | null = null;
    renderUI: (() => void) | null = null;

    constructor() { }

    onHover(mousEvent: MouseEvent) {
        this.p1 = {
            x: mousEvent.clientX,
            y: mousEvent.clientY
        }
    }

    onShapeClick(position: BoardPosition) {
        this.p0 = position;
    }

    onShapeHover(position: BoardPosition) {
        this.p1 = position;
    }

    userInterface() {
        return (
            <>
                <div className='w-full flex p-2'>
                    <div className='flex justify-left items-center pl-4 min-w-20 w-20'>
                        Shape
                    </div>
                    <div className='grow flex flex-wrap justify-end'>
                        <ToolButton
                            onClick={() => {
                                this.spellshape = null;
                                this.renderUI?.call(this);
                            }}
                            active={this.spellshape == null}
                        >
                            <span className="mso">emergency</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.spellshape = SpellShape.Cone;
                                this.renderUI?.call(this);
                            }}
                            active={this.spellshape == SpellShape.Cone}
                        >
                            <span className="mso">change_history</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.spellshape = SpellShape.OuterCone;
                                this.renderUI?.call(this);
                            }}
                            active={this.spellshape == SpellShape.OuterCone}
                        >
                            <span className="msf">change_history</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.spellshape = SpellShape.Cube;
                                this.renderUI?.call(this);
                            }}
                            active={this.spellshape == SpellShape.Cube}
                        >
                            <span className="mso">crop_square</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.spellshape = SpellShape.Cylinder;
                                this.renderUI?.call(this);
                            }}
                            active={this.spellshape == SpellShape.Cylinder}
                        >
                            <span className="mso">crop_portrait</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.spellshape = SpellShape.Sphere;
                                this.renderUI?.call(this);
                            }}
                            active={this.spellshape == SpellShape.Sphere}
                        >
                            <span className="mso">panorama_fish_eye</span>
                        </ToolButton>
                    </div>
                </div>
                <div className='w-full flex p-2'>
                    <div className='flex justify-left pl-4 items-center min-w-20 w-20'>
                        Effect
                    </div>
                    <div className='grow flex flex-wrap justify-end'>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = null;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == null}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">remove</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Fire;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Fire}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">local_fire_department</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Acid;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Acid}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">science</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Ice;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Ice}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">ac_unit</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Lightning;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Lightning}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">bolt</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Wet;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Wet}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">water</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Poison;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Poison}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">skull</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Healing;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Healing}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">healing</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Oil;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Oil}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">local_gas_station</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Fog;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Fog}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">smoke_free</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Muted;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Muted}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">volume_off</span>
                        </ToolButton>
                        <ToolButton
                            onClick={() => {
                                this.areaEffect = BoardCondition.Blinded;
                                this.renderUI?.call(this);
                            }}
                            active={this.areaEffect == BoardCondition.Blinded}
                            disabled={this.spellshape == null}
                        >
                            <span className="mso">visibility_off</span>
                        </ToolButton>
                    </div>
                </div>
            </>
        )
    }

    customComponent() {
        if (!this.p0) {
            return <></>
        }

        const r = Math.sqrt(Math.pow(this.p0.x - this.p1.x, 2) + Math.pow(this.p0.y - this.p1.y, 2)) * BaseSize * 2 + BaseSize;

        const angle = Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x) * 180 / Math.PI;

        const coneAngle = Math.atan2(1, 2) * 180 / Math.PI;

        return (
            <div
                style={{
                    width: r + 'rem',
                    height: r + 'rem',
                    minWidth: r + 'rem',
                    minHeight: r + 'rem',
                    maxWidth: r + 'rem',
                    maxHeight: r + 'rem',
                    left: (((this.p0.x + 1) * BaseSize - BaseSize / 2) - r / 2) + 'rem',
                    top: (((this.p0.y + 1) * BaseSize - BaseSize / 2) - r / 2) + 'rem',
                    transform: 'rotate(' + angle + 'deg)'
                }}
                className='absolute pointer-events-none border-red-500'
            >

                {
                    this.spellshape == null || this.spellshape == SpellShape.Sphere || this.spellshape == SpellShape.Cylinder ? (
                        <div className='rounded-full absolute left-0 right-0 top-0 bottom-0 border-4 border-dashed'>
                        </div>
                    ) : null
                }

                {
                    this.spellshape == null || this.spellshape == SpellShape.Cube ? (
                        <div className='absolute top-0 left-0 right-0 bottom-0 border-4 border-dashed'></div>
                    ) : null
                }

                <div className='relative h-full w-full'>

                    {
                        this.spellshape == null || this.spellshape == SpellShape.Line ? (
                            <div className='absolute right-0 h-5 min-h-5 max-h-5 top-1/2 bottom-1/2 left-1/2 border-t-4 border-dashed'>&nbsp;</div>
                        ) : null
                    }

                    {
                        this.spellshape == null || this.spellshape == SpellShape.Cone ? (
                            <>
                                <div className='absolute top-1/4 bottom-1/4 left-0 right-0 border-r-4 border-dashed'>
                                    &nbsp;
                                </div>

                                <div className='absolute top-0 left-0 right-0 bottom-0' style={{
                                    transform: 'rotate(' + coneAngle + 'deg)'
                                }}>
                                    <div className='absolute top-1/2 bottom-1/2 left-1/2 border-t-4 border-dashed' style={{
                                        width: `${r / 4 * Math.sqrt(5)}rem`
                                    }}>&nbsp;</div>
                                </div>

                                <div className='absolute top-0 left-0 right-0 bottom-0' style={{
                                    transform: 'rotate(' + -(coneAngle) + 'deg)'
                                }}>
                                    <div className='absolute top-1/2 bottom-1/2 left-1/2 border-t-4 border-dashed' style={{
                                        width: `${r / 4 * Math.sqrt(5)}rem`
                                    }}>&nbsp;</div>
                                </div>
                            </>
                        ) : null
                    }

                    {
                        this.spellshape == null || this.spellshape == SpellShape.OuterCone ? (
                            <>
                                <div className='absolute top-0 bottom-0 left-0 right-0 border-r-4 border-dashed'>
                                    &nbsp;
                                </div>

                                <div className='absolute top-0 bottom-0 right-0' style={{
                                    top: r / 4 + r / 2 + 'rem',
                                    left: -((Math.sqrt(5) - 2) * r / 2) / 2 + 'rem',
                                }}>
                                    <div className='absolute border-t-4 border-dashed h-0' style={{
                                        width: `${r / 2 * Math.sqrt(5)}rem`,
                                        transform: 'rotate(' + (coneAngle) + 'deg)'
                                    }}></div>
                                </div>

                                <div className='absolute top-0 bottom-0 right-0' style={{
                                    top: r / 4 + 'rem',
                                    left: -((Math.sqrt(5) - 2) * r / 2) / 2 + 'rem',
                                }}>
                                    <div className='absolute border-t-4 border-dashed h-0' style={{
                                        width: `${r / 2 * Math.sqrt(5)}rem`,
                                        transform: 'rotate(' + -(coneAngle) + 'deg)'
                                    }}></div>
                                </div>
                            </>
                        ) : null
                    }

                    <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center flex-col text-white font-mono whitespace-nowrap' style={{
                        transform: 'rotate(' + (-angle) + 'deg)'
                    }}>
                        <div className='font-mono'>{(r / BaseSize * 1.5).toFixed(2)} m</div>
                        <div className='font-mono'>{(r / BaseSize * 5).toFixed(2)} ft</div>
                    </div>

                </div>
            </div>
        )
    }

}