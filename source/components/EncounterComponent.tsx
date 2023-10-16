import React from "react";
import { Encounter } from "../data/Encounter";
import { IAddComponent, ITListComponentProps, IViewComponent, TListComponent } from "./ui/TListComponent";
import { constructDefaultBoard } from "../data/Board";

import EncounterIcon from "../../resources/placeholders/encounter.png"

export const NewEncounterComponent = (props: IAddComponent<Encounter>) => {
    const titleInput = React.useRef<HTMLInputElement>(null);
    const descriptionInput = React.useRef<HTMLTextAreaElement>(null);
    return (
        <div className="rounded-xl overflow-hidden bg-neutral-100">
            <div className='flex w-full justify-left items-center grow uppercase p-1 pl-2'>
                <input
                    className="w-full bg-transparent focus:outline-none"
                    ref={titleInput}
                    placeholder="Title"
                />
            </div>
            <div className='flex flex-col justify-left items-center w-full p-2'>
                <div className="flex rounded-xl bg-white w-full overflow-hidden text-center">
                    <div className="flex flex-col items-center justify-center grow basis-1/3">
                        <div className="text-xl grow bg-neutral-50 h-2/3 w-full">
                            <textarea
                                className="w-full text-center bg-neutral-50 focus:outline-none"
                                ref={descriptionInput}
                                placeholder="Description"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end p-2">
                <button
                    className="rounded-xl bg-green-500 text-white p-2"
                    onClick={() => {
                        props.onSubmit({
                            name: titleInput.current?.value ?? "",
                            description: descriptionInput.current?.value ?? "",
                            image: "",
                            board: constructDefaultBoard(10, 10) // todo: size inputs
                        });
                    }}
                >
                    <span className="mso">check</span>
                </button>
            </div>
        </div>
    )
}

export const EncounterComponent = (props: IViewComponent<Encounter>) => {
    return (
        <div
            style={{
                backgroundImage: props.data.image ? `url(${props.data.image})` : `url(${EncounterIcon})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="w-full h-full"
        >
            <div className="bg-gradient-to-t from-black/80 to-black/20 flex flex-col justify-end p-3 items-start w-full">
                <input
                    className="text-2xl text-white w-full bg-transparent focus:outline-none"
                    value={props.data.name}
                    onChange={(e) => {
                        props.data.name = e.target.value;
                        props.updateData(props.data);
                    }}
                >
                </input>
                <textarea
                    className="text-white bg-transparent focus:outline-none w-full"
                    value={props.data.description}
                    onChange={(e) => {
                        props.data.description = e.target.value;
                        props.updateData(props.data);
                    }}
                />
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