type DEWeekStats = string[]

type DEMonthStats = {
    name: string,
    days: number
}

type DECalendarStats = {
    months: DEMonthStats[]
    week: DEWeekStats
    clock: number
    seasons: DESeasonStats[]
}

type DESeasonStats = {
    name: string,
    sunHoursPerDay: number,
    start: DEAbstractDate
}

type DECalendar = {
    stats: DECalendarStats
    current: DEDateTime
}

type DEAbstractDate = {
    day: number,
    month: number,
}

type DEDate = DEAbstractDate & {
    year: number
}

type DETime = {
    hours: number,
    minutes: number
}

type DEDateTime = DEDate & DETime

const EarthCalendar : DECalendar = {
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

const isBefore = (date1: DEAbstractDate, date2: DEAbstractDate) : boolean => {
    if (date1.month < date2.month) return true
    if (date1.month > date2.month) return false
    if (date1.day < date2.day) return true
    if (date1.day > date2.day) return false
    return false
}

const isAfterOrSame = (date1: DEAbstractDate, date2: DEAbstractDate) : boolean => {
    if (date1.month > date2.month) return true
    if (date1.month < date2.month) return false
    if (date1.day > date2.day) return true
    if (date1.day < date2.day) return false
    return true
}

const addOneDay = (date: DEDateTime, calendar: DECalendar) : DEDateTime => {
    const daysInMonth = calendar.stats.months[date.month - 1].days
    const daysInYear = calendar.stats.months.reduce((acc, month) => acc + month.days, 0)
    const daysInLeapYear = daysInYear + 1
    const isLeapYear = date.year % 4 === 0
    const daysInCurrentYear = isLeapYear ? daysInLeapYear : daysInYear

    const isLastDayInMonth = date.day === daysInMonth
    const isLastDayInYear = date.day === daysInCurrentYear

    const newDay = isLastDayInMonth ? 1 : date.day + 1
    const newMonth = isLastDayInMonth ? date.month + 1 : date.month
    const newYear = isLastDayInYear ? date.year + 1 : date.year

    return {
        ...date,
        day: newDay,
        month: newMonth,
        year: newYear
    }
}

const getSeason = (date: DEAbstractDate, calendar: DECalendar) : DESeasonStats => {
    for (let i = 0; i < calendar.stats.seasons.length - 1; ++i) {
        const season = calendar.stats.seasons[i % calendar.stats.seasons.length]
        const nextSeason = calendar.stats.seasons[(i + 1) % calendar.stats.seasons.length]

        if (isAfterOrSame(date, season.start) && isBefore(date, nextSeason.start)) {
            return season
        }
    }
    return calendar.stats.seasons[calendar.stats.seasons.length - 1]
}

const getWeekday = (date: DEDateTime, calendar: DECalendar) : string => {
    const daysPerYear = calendar.stats.months.reduce((acc, month) => acc + month.days, 0) * (date.year - 1);
    const daysSinceStart = calendar.stats.months
        .slice(0, date.month - 1)
        .reduce((acc, month) => acc + month.days, 0) + date.day - 1

    return calendar.stats.week[(daysPerYear + daysSinceStart) % calendar.stats.week.length]
}

/*

1 2 3 4 5 6 7
8 9 10 11 12 13 14
15 16 17 18 19 20 21
22 23 24 25 26 27 28
29 30 31 

1 2 3 4 
5 6 7 8 9 10 11
12 13 14 15 16 17 18
19 20 21 22 23 24 25
26 27 28 

*/

EarthCalendar.current = {
    day: 8,
    month: 2,
    year: 1,
    hours: 0,
    minutes: 0
}

console.log(EarthCalendar.current)
console.log(getSeason(EarthCalendar.current, EarthCalendar))
console.log(getWeekday(EarthCalendar.current, EarthCalendar))