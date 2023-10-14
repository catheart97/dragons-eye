import React from "react";
import { Spell } from "./Statblock";
import { Database, GM5CompendiumJSON } from "../database/Database";
import { UIGroup } from "../ui/UIGroup";

// todo: improve ux and ui design
export const NewSpellComponent = (props: {
    onSubmit: (spell: Spell) => void
}) => {
    const nameInput = React.useRef<HTMLInputElement>(null);
    const levelInput = React.useRef<HTMLInputElement>(null);
    const schoolInput = React.useRef<HTMLInputElement>(null);
    const componentsInput = React.useRef<HTMLInputElement>(null);
    const rangeInput = React.useRef<HTMLInputElement>(null);
    const timeInput = React.useRef<HTMLInputElement>(null);
    const durationInput = React.useRef<HTMLInputElement>(null);
    const descriptionInput = React.useRef<HTMLTextAreaElement>(null);
    const [ritual, setRitual] = React.useState(false);

    return (
        <div className="rounded-xl overflow-hidden bg-neutral-100">
            <div className='flex w-full justify-left items-center grow uppercase p-1 pl-2'>
                <input
                    className="w-full bg-transparent focus:outline-none"
                    ref={nameInput}
                    placeholder="Name"
                />
            </div>
            <div className='flex flex-col justify-left items-center w-full p-2'>
                <div className="flex rounded-xl bg-white w-full overflow-hidden text-center">
                    <div className="flex flex-col items-center justify-center grow basis-1/3">
                        <div className="text-xl grow bg-neutral-50 h-2/3 w-full">
                            <input
                                className="w-full text-center bg-neutral-50 focus:outline-none"
                                ref={levelInput}
                                placeholder="0"
                                type="number"
                            />
                        </div>
                        <div className="text-sm grow">Lvl</div>
                    </div>
                    <div className="flex flex-col items-center justify-center grow basis-1/3">
                        <div className="text-xl grow bg-neutral-50 h-2/3 w-full">
                            <input
                                className="w-full text-center bg-neutral-50 focus:outline-none"
                                ref={schoolInput}
                                placeholder="A"
                            />
                        </div>
                        <div className="text-sm grow">School</div>
                    </div>
                    <button
                        className="flex flex-col items-center justify-center grow basis-1/3"
                        onClick={() => {
                            setRitual(!ritual);
                        }}
                    >
                        <div className="text-xl grow bg-neutral-50 w-full h-2/3 flex justify-center items-center">{ritual ? <span className="mso">check</span> : <span className="mso">close</span>}</div>
                        <div className="text-sm grow">Ritual</div>
                    </button>
                </div>
                <UIGroup title="Range" className="pt-1 pb-1" noPadding>
                    <div className="text-end w-60">
                        <input
                            className="w-full bg-transparent text-end focus:outline-none"
                            ref={rangeInput}
                            placeholder="Touch / 50ft."
                        />
                    </div>
                </UIGroup>
                <UIGroup title="Components" className="pt-1 pb-1" noPadding>
                    <div className="text-end w-60">
                        <input
                            className="w-full bg-transparent text-end focus:outline-none"
                            ref={componentsInput}
                            placeholder="V, S, M"
                        />
                    </div>
                </UIGroup>
                <UIGroup title="Time" className="pt-1 pb-1" noPadding>
                    <div className="text-end w-60">
                        <input
                            className="w-full bg-transparent text-end focus:outline-none"
                            ref={timeInput}
                            placeholder="Instantaneous"
                        />
                    </div>
                </UIGroup>
                <UIGroup title="Duration" className="pt-1 pb-1" noPadding>
                    <div className="text-end w-60">
                        <input
                            className="w-full bg-transparent text-end focus:outline-none"
                            ref={durationInput}
                            placeholder="1 hour"
                        />
                    </div>
                </UIGroup>
                <div className="text-xs w-full">
                    <textarea
                        className="w-full bg-transparent focus:outline-none resize-none"
                        ref={descriptionInput}
                        placeholder="Description"
                    />
                </div>
                <div className="flex justify-end w-full">
                    <button
                        className="rounded-xl bg-orange-600 px-2 py-1 text-white flex justify-center items-center w-fit"
                        onClick={() => {
                            props.onSubmit({
                                name: nameInput.current?.value ?? "",
                                level: parseInt(levelInput.current?.value ?? "0"),
                                school: schoolInput.current?.value ?? "",
                                components: componentsInput.current?.value ?? "",
                                range: rangeInput.current?.value ?? "",
                                time: timeInput.current?.value ?? "",
                                duration: durationInput.current?.value ?? "",
                                description: descriptionInput.current?.value ?? "",
                                ritual: ritual
                            });
                        }}
                    >
                        <span className="mso">add</span> Add Spell
                    </button>
                </div>
            </div>
        </div>
    )
}

