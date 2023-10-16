import React from "react";
import { IAddComponent, ITListComponentProps, IViewComponent, TListComponent } from "./ui/TListComponent";
import { Note } from "../data/Note";
import { useForceUpdate } from "../utility";

export const NoteComponent = (props: IViewComponent<Note>) => {

    const forceUpdate = useForceUpdate();

    return (
        <div className="flex flex-col justify-end p-3 items-start w-full gap-2">
            <input
                className="text-2xl w-full bg-transparent focus:outline-none"
                defaultValue={props.data.name}
                placeholder="Title"
                onChange={(e) => {
                    props.data.name = e.target.value;
                    props.updateData(props.data);
                }}
            >
            </input>
            <textarea
                className="bg-transparent focus:outline-none w-full min-h-96"
                defaultValue={props.data.description}
                placeholder="Write your note here..."
                onChange={(e) => {
                    props.data.description = e.target.value;
                    props.updateData(props.data);
                    forceUpdate();
                }}
            />
            <div className="flex flex-wrap w-full h-fit gap-2">
                {
                    props.data.images.map((image, index) => {
                        return (
                            <div
                                key={index}
                                className="w-[31%] h-16 flex flex-col justify-end rounded-xl overflow-hidden"
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="flex bg-neutral-800/80 text-neutral-50">
                                    <button
                                        className="grow p-2 flex justify-center items-center hover:bg-neutral-900"
                                    >
                                        <span className="mso">visibility</span>
                                    </button>
                                    <button
                                        className="grow p-2 flex justify-center items-center hover:bg-neutral-900"
                                        onClick={() => {
                                            props.data.images.splice(index, 1);
                                            props.updateData(props.data);
                                            forceUpdate();
                                        }}
                                    >
                                        <span className="mso">delete</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
                <button
                    onClick={() => {
                        // file dialog to open image 
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.png,.jpg,.jpeg,.gif';
                        input.onchange = (e: any) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                props.data.images.push(reader.result as string);
                                props.updateData(props.data);
                                forceUpdate();
                                input.remove();
                            }
                            reader.readAsDataURL(file);
                        }
                        input.click();
                    }}
                    className="bg-orange-600/60 rounded-xl text-white w-[31%] h-16 p-2 px-4 flex justify-center items-center gap-2"
                >
                    <span className="mso">add</span> Image
                </button>
            </div>
        </div>
    )
}

export const NewNoteComponent = (props: IAddComponent<Note>) => {
    const noteRef = React.useRef<Note>({
        name: "",
        description: "",
        images: []
    });

    return (
        <div className="w-full flex flex-col gap-2">
            <NoteComponent
                data={noteRef.current}
                updateData={(data) => {
                    noteRef.current = data;
                }}
            />
            <div className="flex justify-end p-2">
                <button
                    className="flex justify-center items-center gap-2 bg-orange-600 rounded-xl p-2 px-4 text-white"
                    onClick={() => {
                        props.onSubmit(noteRef.current);
                    }}
                >
                    <span className="mso">add</span> Note
                </button>
            </div>
        </div>
    )
}

export const NoteList = (props: ITListComponentProps<Note>) => {
    return (
        <TListComponent<Note>
            {...props}
            viewComponent={NoteComponent}
            newComponent={NewNoteComponent}
        />
    )
}