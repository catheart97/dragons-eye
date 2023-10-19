import React from "react"
import { DialogHandle } from "./Dialog"

export interface IAddComponent<T> {
    onSubmit: (data: T) => void
}

export interface IViewComponent<T> {
    data: T
    updateData: (data: T) => void
    setImage?: (image: string) => void
    dialogHandle?: React.RefObject<DialogHandle>
}

export interface ITListElementProps<T> {
    viewComponent: React.FC<IViewComponent<T>>
    onSelect?: (item: T) => void
    onDeleteRequest?: () => void
    onUpdateRequest: (data: T) => void
    setImage?: (image: string) => void
    dialogHandle?: React.RefObject<DialogHandle>
    data: T
    alwaysExpanded?: boolean
}

export const TListElementComponent = <T extends {
    name: string
}>(props: ITListElementProps<T>) => {
    const [expanded, setExpanded] = React.useState(props.alwaysExpanded ?? false);

    return (
        <div className="rounded-xl overflow-hidden bg-neutral-100">
            <div className='w-full flex justify-end'>
                {
                    props.alwaysExpanded ? (
                        <></>
                    ) : (
                        props.onSelect ? (
                            <button
                                onClick={() => {
                                    props.onSelect!(props.data)
                                }}
                                className="w-full grow p-2 flex items-center hover:bg-neutral-200 transition-all duration-200 ease-in-out"
                            >
                                {props.data.name}
                            </button>
                        ) : (
                            <div
                                className="w-full grow p-2 flex items-center"
                            >
                                {props.data.name}
                            </div>
                        )
                    )
                }
                {
                    props.onDeleteRequest ? (
                        <button
                            onClick={props.onDeleteRequest}
                            className="transition-all duration-200 ease-in-out hover:bg-red-500 p-2 hover:text-white flex items-center"
                        >
                            <span className="mso">delete</span>
                        </button>
                    ) : null
                }
                {
                    !props.alwaysExpanded ? (
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
                    ) : null
                }
            </div>
            {
                expanded ? (
                    <props.viewComponent
                        data={props.data}
                        updateData={props.onUpdateRequest}
                        setImage={props.setImage}
                        dialogHandle={props.dialogHandle}
                    ></props.viewComponent>
                ) : null
            }
        </div>
    )
}

export interface ITListComponentProps<T> {
    allowDelete?: boolean
    allowAdd?: boolean
    onUpdateData?: (data: T[]) => void
    onSelect?: (item: T) => void
    searchBar?: boolean
    data: Array<T>
    setImage?: (image: string) => void
    dialogHandle?: React.RefObject<DialogHandle>
    update: () => void
    alwaysExpanded?: boolean
    className?: string
}

export const TListComponent = <T extends { name: string }>(props: ITListComponentProps<T> & {
    newComponent?: React.FC<IAddComponent<T>>
    viewComponent: React.FC<IViewComponent<T>>
}) => {
    const [expanded, setExpanded] = React.useState(false);
    const [filter, setFilter] = React.useState("");
    return (
        <div className="flex flex-col w-full p-2 gap-2">
            {
                <div className="flex rounded-xl shadow items-center m-2">
                    <span className="mso p-2">search</span>
                    <input
                        className="grow h-full"
                        type="text"
                        onChange={(e) => {
                            setFilter(e.target.value);
                        }}
                    />
                    {
                        filter != "" && (
                            <button
                                onClick={() => {
                                    setFilter("");
                                }}
                            >
                                <span className="mso p-2">close</span>
                            </button>
                        )
                    }
                    {
                        props.newComponent ? (
                            <button
                                onClick={() => {
                                    setExpanded(!expanded);
                                }}
                            >
                                <span className="mso p-2">add</span>
                            </button>
                        ) : null
                    }
                </div>
            }
            <div className="px-2 w-full">
                {
                    expanded && props.newComponent && (
                        <div
                            className="h-fit transition-all duration-200 ease-in-out overflow-hidden rounded-xl shadow"
                        >
                            <props.newComponent
                                onSubmit={(data: T) => {
                                    props.data.push(data);
                                    props.onUpdateData?.(props.data);
                                    props.update();
                                }}
                            ></props.newComponent>
                        </div>
                    )
                }
            </div>
            <div className={props.className ?? "flex flex-col gap-2"}>
                {
                    props.data.map((t, i) => {
                        if (!t.name.toLowerCase().includes(filter.toLowerCase())) return null;
                        return (
                            <TListElementComponent
                                key={i}
                                data={t}
                                viewComponent={props.viewComponent}
                                onDeleteRequest={() => {
                                    props.data.splice(i, 1);
                                    props.onUpdateData?.(props.data);
                                    props.update();
                                }}
                                onUpdateRequest={(data: T) => {
                                    props.data[i] = data;
                                    props.onUpdateData?.(props.data);
                                    props.update();
                                }}
                                onSelect={props.onSelect}
                                setImage={props.setImage}
                                dialogHandle={props.dialogHandle}
                                alwaysExpanded={props.alwaysExpanded}
                            ></TListElementComponent>
                        )
                    })
                }
            </div>
        </div>
    )
}