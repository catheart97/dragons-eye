import React from "react";
// import { UIGroup } from "../ui/UIGroup";
import { Item, ItemType } from "../data/Item";
import { UIGroup } from "./ui/UIGroup";
import { IAddComponent, ITListComponentProps, IViewComponent, TListComponent } from "./ui/TListComponent";


export const NewItemComponent = (props: IAddComponent<Item>) => {
    const nameInput = React.useRef<HTMLInputElement>(null);
    const typeSelect = React.useRef<HTMLSelectElement>(null);
    const descriptionInput = React.useRef<HTMLTextAreaElement>(null);
    const valueInput = React.useRef<HTMLInputElement>(null);
    const weightInput = React.useRef<HTMLInputElement>(null);
    const [magic, setMagic] = React.useState(false);

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
                                            <option key={type} value={type}>{type2text(type)}</option>
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
                            });
                        }}
                    >
                        <span className="mso">add</span> Add Item
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
            typeText = "Melee Weapon";
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

import ItemIcon from "../../resources/placeholders/item.png?base64";

export const ItemComponent = (props: IViewComponent<Item>) => {
    let typeText = type2text(props.data.type);
    const isMagic = props.data.magic ? true : false;
    return (
        <div className="text-3xl h-72 w-full" style={{
            backgroundImage: props.data.image ? `url(${props.data.image})` : `url(${ItemIcon})`,
            backgroundPosition: "top",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
        }} >
            <div className="flex flex-col h-full justify-end w-full p-3 bg-gradient-to-b from-neutral-100/70 to-neutral-100">
                <div className="flex justify-end gap-2">
                    {
                        props.data.image ? (
                            <button
                                className="flex items-center justify-center hover:bg-neutral-200 p-2 text-base rounded-xl"
                                onClick={() => {
                                    props.data.image = "";
                                    props.updateData(props.data);
                                }}
                            >
                                <span className="mso">close</span>
                            </button>
                        ) : null
                    }

                    <button
                        className="flex items-center justify-center hover:bg-neutral-200 p-2 text-base rounded-xl"
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.onchange = (_e) => {
                                if (input.files && input.files.length > 0) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        if (e.target?.result) {
                                            props.data.image = e.target.result as string;
                                            props.updateData(props.data);
                                            input.remove();
                                        }
                                    }
                                    reader.readAsDataURL(input.files[0]);
                                }
                            }
                            input.click();
                        }}
                    >
                        <span className="mso">image</span>
                    </button>
                </div>
                <div className='flex flex-col gap-2 justify-left items-center w-full p-2'>
                    <div className="flex rounded-xl bg-white w-full overflow-hidden text-center">
                        <div className="flex flex-col items-center justify-center grow basis-1/3">
                            <div className="text-lg grow bg-neutral-50 h-2/3 w-full">
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
                        {props.data.description}
                    </div>
                    {
                        props.data.value ? (
                            <div className="text-xs">
                                {props.data.value} gp
                            </div>
                        ) : null
                    }
                    {
                        props.data.weight ? (
                            <div className="text-xs">
                                {props.data.weight} lb.
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}

export const ItemList = (props: ITListComponentProps<Item>) => {
    return (
        <TListComponent
            {...props}
            newComponent={NewItemComponent}
            viewComponent={ItemComponent}
        />
    )
}