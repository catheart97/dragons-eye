import { Board, BoardPosition, BoardTerrain, BaseSize, TerrainColors, BoardCondition, ConditionIcons, BoardDecoratorType, BoardCreature, CreatureType, CreatureAttitude, CreatureSize, BoardItem } from "./Board"
import { Tooltip, TooltipContent, TooltipTarget } from "../ui/Tooltip"

const CreatureAttitudeColors: { [key in CreatureAttitude]: string } = {
    [CreatureAttitude.Player]: '#22c55e',
    [CreatureAttitude.NPC]: '#a78bfa',
    [CreatureAttitude.Hostile]: '#f87171'
}

const CreatureTypeIcons: { [key in CreatureType]: JSX.Element } = {
    [CreatureType.Humanoid]: <span className="msf">person</span>,
    [CreatureType.Animal]: <span className="msf">pets</span>,
    [CreatureType.Monster]: <span className="msf">diversity_2</span>
}

const CreatureSizeDimension: { [key in CreatureSize]: number } = {
    [CreatureSize.Tiny]: 1,
    [CreatureSize.MediumSmall]: 2,
    [CreatureSize.Large]: 4,
    [CreatureSize.Huge]: 8,
    [CreatureSize.Gargantuan]: 16,
}

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
            // onMouseDown={() => { props.onMouseDown ? props.onMouseDown(props.position) : null }}
            onClick={() => { props.onMouseDown ? props.onMouseDown(props.position) : null }}
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
                                backgroundColor: CreatureAttitudeColors[(props.board.decorators[idx].data as BoardCreature).attitude],
                                width: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] + 'rem',
                                height: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] + 'rem',
                                minHeight: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] + 'rem',
                                minWidth: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] + 'rem',
                                fontSize: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] / 2 + 'rem'
                            }}>
                                <div
                                    style={{
                                        fontSize: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] / 2 + 'rem'
                                    }}
                                    className="flex justify-center items-center"
                                >
                                    {CreatureTypeIcons[(props.board.decorators[idx].data as BoardCreature).type]}
                                </div>
                                <div style={{
                                    fontSize: CreatureSizeDimension[(props.board.decorators[idx].data as BoardCreature).size] / 4 + 'rem'
                                }}>
                                    {(props.board.decorators[idx].data as BoardCreature).name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none rounded-full flex items-center justify-center p-1 z-10">
                            <div className="bg-white h-full w-full rounded-full flex justify-center items-center shadow border-0 border-black text-white align-center bg-black">
                                <span className="msf text-2xl text-white">takeout_dining</span>
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
                            (props.board.decorators[idx].data as BoardCreature).name
                        ) : (
                            <>
                                {
                                    (props.board.decorators[idx].data as BoardItem).contents.forEach((v, i) => {
                                        return (
                                            <div key={i}>{v}</div>
                                        )
                                    })
                                }
                            </>   
                        )
                    }
                </TooltipContent>
            </Tooltip>
        ) : content
    )
}