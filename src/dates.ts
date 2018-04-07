export function tzoff(): number {
    return (new Date()).getTimezoneOffset() * 1000 * 60 // For future calculations
}

export function toDateNum(date: Date|number): number {
    const num = date instanceof Date ? date.getTime() : date
    return Math.floor((num - tzoff()) / 1000 / 3600 / 24)
}

// *FromDateNum* converts a number of days to a number of seconds
export function fromDateNum(days: number): Date {
    const d = new Date((days * 1000 * 3600 * 24) + tzoff())
    // The checks below are to handle daylight savings time
    if (d.getHours() === 1) { d.setHours(0) }
    if ((d.getHours() === 22) || (d.getHours() === 23)) {
      d.setHours(24)
      d.setMinutes(0)
      d.setSeconds(0)
    }
    return d
}

export function today(): number {
    return toDateNum(new Date())
}

/**
 * Iterates from the starting date to ending date inclusive
 */
export function iterDays(start: Date, end: Date, cb: (date: Date) => void): void {
    // tslint:disable-next-line no-loops
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        cb(d)
    }
}
