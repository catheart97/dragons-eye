import React from "react";
import { DEAbstractDate, DECalendarStats, DEMonthStats, DEMoon, DESeasonStats, MoonIcon, addOneDay, getMoonPhases, getSeason, getSunHours, getWeekday } from "../data/Calendar";
import { Campaign } from "../data/Campaign";
import { useForceUpdate } from "../utility";
import { DialogHandle } from "./ui/Dialog";
import { NumberInput } from "./ui/NumberInput";
import { UIGroup } from "./ui/UIGroup";

export const createCalendar = async (
    dialogHandle: React.MutableRefObject<DialogHandle | null>,
) => {

    let calendar: DECalendarStats = {
        months: [] as Array<DEMonthStats>,
        week: [] as Array<string>,
        clock: 24,
        seasons: [] as Array<DESeasonStats>,
        moons: [] as Array<DEMoon>,
    };

    let success = false;
    await new Promise<void>((resolve) => {
        dialogHandle.current?.open(
            (
                <div className="w-full h-full flex justify-center">
                    <NewCalendarComponent
                        onChange={(cal) => {
                            calendar = cal;
                        }}
                    />
                </div>
            ),
            {
                success(): void {
                    success = true;
                    resolve();
                },
                failure(): void {
                    resolve();
                }
            },
            "Create Calendar",
            true
        );
    });

    return success ? calendar : null;
}

