import React from "react";
// import { UIGroup } from "../ui/UIGroup";
import { Item, ItemType } from "../database/Item";
import { UIGroup } from "../ui/UIGroup";
import { Switch } from "../ui/Switch";


export const NewItemComponent = (props: {
    onSubmit: (item: Item, toDB: boolean) => void
}) => {
    const nameInput = React.useRef<HTMLInputElement>(null);
    const typeSelect = React.useRef<HTMLSelectElement>(null);
    const descriptionInput = React.useRef<HTMLTextAreaElement>(null);
    const valueInput = React.useRef<HTMLInputElement>(null);
    const weightInput = React.useRef<HTMLInputElement>(null);

    const [magic, setMagic] = React.useState(false);
    const [toDB, setToDB] = React.useState(true);

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
                            <select
                                className="w-full text-center bg-neutral-50 focus:outline-none"
                                ref={typeSelect}
                            >
                                {
                                    Object.values(ItemType).map((type) => {
                                        return (
                                            <option key={type}>{type2text(type)}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="text-sm grow">Type</div>
                    </div>
                    <button
                        className="flex flex-col items-center justify-center grow basis-1/3"
                        onClick={() => {
                            setMagic(!magic);
                        }}
                    >
                        <div className="text-xl grow bg-neutral-50 w-full h-2/3 flex justify-center items-center">{magic ? <span className="mso">check</span> : <span className="mso">close</span>}</div>
                        <div className="text-sm grow">Magical</div>
                    </button>
                </div>
                <UIGroup title="Value" className="pt-1 pb-1" noPadding>
                    <div className="text-end w-60">
                        <input
                            className="w-full bg-transparent text-end focus:outline-none"
                            ref={valueInput}
                            placeholder="0"
                        />
                    </div>
                </UIGroup>
                <UIGroup title="Weight" className="pt-1 pb-1" noPadding>
                    <div className="text-end w-60">
                        <input
                            className="w-full bg-transparent text-end focus:outline-none"
                            ref={weightInput}
                            placeholder="0"
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
                <UIGroup title="Save to DB">
                        <Switch
                            onChange={(e) => {
                                setToDB(e.target.checked);
                            }}
                        ></Switch>
                </UIGroup>
                <div className="flex justify-end w-full">
                    <button
                        className="rounded-xl bg-orange-600 px-2 py-1 text-white flex justify-center items-center w-fit"
                        onClick={() => {
                            props.onSubmit({
                                name: nameInput.current?.value ?? "",
                                type: typeSelect.current?.value as ItemType,
                                description: descriptionInput.current?.value ?? "",
                                value: parseInt(valueInput.current?.value ?? "0"),
                                weight: parseInt(weightInput.current?.value ?? "0"),
                                magic: magic
                            }, toDB);
                        }}
                    >
                        <span className="mso">add</span> Add Spell
                    </button>
                </div>
            </div>
        </div>
    )
}

const type2text = (type: ItemType) => {
    let typeText = ""
    switch (type) {
        case ItemType.HeavyArmor:
            typeText = "Heavy Armor";
            break;
        case ItemType.LightArmor:
            typeText = "Light Armor";
            break;
        case ItemType.MediumArmor:
            typeText = "Medium Armor";
            break;
        case ItemType.MeleeWeapon:
            typeText = "Shield";
            break;
        case ItemType.Potion:
            typeText = "Potion";
            break;
        case ItemType.RangedWeapon:
            typeText = "Ranged Weapon";
            break;
        case ItemType.Ring:
            typeText = "Ring";
            break;
        case ItemType.Scroll:
            typeText = "Scroll";
            break;
        case ItemType.Rod:
            typeText = "Rod";
            break;
        case ItemType.Staff:
            typeText = "Staff";
            break;
        case ItemType.Wand:
            typeText = "Wand";
            break;
        case ItemType.WondrousItem:
            typeText = "Wondrous Item";
            break;
    }
    return typeText;
}

export const ItemComponent = (props: {
    item: Item,
    onDeleteRequest?: () => void,
    onSelectionRequest?: () => void
}) => {
    const [expanded, setExpanded] = React.useState(false);

    let typeText = type2text(props.item.type);
    const isMagic = props.item.magic ? true : false;

    return (
        <div className="w-full h-fit">
            <div className="rounded-xl overflow-hidden bg-neutral-100 w-full h-fit">
                <div className='w-full flex'>
                    <button
                        className={'flex justify-start text-start items-center grow p-1 pl-2 ' + (props.onSelectionRequest ? "hover:bg-neutral-200 ease-in-out duration-200" : "cursor-default")}
                        onClick={props.onSelectionRequest}
                    >
                        {props.item.name}
                    </button>
                    <button
                        className='text-xs hover:bg-gray-200 w-8 p-1 flex justify-center items-center'
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    >
                        {
                            !expanded ? <span className="mso">arrow_downward</span> : <span className="mso">arrow_upward</span>
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
                {
                    expanded ? (
                        <div
                            className="overflow-hidden"
                        >
                            <div className='flex flex-col gap-2 justify-left items-center w-full p-2'>
                                <div className="flex rounded-xl bg-white w-full overflow-hidden text-center">
                                    <div className="flex flex-col items-center justify-center grow basis-1/3">
                                        <div className="text-xl grow bg-neutral-50 h-2/3 w-full">
                                            {typeText}
                                        </div>
                                        <div className="text-sm grow">Type</div>
                                    </div>
                                    <button
                                        className="flex flex-col items-center justify-center grow basis-1/3"
                                    >
                                        <div className="text-xl grow bg-neutral-50 w-full h-2/3 flex justify-center items-center">{isMagic ? <span className="mso">check</span> : <span className="mso">close</span>}</div>
                                        <div className="text-sm grow">Magical</div>
                                    </button>
                                </div>
                                <div className="text-xs">
                                    {props.item.description}
                                </div>
                                {
                                    props.item.value ? (
                                        <div className="text-xs">
                                            {props.item.value} gp
                                        </div>
                                    ) : null
                                }
                                {
                                    props.item.weight ? (
                                        <div className="text-xs">
                                            {props.item.weight} lb.
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}