// todo: improve ux and ui design
export const SpellComponent = (props: {
    spell: Spell,
    onDeleteRequest?: () => void,
}) => {
    const [height, setHeight] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="rounded-xl overflow-hidden bg-neutral-100">
            <div className='w-full flex'>
                <div className='flex justify-left items-center grow uppercase p-1 pl-2'>
                    {props.spell.name}
                </div>
                <button
                    className='text-xs hover:bg-gray-200 w-8 p-1 flex justify-center items-center'
                    onClick={() => {
                        setHeight(height === 0 ? containerRef.current?.scrollHeight! : 0);
                    }}
                >
                    {
                        height === 0 ? <span className="mso">arrow_downward</span> : <span className="mso">arrow_upward</span>
                    }
                </button>
                {
                    props.onDeleteRequest ? (
                        <button
                            className='text-xs hover:bg-gray-200 w-8 flex justify-center items-center p-1'
                            onClick={props.onDeleteRequest}
                        >
                            <span className="mso">delete</span>
                        </button>
                    ) : null
                }

            </div>
            <div
                className="overflow-hidden"
                ref={containerRef}
                style={{
                    height: height,
                    transition: 'height 0.2s ease-in-out'
                }}
            >
                <div className='flex flex-col justify-left items-center w-full p-2'>
                    <div className="flex rounded-xl bg-white w-full overflow-hidden text-center">
                        <div className="flex flex-col items-center justify-center grow">
                            <div className="text-xl grow bg-neutral-50 h-2/3 w-full">{props.spell.level}</div>
                            <div className="text-sm grow">Lvl</div>
                        </div>
                        <div className="flex flex-col items-center justify-center grow">
                            <div className="text-xl grow bg-neutral-50 h-2/3 w-full">{props.spell.school}</div>
                            <div className="text-sm grow">School</div>
                        </div>
                        <div className="flex flex-col items-center justify-center grow">
                            <div className="text-xl grow bg-neutral-50 w-full h-2/3 flex justify-center items-center">{props.spell.ritual ? <span className="mso">check</span> : <span className="mso">close</span>}</div>
                            <div className="text-sm grow">Ritual</div>
                        </div>
                    </div>
                    <UIGroup title="Range" className="pt-1 pb-1" noPadding>
                        <div className="text-end w-full">{props.spell.range}</div>
                    </UIGroup>
                    <UIGroup title="Components" className="pt-1 pb-1" noPadding>
                        <div className="text-end w-full">{props.spell.components}</div>
                    </UIGroup>
                    <UIGroup title="Time" className="pt-1 pb-1" noPadding>
                        <div className="text-end w-full">{props.spell.time}</div>
                    </UIGroup>
                    <UIGroup title="Duration" className="pt-1 pb-1" noPadding>
                        <div className="text-end w-full">{props.spell.duration}</div>
                    </UIGroup>
                    <div className="text-xs">
                        {props.spell.description}
                    </div>
                </div>
            </div>
        </div>
    )
}