export const NewCalendarComponent = (props: {
    onChange: (calendar: DECalendarStats) => void
}) => {

    const calendar = React.useRef<DECalendarStats>({
        months: [],
        week: [],
        clock: 24,
        seasons: [],
        moons: []
    }).current;
    // const calendar = React.useRef<DECalendarStats>(structuredClone(EarthCalendar.stats)).current;

    React.useEffect(() => {
        props.onChange(calendar);
    }, []);


    const weekText = React.useRef<string>("");
    const monthText = React.useRef<string>("");
    const monthDays = React.useRef<number>(0);

    const seasonText = React.useRef<string>("");
    const seasonSunhours = React.useRef<number>(0);
    const seasonStart = React.useRef<DEAbstractDate>({
        month: 1,
        day: 1,
    });

    const moonText = React.useRef<string>("");
    const moonCycle = React.useRef<number>(0);

    const forceUpdate = useForceUpdate();

    return (
        <div className="container flex flex-col items-center">
            <UIGroup
                title="Clock"
                className="w-96 p-2"
            >
                <div className="flex flex-col gap-1 w-96">
                    <small>Hours per Day</small>
                    <NumberInput
                        min={2}
                        className="m-0"
                        defaultValue={calendar.clock}
                        onChange={(e) => {
                            calendar.clock = e.target.valueAsNumber;
                        }}
                    />
                </div>
            </UIGroup>
            <UIGroup
                title="Week"
                className="w-96  p-2"
            >
                <div className="flex w-96 gap-1 flex-col">
                    <div className="flex flex-col gap-1 w-full">
                        <small>Name of Weekday</small>
                        <div className="w-full rounded-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4">
                            <input
                                className="p-1 m-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed ring-0 focus:outline-none  grow"
                                onChange={(e) => {
                                    weekText.current = e.target.value;
                                }}
                            />
                            <button
                                className="px-3 text-xl p-1 bg-orange-600 text-white items-center justify-center flex w-fit select-none"
                                onClick={() => {
                                    calendar.week.push(weekText.current);
                                    props.onChange(calendar);
                                    forceUpdate();
                                }}
                            >
                                <span className="mso">add</span>
                            </button>
                        </div>
                    </div>
                </div>
                {
                    calendar.week.length > 0 ? (
                        <hr
                            className="w-full m-2"
                        ></hr>
                    ) : null
                }
                <div className="w-full flex flex-col gap-2 items-end">
                    {
                        calendar.week.map((day, i) => (
                            <div className="w-96 rounded-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4" key={i}>
                                <input
                                    className="p-1 m-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed ring-0 focus:outline-none  grow"
                                    defaultValue={day}
                                    onChange={(e) => {
                                        calendar.week[i] = e.target.value;
                                        props.onChange(calendar);
                                    }}
                                />
                                <button
                                    className="px-3 text-xl p-1 bg-orange-600 text-white items-center justify-center flex w-fit select-none"
                                    onClick={() => {
                                        calendar.week.splice(i, 1);
                                        props.onChange(calendar);
                                        forceUpdate();
                                    }}
                                >
                                    <span className="mso">delete</span>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </UIGroup>
            <UIGroup
                title="Months"
                className="w-96 p-2"
            >
                <div className="flex w-full gap-2 justify-end w-96">

                    <div className="flex items-end w-96">
                        <div className="flex flex-col gap-1 w-full">
                            <small>Name of Month</small>
                            <input
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full rounded-l-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    monthText.current = e.target.value;
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <small>Number of Days</small>
                            <input
                                type="number"
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    monthDays.current = e.target.valueAsNumber;
                                }}
                            />
                        </div>

                        <button
                            className="px-3 text-xl h-8 p-1 bg-orange-600 text-white items-center justify-center flex w-fit select-none rounded-r-xl ring-neutral-600 ring-2"
                            onClick={() => {
                                calendar.months.push({
                                    name: monthText.current,
                                    days: monthDays.current,
                                });
                                props.onChange(calendar);
                                forceUpdate();
                            }}
                        >
                            <span className="mso">add</span>
                        </button>
                    </div>
                </div>
                {
                    calendar.months.length > 0 ? (
                        <hr
                            className="w-full m-2"
                        ></hr>
                    ) : null
                }
                <div className="w-96 flex flex-col gap-2">
                    {
                        calendar.months.map((month, i) => (
                            <div className="flex w-full" key={i}>
                                <div className="flex flex-col gap-1 w-full">
                                    <input
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full rounded-l-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={month.name}
                                        onChange={(e) => {
                                            calendar.months[i].name = e.target.value;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <input
                                        type="number"
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={month.days}
                                        onChange={(e) => {
                                            calendar.months[i].days = e.target.valueAsNumber;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <button
                                    className="px-3 text-xl h-8 p-1 bg-red-600 text-white items-center justify-center flex w-fit select-none rounded-r-xl ring-neutral-600 ring-2"
                                    onClick={() => {
                                        calendar.months.splice(i, 1);
                                        props.onChange(calendar);
                                        forceUpdate();
                                    }}
                                >
                                    <span className="mso">remove</span>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </UIGroup>
            <UIGroup
                title="Seasons"
                className="w-96 p-2 items-end"
            >
                <div className="flex w-full gap-2 justify-end w-96">

                    <div className="flex gap-0 items-end w-96">
                        <div className="flex flex-col gap-1 grow">
                            <small>Name of Season</small>
                            <input
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full rounded-l-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2 grow"
                                onChange={(e) => {
                                    seasonText.current = e.target.value;
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 shrink">
                            <small>Sun Hours per Day</small>
                            <input
                                type="number"
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none shrink w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    seasonSunhours.current = e.target.valueAsNumber;
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 shrink">
                            <small>Start Month</small>
                            <input
                                type="number"
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  shrink w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    seasonStart.current.month = e.target.valueAsNumber;
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 shrink">
                            <small>Start Day</small>
                            <input
                                type="number"
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral
                            -600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    seasonStart.current.day = e.target.valueAsNumber;
                                }}
                            />
                        </div>
                        <button
                            className="px-3 text-xl h-8 p-1 bg-orange-600 text-white items-center justify-center flex w-fit select-none rounded-r-xl ring-neutral-600 ring-2"
                            onClick={() => {
                                calendar.seasons.push({
                                    name: seasonText.current,
                                    sunHoursPerDay: seasonSunhours.current,
                                    start: structuredClone(seasonStart.current),
                                });
                                props.onChange(calendar);
                                forceUpdate();
                            }}
                        >
                            <span className="mso">add</span>
                        </button>
                    </div>
                </div>

                {
                    calendar.seasons.length > 0 ? (
                        <hr
                            className="w-full m-2"
                        ></hr>
                    ) : null
                }
                <div className="w-96 flex flex-col gap-2">
                    {
                        calendar.seasons.map((season, i) => (
                            <div className="flex w-full gap-0" key={i}>
                                <div className="flex flex-col gap-1 grow">
                                    <input
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full rounded-l-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={season.name}
                                        onChange={(e) => {
                                            calendar.seasons[i].name = e.target.value;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 shrink">
                                    <input
                                        type="number"
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none shrink w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={season.sunHoursPerDay}
                                        onChange={(e) => {
                                            calendar.seasons[i].sunHoursPerDay = e.target.valueAsNumber;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 shrink">
                                    <input
                                        type="number"
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  shrink w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={season.start.month}
                                        onChange={(e) => {
                                            calendar.seasons[i].start.month = e.target.valueAsNumber;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 shrink">
                                    <input
                                        type="number"
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full overflow-hidden flex ring-neutral-600 ring-2
                                        active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={season.start.day}
                                        onChange={(e) => {
                                            calendar.seasons[i].start.day = e.target.valueAsNumber;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <button
                                    className="px-3 text-xl h-8 p-1 bg-red-600 text-white items-center justify-center flex w-fit select-none rounded-r-xl ring-neutral-600 ring-2"
                                    onClick={() => {
                                        calendar.seasons.splice(i, 1);
                                        props.onChange(calendar);
                                        forceUpdate();
                                    }}
                                >
                                    <span className="mso">remove</span>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </UIGroup>
            <UIGroup
                title="Moons"
                className="w-96 p-2"
            >
                <div className="flex w-full gap-2 justify-end w-96">

                    <div className="flex gap-0 items-end w-96">
                        <div className="flex flex-col gap-1 grow">
                            <small>Name of Moon</small>
                            <input
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full rounded-l-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    moonText.current = e.target.value;
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 shrink">
                            <small>Days per Cycle</small>
                            <input
                                type="number"
                                className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none shrink w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                onChange={(e) => {
                                    moonCycle.current = e.target.valueAsNumber;
                                }}
                            />
                        </div>
                        <button
                            className="px-3 text-xl h-8 p-1 bg-orange-600 text-white items-center justify-center flex w-fit select-none rounded-r-xl ring-neutral-600 ring-2"
                            onClick={() => {
                                calendar.moons.push({
                                    name: moonText.current,
                                    cycle: moonCycle.current,
                                });
                                props.onChange(calendar);
                                forceUpdate();
                            }}
                        >
                            <span className="mso">add</span>
                        </button>

                    </div>
                </div>
                {
                    calendar.moons.length > 0 ? (
                        <hr
                            className="w-full m-2"
                        ></hr>
                    ) : null
                }
                <div className="w-96 flex flex-col gap-2">
                    {
                        calendar.moons.map((moon, i) => (
                            <div className="flex w-full gap-0" key={i}>
                                <div className="flex flex-col gap-1 grow">
                                    <input
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none  grow w-full rounded-l-xl overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={moon.name}
                                        onChange={(e) => {
                                            calendar.moons[i].name = e.target.value;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 shrink">
                                    <input
                                        type="number"
                                        className="p-1 h-8 flex items-center justify-center pl-3 pr-3 pointer-events-auto transition-all linear duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none shrink w-full overflow-hidden flex ring-neutral-600 ring-2 active:ring-neutral-600 focus:ring-4 ring-neutral-600 ring-2"
                                        defaultValue={moon.cycle}
                                        onChange={(e) => {
                                            calendar.moons[i].cycle = e.target.valueAsNumber;
                                            props.onChange(calendar);
                                        }}
                                    />
                                </div>
                                <button
                                    className="px-3 text-xl h-8 p-1 bg-red-600 text-white items-center justify-center flex w-fit select-none rounded-r-xl ring-neutral-600 ring-2"
                                    onClick={() => {
                                        calendar.moons.splice(i, 1);
                                        props.onChange(calendar);
                                        forceUpdate();
                                    }}
                                >
                                    <span className="mso">remove</span>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </UIGroup>
        </div>
    )
}

export const CalendarComponent = (props: {
    campaign: React.RefObject<Campaign>
    update: () => void
    player?: boolean
}) => {

    const calendar = props.campaign.current!.calendar!;
    const [editMode, setEditMode] = React.useState<boolean>(false);

    const phases = getMoonPhases(calendar.current, calendar);
    const sunHours = getSunHours(calendar.current, calendar);

    const mousePos = React.useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    const weekday = getWeekday(calendar.current, calendar);

    return (
        <div className="h-24 w-72 h-24 rounded-full bg-neutral-50/80 flex items-center justify-end  backdrop-blur text-neutral-800">

            <div className="grow flex flex-col justify-center py-4 pl-4 pr-2 text-neutral-600 gap-1">
                <div className="w-full flex gap-2 justify-end">
                    {
                        editMode ? (
                            <div className="rounded-xl grow flex items-stretch gap-0 overflow-hidden text-center">
                                <input
                                    type="number"
                                    min={1}
                                    max={calendar.stats.months.length}
                                    className="m-0 p-0 grow text-center bg-black/20"
                                    defaultValue={calendar.current.day}
                                    onChange={(e) => {
                                        calendar.current.day = e.target.valueAsNumber;
                                        props.update();
                                    }}
                                />
                                <input
                                    type="number"
                                    min={1}
                                    max={calendar.stats.months.length}
                                    className="m-0 p-0 grow text-center bg-black/20"
                                    defaultValue={calendar.current.month}
                                    onChange={(e) => {
                                        calendar.current.month = e.target.valueAsNumber;
                                        props.update();
                                    }}
                                />
                                <input
                                    type="number"
                                    min={1}
                                    max={calendar.stats.months.length}
                                    className="m-0 p-0 grow text-center bg-black/20"
                                    defaultValue={calendar.current.year}
                                    onChange={(e) => {
                                        calendar.current.year = e.target.valueAsNumber;
                                        props.update();
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <div>{calendar.current.day}</div>
                                <div className="font-bold">{calendar.stats.months[calendar.current.month - 1].name}</div>
                                <div>{calendar.current.year}</div>
                            </>
                        )
                    }

                </div>
                <div className="w-full flex justify-end items-center text-xs gap-3">
                    <div>
                        {weekday}
                        {
                            props.player ? <></> : (
                                <>&nbsp;({calendar.stats.week.findIndex((day) => day === weekday) + 1})</>
                            )
                        }
                    </div>
                    <div>
                        {
                            getSeason(calendar.current, calendar).name
                        }
                    </div>
                </div>
                <div className="w-full flex justify-end items-center text-xs gap-3">

                    {
                        Object.keys(phases).map((key, i) => {
                            return (
                                <div className="flex items-center gap-1" key={key}>
                                    {key}
                                    <MoonIcon
                                        phase={phases[key as keyof typeof phases]}
                                        key={i}
                                        height={12}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                {
                    !props.player ? (
                        <div className="flex w-full justify-end items-center gap-2 text-xs">
                            <button
                                className="focus:outline-none transition-all hover:scale-110 active:scale-100 duration-200 ease-in"
                                onClick={() => {
                                    delete props.campaign.current?.calendar;
                                    props.update();
                                }}
                            >
                                <span className="msf text-neutral-600">delete</span>
                            </button>
                            <button
                                className="focus:outline-none transition-all hover:scale-110 active:scale-100 duration-200 ease-in"
                                onClick={() => {
                                    setEditMode(!editMode);
                                }}
                            >
                                <span className="msf text-neutral-600">edit</span>
                            </button>

                            <button
                                className=""
                                onClick={() => {
                                    // add one year 
                                    calendar.current.year++;
                                    props.update();
                                }}
                            >
                                <span className="msf text-neutral-600">clock_loader_90</span>
                            </button>

                            <button
                                className=""
                                onClick={() => {
                                    // add one week 
                                    for (let i = 0; i < calendar.stats.week.length; i++) {
                                        calendar.current = addOneDay(calendar.current, calendar);
                                    }
                                    props.update();
                                }}
                            >
                                <span className="msf text-neutral-600">clock_loader_60</span>
                            </button>

                            <button
                                className=""
                                onClick={() => {
                                    props.campaign.current!.calendar!.current = addOneDay(calendar.current, calendar);
                                    props.update();
                                }}
                            >
                                <span className="msf text-neutral-600">clock_loader_40</span>
                            </button>
                            <button
                                className=""
                                onClick={() => {
                                    // add one hour 
                                    const newHour = calendar.current.hours + 1;
                                    if (newHour >= calendar.stats.clock) {
                                        calendar.current = addOneDay(calendar.current, calendar);
                                        calendar.current.hours = 0;
                                    } else {
                                        calendar.current.hours = newHour;
                                    }
                                    props.update();
                                }}
                            >
                                <span className="msf text-neutral-600">clock_loader_20</span>
                            </button>
                            <button
                                className=""
                                onClick={() => {
                                    // add one minute 
                                    const newMinute = calendar.current.minutes + 1;
                                    if (newMinute >= 60) {
                                        const newHour = calendar.current.hours + 1;
                                        if (newHour >= calendar.stats.clock) {
                                            calendar.current = addOneDay(calendar.current, calendar);
                                            calendar.current.hours = 0;
                                        } else {
                                            calendar.current.hours = newHour;
                                        }
                                        calendar.current.minutes = 0;
                                    } else {
                                        calendar.current.minutes = newMinute;
                                    }
                                    props.update();
                                }}
                            >
                                <span className="msf text-neutral-600">clock_loader_10</span>
                            </button>

                        </div>
                    ) : null
                }
            </div >

            <div className="bg-neutral-600 h-24 w-24 relative rounded-full overflow-hidden">

                {/** draw ticks for each hour (bottom midnight) */}

                <div className="absolute top-0 left-0 right-0 bottom-0 h-24 w-24 flex items-center justify-center">
                    {
                        Array.from(Array(calendar.stats.clock).keys()).map((i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-12 bg-neutral-100"
                                style={{
                                    transform: `rotate(${i * 360 / calendar.stats.clock}deg) translate(0, -50%)`,
                                    transformOrigin: "center"
                                }}
                            ></div>
                        ))
                    }
                </div>

                {/** draw arc for daytime */}
                <div className="absolute top-0 left-0 right-0 bottom-0 h-24 w-24 flex items-center justify-center">
                    {createSVGArc(
                        50, 50, 47,
                        Math.PI / 2 - (sunHours / 2) / calendar.stats.clock * Math.PI * 2,
                        Math.PI / 2 + (sunHours / 2) / calendar.stats.clock * Math.PI * 2
                    )}
                </div>

                {/** draw clock hand */}
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 h-24 w-24 flex items-center justify-center"
                    onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        mousePos.current = {
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                        };
                    }}
                    onMouseMove={(e) => {
                        if (e.buttons === 1) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            let angle = Math.atan2(y - 50, x - 50) - Math.PI / 2;
                            let oldAngle = Math.atan2(mousePos.current.y - 50, mousePos.current.x - 50) - Math.PI / 2;
                            let forward = false;
                            if (oldAngle < angle) {
                                forward = true;
                            }

                            if (angle < 0) {
                                angle += Math.PI * 2;
                            }

                            const minutesPerDay = calendar.stats.clock * 60;

                            const minuteFraction = Math.round(
                                angle / (Math.PI * 2) * minutesPerDay
                            )
                            const hours = Math.floor(minuteFraction / 60);
                            const minutes = minuteFraction % 60;

                            // if loop over midnight increase day 
                            if (hours < calendar.current.hours && forward) {
                                calendar.current = addOneDay(calendar.current, calendar);
                            }

                            calendar.current.hours = hours;
                            calendar.current.minutes = minutes;

                            mousePos.current = {
                                x: x,
                                y: y
                            };

                            props.update();
                        }
                    }}
                >
                    <div className="absolute w-2 h-12 pt-2" style={{
                        transform: `rotate(${(calendar.current.hours + calendar.current.minutes / 60) / calendar.stats.clock * 360 + 180}deg) translate(0, -50%)`,
                        transformOrigin: "center"
                    }}>
                        <div className="bg-neutral-600 rounded-full h-2 w-2">
                        </div>
                    </div>
                </div>


                {/** current time */}
                <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center text-neutral-700 font-bold select-none pointer-events-none">
                    {calendar.current.hours < 10 ? "0" + calendar.current.hours : calendar.current.hours} : {calendar.current.minutes < 10 ? "0" + calendar.current.minutes : calendar.current.minutes}
                </div>

            </div>
        </div >
    )

}

export const createSVGArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    if (startAngle > endAngle) {
        const s = startAngle;
        startAngle = endAngle;
        endAngle = s;
    }
    if (endAngle - startAngle > Math.PI * 2) {
        endAngle = Math.PI * 1.99999;
    }
    let largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;
    return (
        <svg className="h-full w-full" viewBox="0, 0, 100, 100">
            <circle cx={x} cy={y} r={r} fill="#bae6fd" stroke="none" strokeWidth="1" />
            <path
                d={`M ${x} ${y} L ${x + Math.cos(startAngle) * r} ${y - Math.sin(startAngle) * r} A ${r} ${r}, 0, ${largeArc}, 0, ${x + Math.cos(endAngle) * r} ${y - Math.sin(endAngle) * r} L ${x} ${y}`}
                fill="#fef9c3"
                stroke="none"
                fillOpacity={1}
            />
        </svg>
    )
}