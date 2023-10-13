import React from "react";
import { Spell } from "./Statblock";

// todo: improve ux and ui design
export const NewSpellComponent = (props: {
    onSubmit: (spell: Spell) => void
}) => {
    const [name, setName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [concentration, setConcentration] = React.useState<boolean>(false);
    const [ritual, setRitual] = React.useState<boolean>(false);
    const [school, setSchool] = React.useState<string>('');
    const [level, setLevel] = React.useState<number>(0);

    return (
        <div className='flex flex-col gap-2 p-2'>
            <div className='flex flex-col gap-2'>
                <label className='mso'>Name</label>
                <input
                    className='rounded-xl p-2'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label className='mso'>Description</label>
                <textarea
                    className='rounded-xl p-2'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label className='mso'>School</label>
                <input
                    className='rounded-xl p-2'
                    type='text'
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label className='mso'>Level</label>
                <input
                    className='rounded-xl p-2'
                    type='number'
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label className='mso'>Concentration</label>
                <input
                    className='rounded-xl p-2'
                    type='checkbox'
                    checked={concentration}
                    onChange={(e) => setConcentration(e.target.checked)}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label className='mso'>Ritual</label>
                <input
                    className='rounded-xl p-2'
                    type='checkbox'
                    checked={ritual}
                    onChange={(e) => setRitual(e.target.checked)}
                />
            </div>
            <button
                className='rounded-xl p-2 bg-gray-200 hover:bg-gray-300'
                onClick={() => {
                    props.onSubmit({
                        name,
                        description,
                        concentration,
                        ritual,
                        school,
                        level
                    })
                }}
            >
                Submit
            </button>
        </div>
    )
}

// todo: improve ux and ui design
export const SpellComponent = ( props: {
    spell: Spell,
    onDeleteRequest: () => void,
}) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <>
            <div className='w-full flex p-1 gap-3'>
                <div className='flex justify-left items-center pl-2 min-w-20 w-fit uppercase'>
                    {props.spell.name}
                </div>
                <div className='flex-grow flex flex-wrap justify-end'>
                    <button
                        className='text-xs bg-gray-200 hover:bg-gray-300 rounded px-1'
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'Hide' : 'Show'}
                    </button>
                    <button
                        className='text-xs bg-gray-200 hover:bg-gray-300 rounded px-1'
                        onClick={props.onDeleteRequest}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {expanded && (
                <div className='w-full flex p-1 gap-3'>
                    <div className='flex justify-left items-center pl-2 min-w-20 w-fit uppercase'>
                        {props.spell.description}
                    </div>
                </div>
            )}
        </>
    )
}