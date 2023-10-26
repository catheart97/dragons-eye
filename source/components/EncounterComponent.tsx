import React from "react";
import { Encounter } from "../data/Encounter";
import { IAddComponent, ITListComponentProps, IViewComponent, TListComponent } from "./ui/TListComponent";

import EncounterIcon from "../../resources/placeholders/encounter.png?base64"
import { UIGroup } from "./ui/UIGroup";
import { NumberInput } from "./ui/NumberInput";
import Markdown from "marked-react";
import { constructDefaultBoard } from "../data/Board";

export const NewEncounterComponent = (props: IAddComponent<Encounter>) => {
    const titleInput = React.useRef<HTMLInputElement>(null);
    const descriptionInput = React.useRef<HTMLTextAreaElement>(null);

    const [image, setImage] = React.useState<string | undefined>(undefined);
    return (
        <div className="flex flex-col rounded-xl"
            style={{
                backgroundImage: image ? `url(${image})` : `url(${EncounterIcon})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="bg-neutral-100/80">
                <div className='flex w-full justify-left items-center grow uppercase px-3 pt-2 pb-1'>
                    <input
                        className="w-full text-xl bg-transparent focus:outline-none"
                        ref={titleInput}
                        placeholder="Title"
                    />
                </div>
                <div className='flex flex-col justify-left items-center w-full p-2'>
                    <div className="flex rounded-xl bg-white w-full overflow-hidden text-center">
                        <div className="flex flex-col items-center justify-center grow basis-1/3">
                            <div className="grow bg-neutral-50 h-2/3 w-full">
                                <textarea
                                    className="w-full text-start bg-neutral-50 focus:outline-none p-1 px-2"
                                    ref={descriptionInput}
                                    placeholder="Description"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between p-2">
                    <button
                        className="flex justify-center hover:bg-neutral-100 rounded-xl items-center gap-2 p-2 px-4"
                        onClick={() => {
                            // file dialog to open image 
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.png,.jpg,.jpeg,.gif';
                            input.onchange = (e: any) => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onloadend = () => {
                                    setImage(reader.result as string);
                                    input.remove();
                                }
                            }
                            input.click();
                        }}
                    >
                        <span className="mso">image</span>
                    </button>
                    <button
                        className="rounded-xl bg-orange-600 flex justify-center items-center gap-2 text-white p-2 px-4"
                        onClick={() => {
                            props.onSubmit({
                                name: titleInput.current?.value ?? "",
                                description: descriptionInput.current?.value ?? "",
                                image: ""
                            });
                        }}
                    >
                        Add
                        <span className="mso">add</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export const EncounterComponent = (props: IViewComponent<Encounter>) => {

    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <div
            style={{
                backgroundImage: props.data.image ? `url(${props.data.image})` : `url(${EncounterIcon})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="w-full h-full"
        >
            <div className="bg-gradient-to-t from-black/90 to-black/60 flex flex-col justify-end p-3 items-start w-full">
                <input
                    className="text-2xl text-white w-full bg-transparent focus:outline-none"
                    value={props.data.name}
                    onChange={(e) => {
                        props.data.name = e.target.value;
                        props.updateData(props.data);
                    }}
                >
                </input>
                {
                    editMode ? (
                        <textarea
                            className="text-white bg-transparent focus:outline-none w-full"
                            value={props.data.description}
                            onChange={(e) => {
                                props.data.description = e.target.value;
                                props.updateData(props.data);
                            }}
                        />
                    ) : (
                        <div className="prose text-white">
                            <Markdown>{props.data.description}</Markdown>
                        </div>
                    )
                }
                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                // file dialog to open image 
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.png,.jpg,.jpeg,.gif';
                                input.onchange = (e: any) => {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = () => {
                                        props.data.image = reader.result as string;
                                        props.updateData(props.data);
                                        input.remove();
                                    }
                                }
                                input.click();
                            }}
                        >
                            <span className="mso text-white">image</span>
                        </button>
                        <button
                            onClick={() => {
                                setEditMode(!editMode);
                            }}
                        >
                            <span className="mso text-white">edit</span>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {
                            props.data.board ? (
                                <>
                                    <button
                                        onClick={() => {
                                            props.data.board = undefined;
                                            props.updateData(props.data);
                                        }}
                                    >
                                        <span className="mso text-white">delete</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            props.openBoard!(props.data.board!);
                                        }}
                                    >
                                        <span className="mso text-white">swords</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        let w = 1;
                                        let h = 1;

                                        props.dialogHandle!.current!.open(
                                            <>
                                                <UIGroup title="Width">
                                                    <NumberInput
                                                        onChange={(e) => {
                                                            w = e.target.valueAsNumber;
                                                        }}
                                                    />
                                                </UIGroup>
                                                <UIGroup title="Height">
                                                    <NumberInput
                                                        onChange={(e) => {
                                                            h = e.target.valueAsNumber;
                                                        }}
                                                    />
                                                </UIGroup>
                                            </>,
                                            {
                                                success: () => {
                                                    props.data.board = constructDefaultBoard(w, h);
                                                    props.updateData(props.data);
                                                },
                                                failure() {

                                                },
                                            },
                                            "Add Battlemap", false
                                        )
                                    }}
                                >
                                    <span className="mso text-white">add</span>
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export const EncounterList = (props: ITListComponentProps<Encounter>) => {
    return (
        <TListComponent<Encounter>
            {...props}
            newComponent={props.allowAdd ? NewEncounterComponent : undefined}
            viewComponent={EncounterComponent}
        />
    )
}