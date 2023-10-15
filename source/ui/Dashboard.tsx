
export interface IDashboardElement {
    title?: string
    children: React.ReactNode
}

export const DashboardElement = (props: IDashboardElement) => {
    return (
        <div className="h-full min-h-96 overflow-y-hidden pr-2 min-w-96 grow shrink-0 w-96 flex flex-col gap-1">
            <div className="h-0 w-full p-2 rounded-xl p-2 bg-white grow flex flex-col gap-2 overflow-y-scroll">
                {
                    props.title && (
                        <div className="text-xl font-bold">{props.title}</div>
                    )
                }
                {props.children}
            </div>
        </div>
    )
}


export const Dashboard = (props: {
    children: React.ReactElement<IDashboardElement>[]
}) => {
    return (
        <div className="flex justify-start p-2 h-full grow w-0">
            {props.children}
        </div>
    )
}