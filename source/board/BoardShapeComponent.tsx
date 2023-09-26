import { Board, BoardPosition, BoardTerrain, BaseSize, TerrainColors, BoardCondition, ConditionIcons, BoardDecoratorType, BoardCreature, BoardItem, ItemTypeIcons, CreatureAttitudeColors, CreatureSizeDimension, CreatureTypeIcons, ItemType, DoorData, TrapData, TreasureData, ContainerData, NoteData, FurnitureData, LightSourceData, TreeData } from "./Board"
import { Tooltip, TooltipContent, TooltipTarget } from "../ui/Tooltip"

export const BoardShapeComponent = (props: {
    board: Board,
    position: BoardPosition
    onMouseDown?: (p: BoardPosition) => void
    onHover?: (p: BoardPosition) => void
    onMouseUp?: (p: BoardPosition) => void
}) => {

    const idx = props.position.x + props.position.y * props.board.width;
    const terrain = props.board.terrain[idx];

    if (terrain === BoardTerrain.Wall) {
        if (props.board.conditions[idx]) {
            delete props.board.conditions[idx];
        }
    }

    if (terrain == BoardTerrain.Water) {
        if (props.board.conditions[idx] == BoardCondition.Fire ||
            props.board.conditions[idx] == BoardCondition.Acid) {
            delete props.board.conditions[idx];
        }
    }

    const content = (
        <div
            className={
                'relative border-[1px] border-black border-dashed relative'
            }
            style={{
                width: BaseSize + 'rem',
                height: BaseSize + 'rem',
                minWidth: BaseSize + 'rem',
                minHeight: BaseSize + 'rem',
                maxWidth: BaseSize + 'rem',
                maxHeight: BaseSize + 'rem',
                backgroundColor: TerrainColors[props.board.terrain[idx]]
            }}
            onMouseOver={() => { props.onHover ? props.onHover(props.position) : null }}
            onClick={() => { props.onMouseDown ? props.onMouseDown(props.position) : null }}
            onMouseDown={() => { props.onMouseDown ? props.onMouseDown(props.position) : null }}
            onMouseUp={() => { props.onMouseUp ? props.onMouseUp(props.position) : null }}
        >
            {
                props.board.conditions[idx] ? (
                    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                        {
                            ConditionIcons[props.board.conditions[idx]]
                        }
                    </div>
                ) : null
            }
            {
                props.board.decorators[idx] ? (
                    props.board.decorators[idx]!.type === BoardDecoratorType.Creature ? (
                        <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none rounded-full flex items-center justify-center p-1 z-10">
                            <div className="bg-white h-full w-full rounded-full flex justify-center items-center shadow border-0 border-black text-white align-center" style={{
                                backgroundColor: CreatureAttitudeColors[(props.board.decorators[idx].attachment as BoardCreature).attitude],
                                width: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] + 'rem',
                                height: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] + 'rem',
                                minHeight: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] + 'rem',
                                minWidth: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] + 'rem',
                                fontSize: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] / 2 + 'rem'
                            }}>
                                <div
                                    style={{
                                        fontSize: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] / 2 + 'rem'
                                    }}
                                    className="flex justify-center items-center"
                                >
                                    {CreatureTypeIcons[(props.board.decorators[idx].attachment as BoardCreature).type]}
                                </div>
                                <div style={{
                                    fontSize: CreatureSizeDimension[(props.board.decorators[idx].attachment as BoardCreature).size] / 4 + 'rem'
                                }}>
                                    {(props.board.decorators[idx].attachment as BoardCreature).name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none rounded-full flex items-center justify-center p-1 z-10">
                            <div className="h-full w-full rounded-full flex justify-center items-center shadow border-0 border-black text-white align-center bg-black" style={
                                props.board.decorators[idx].attachment.type == ItemType.Tree ? {
                                    width: CreatureSizeDimension[((props.board.decorators[idx].attachment as BoardItem).data as TreeData).size] + 'rem',
                                    height: CreatureSizeDimension[((props.board.decorators[idx].attachment as BoardItem).data as TreeData).size] + 'rem',
                                    minHeight: CreatureSizeDimension[((props.board.decorators[idx].attachment as BoardItem).data as TreeData).size] + 'rem',
                                    minWidth: CreatureSizeDimension[((props.board.decorators[idx].attachment as BoardItem).data as TreeData).size] + 'rem',
                                    fontSize: CreatureSizeDimension[((props.board.decorators[idx].attachment as BoardItem).data as TreeData).size] / 2 + 'rem'
                                } : {}
                            }>
                                {
                                    ItemTypeIcons[(props.board.decorators[idx].attachment as BoardItem).type]
                                }
                            </div>
                        </div>
                    )
                ) : null
            }
        </div>
    )

    return (
        props.board.decorators[idx] ? (
            <Tooltip>
                <TooltipTarget>
                    {content}
                </TooltipTarget>
                <TooltipContent>
                    {
                        props.board.decorators[idx].type === BoardDecoratorType.Creature ? (
                            (props.board.decorators[idx].attachment as BoardCreature).name
                        ) : (
                            <div className="flex flex-col gap-1">
                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Door ? (
                                        <>{(props.board.decorators[idx].attachment as BoardItem).data as DoorData}</>
                                    ) : null
                                }
                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Trap ? (
                                        <>
                                            <div>{((props.board.decorators[idx].attachment as BoardItem).data as TrapData).armed}</div>
                                            <div>
                                            {((props.board.decorators[idx].attachment as BoardItem).data as TrapData).effect}
                                            </div>
                                        </>
                                    ) : null
                                }
                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Treasure ? (
                                        ((props.board.decorators[idx].attachment as BoardItem).data as TreasureData).map((v, i) => {
                                            return (
                                                <div key={i}>
                                                    {v}
                                                </div>
                                            )
                                        })
                                    ) : null
                                }
                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Container ? (
                                        ((props.board.decorators[idx].attachment as BoardItem).data as ContainerData).map((v, i) => {
                                            return (
                                                <div key={i}>
                                                    {v}
                                                </div>
                                            )
                                        })
                                    ) : null
                                }

                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Note ? (
                                        ((props.board.decorators[idx].attachment as BoardItem).data as NoteData)
                                    ) : null
                                }
 
                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.LightSource ? (
                                        ((props.board.decorators[idx].attachment as BoardItem).data as LightSourceData)
                                    ) : null
                                }

                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Furniture ? (
                                        <div>{((props.board.decorators[idx].attachment as BoardItem).data as FurnitureData).type}</div>
                                    ) : null
                                }
                                {
                                    (props.board.decorators[idx].attachment as BoardItem).type == ItemType.Furniture ? (
                                        ((props.board.decorators[idx].attachment as BoardItem).data as FurnitureData).contents.map((v, i) => { 
                                            return (
                                                <div key={i}>
                                                    {v}
                                                </div>
                                            )
                                        })
                                    ) : null
                                }

                            </div>   
                        )
                    }
                </TooltipContent>
            </Tooltip>
        ) : content
    )
}