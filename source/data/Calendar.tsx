export type DEWeekStats = string[]

export type DEMonthStats = {
    name: string,
    days: number
}

export type DECalendarStats = {
    months: DEMonthStats[]
    week: DEWeekStats
    clock: number
    seasons: DESeasonStats[]
    moons: DEMoon[]
}

export type DESeasonStats = {
    name: string,
    sunHoursPerDay: number,
    start: DEAbstractDate
}

export type DECalendar = {
    stats: DECalendarStats
    current: DEDateTime
}

export type DEAbstractDate = {
    day: number,
    month: number,
}

export type DEDate = DEAbstractDate & {
    year: number
}

export type DETime = {
    hours: number,
    minutes: number
}

export type DEMoon = {
    name: string,
    cycle: number
}

export type DEDateTime = DEDate & DETime

export const EarthCalendar : DECalendar = {
    stats: {
        clock: 24,
        week: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],
        months: [
            {
                name: "January",
                days: 31
            },
            {
                name: "February",
                days: 28
            },
            {
                name: "March",
                days: 31
            },
            {
                name: "April",
                days: 30
            },
            {
                name: "May",
                days: 31
            },
            {
                name: "June",
                days: 30
            },
            {
                name: "July",
                days: 31
            },
            {
                name: "August",
                days: 31
            },
            {
                name: "September",
                days: 30
            },
            {
                name: "October",
                days: 31
            },
            {
                name: "November",
                days: 30
            },
            {
                name: "December",
                days: 31
            }
        ],
        seasons: [
            {
                name: "Spring",
                sunHoursPerDay: 12,
                start: {
                    day: 1,
                    month: 3
                }
            },
            {
                name: "Summer",
                sunHoursPerDay: 16,
                start: {
                    day: 1,
                    month: 6
                }
            },
            {
                name: "Autumn",
                sunHoursPerDay: 12,
                start: {
                    day: 1,
                    month: 9
                }
            },
            {
                name: "Winter",
                sunHoursPerDay: 8,
                start: {
                    day: 1,
                    month: 12
                }
            }
        ],
        moons: [
            {
                name: "Luna",
                cycle: 28
            }
        ]
    },
    current: {
        day: 1,
        month: 1,
        year: 1,
        hours: 0,
        minutes: 0
    }
}

export const isBefore = (date1: DEAbstractDate, date2: DEAbstractDate) : boolean => {
    if (date1.month < date2.month) return true
    if (date1.month > date2.month) return false
    if (date1.day < date2.day) return true
    if (date1.day > date2.day) return false
    return false
}

export const isAfterOrSame = (date1: DEAbstractDate, date2: DEAbstractDate) : boolean => {
    if (date1.month > date2.month) return true
    if (date1.month < date2.month) return false
    if (date1.day > date2.day) return true
    if (date1.day < date2.day) return false
    return true
}

export const addOneDay = (date: DEDateTime, calendar: DECalendar) : DEDateTime => {
    const daysInMonth = calendar.stats.months[date.month - 1].days

    const isLastMonth = date.month === calendar.stats.months.length;
    const isLastDayInMonth = date.day === daysInMonth
    const isLastDayInYear = isLastMonth && isLastDayInMonth

    const newDay = isLastDayInMonth ? 1 : date.day + 1
    const newMonth = isLastDayInYear ? 1 : (isLastDayInMonth ? date.month + 1 : date.month)
    const newYear = isLastDayInYear ? date.year + 1 : date.year

    return {
        ...date,
        day: newDay,
        month: newMonth,
        year: newYear
    }
}

export const getSeason = (date: DEAbstractDate, calendar: DECalendar) : DESeasonStats => {
    for (let i = 0; i < calendar.stats.seasons.length - 1; ++i) {
        const season = calendar.stats.seasons[i % calendar.stats.seasons.length]
        const nextSeason = calendar.stats.seasons[(i + 1) % calendar.stats.seasons.length]

        console.log(season, nextSeason, isAfterOrSame(date, season.start), isBefore(date, nextSeason.start));
        if (isAfterOrSame(date, season.start) && isBefore(date, nextSeason.start)) {
            return season
        }
    }
    return calendar.stats.seasons[calendar.stats.seasons.length - 1]
}

export const getWeekday = (date: DEDateTime, calendar: DECalendar) : string => {
    const daysPerYear = calendar.stats.months.reduce((acc, month) => acc + month.days, 0) * (date.year - 1);
    const daysSinceStart = calendar.stats.months
        .slice(0, date.month - 1)
        .reduce((acc, month) => acc + month.days, 0) + date.day - 1

    return calendar.stats.week[(daysPerYear + daysSinceStart) % calendar.stats.week.length]
}

export enum MoonPhase {
    New = "New",
    WaxingCrescent = "Waxing Crescent",
    FirstQuarter = "First Quarter",
    WaxingGibbous = "Waxing Gibbous",
    Full = "Full",
    WaningGibbous = "Waning Gibbous",
    LastQuarter = "Last Quarter",
    WaningCrescent = "Waning Crescent"
}

export const getMoonPhases = (date: DEDateTime, calendar: DECalendar) : { [key: string] : MoonPhase } => {

    const daysPerYear = calendar.stats.months.reduce((acc, month) => acc + month.days, 0) * (date.year - 1);
    const daysSinceStart = calendar.stats.months
        .slice(0, date.month - 1)
        .reduce((acc, month) => acc + month.days, 0) + date.day - 1

    const res : { [key: string] : MoonPhase } = {}
    calendar.stats.moons.forEach(moon => {
        const dayInCycle = (daysPerYear + daysSinceStart) % moon.cycle;
        const phase = dayInCycle / moon.cycle;
        if (phase < 0.125) {
            res[moon.name] = MoonPhase.New
        } else if (phase < 0.25) {
            res[moon.name] = MoonPhase.WaxingCrescent
        } else if (phase < 0.375) {
            res[moon.name] = MoonPhase.FirstQuarter
        } else if (phase < 0.5) {
            res[moon.name] = MoonPhase.WaxingGibbous
        } else if (phase < 0.625) {
            res[moon.name] = MoonPhase.Full
        } else if (phase < 0.75) {
            res[moon.name] = MoonPhase.WaningGibbous
        } else if (phase < 0.875) {
            res[moon.name] = MoonPhase.LastQuarter
        } else {
            res[moon.name] = MoonPhase.WaningCrescent
        }
    })

    return res;
}

export const offsetMultiplier = (phase: MoonPhase) : number => {
    switch (phase) {
        case MoonPhase.New:
            return 0.1
        case MoonPhase.WaxingCrescent:
            return 0.25
        case MoonPhase.FirstQuarter:
            return 0.5
        case MoonPhase.WaxingGibbous:
            return 0.75
        case MoonPhase.Full:
            return 1
        case MoonPhase.WaningGibbous:
            return -0.75
        case MoonPhase.LastQuarter:
            return -0.5
        case MoonPhase.WaningCrescent:
            return -0.25
        default:
            return 0
    }
}

export const MoonIcon = (props: {
    phase: MoonPhase
    height?: number
}) => {
    return (
        <div className="rounded-full overflow-hidden white relative bg-[#e7e5e4] border-[1px] border-black" style={{
            height: props.height || 16,
            width: props.height || 16,
        }}>
            <div className="bg-black absolute top-0 bottom-0 rounded-full" style={{
                left: offsetMultiplier(props.phase) * (props.height || 16),
                width: (props.height || 16) - 2,
                height: (props.height || 16) - 2,
            }}></div>
        </div>

    )
}

export const addOneAbstractDay = (date: DEAbstractDate, calendar: DECalendar) : DEAbstractDate => {
    
    const daysInMonth = calendar.stats.months[date.month - 1].days

    const isLastMonth = date.month === calendar.stats.months.length
    const isLastDayInMonth = date.day === daysInMonth
    const isLastDayInYear = isLastMonth && isLastDayInMonth

    const newDay = isLastDayInMonth ? 1 : date.day + 1
    let newMonth = (isLastDayInMonth ? date.month + 1 : date.month);
    if (isLastDayInYear) {
        newMonth = 1
    }

    return {
        day: newDay,
        month: newMonth,
    }
}

export const getSunHours = (date: DEDateTime, calendar: DECalendar) : number => {
    const season = getSeason(date, calendar)

    const seasonIndex = calendar.stats.seasons.indexOf(season)
    const nextSeason = calendar.stats.seasons[(seasonIndex + 1) % calendar.stats.seasons.length]

    
    let dayInSeason = 0;
    let seasonLength = 0;
    let dateCopy = { ...season.start }

    if (seasonIndex == calendar.stats.seasons.length - 1) {
        const lastDayInYear : DEAbstractDate = {
            day: calendar.stats.months[calendar.stats.months.length - 1].days,
            month: calendar.stats.months.length
        }
        const firstDayInYear : DEAbstractDate = {
            day: 1,
            month: 1
        }

        const dateInOldYear = isBefore(date, season.start)
        while (isBefore(dateCopy, lastDayInYear)) {
            dateCopy = addOneAbstractDay(dateCopy, calendar)
            seasonLength += 1
            if (isBefore(firstDayInYear, date) || dateInOldYear) {
                dayInSeason += 1
            }
        }

        dateCopy = { ...firstDayInYear }
        while (isBefore(dateCopy, nextSeason.start)) {
            dateCopy = addOneAbstractDay(dateCopy, calendar)
            seasonLength += 1
            if (isBefore(dateCopy, date)) {
                dayInSeason += 1
            }
        }

    } else {
        while (isBefore(dateCopy, nextSeason.start)) {
            dateCopy = addOneAbstractDay(dateCopy, calendar)
            seasonLength += 1
            if (isBefore(dateCopy, date)) {
                dayInSeason += 1
            }
        }
    }

    const alpha = dayInSeason / seasonLength

    return season.sunHoursPerDay * (1 - alpha) + nextSeason.sunHoursPerDay * (alpha)
}