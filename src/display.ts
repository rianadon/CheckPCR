import { computeWeekId, createAssignment, getES, separatedClass } from './components/assignment'
import { createDay, createWeek } from './components/calendar'
import { displayError } from './components/errorDisplay'
import { resize } from './components/resizer'
import { fromDateNum, iterDays, today } from './dates'
import { classById, IApplicationData, IAssignment } from './pcr'
import { addActivity, saveActivity } from './plugins/activity'
import { extraToTask, ICustomAssignment } from './plugins/customAssignments'
import { assignmentInDone, removeFromDone, saveDone } from './plugins/done'
import { assignmentInModified, removeFromModified, saveModified } from './plugins/modifiedAssignments'
import { state } from './state'
import { _$, dateString, elemById, element, localStorageRead, smoothScroll } from './util'

export interface ISplitAssignment {
    assignment: IAssignment
    start: Date
    end: Date|'Forever'
    custom: boolean
    reference?: ICustomAssignment
}

const SCHEDULE_ENDS = {
    day: (date: Date) => 24 * 3600 * 1000,
    ms: (date: Date) => [24,              // Sunday
                         15 + (35 / 60),  // Monday
                         15 + (35 / 60),  // Tuesday
                         15 + (15 / 60),  // Wednesday
                         15 + (15 / 60),  // Thursday
                         15 + (15 / 60),  // Friday
                         24               // Saturday
                        ][date.getDay()],
    us: (date: Date) => 15 * 3600 * 1000
}
const WEEKEND_CLASSNAMES = ['fromWeekend', 'overWeekend']

let scroll = 0 // The location to scroll to in order to reach today in calendar view

export function getScroll(): number {
    return scroll
}

export function getTimeAfter(date: Date): number {
    const hideAssignments = state.hideAssignments.get()
    if (hideAssignments === 'day' || hideAssignments === 'ms' || hideAssignments === 'us') {
        return SCHEDULE_ENDS[hideAssignments](date)
    } else {
        return SCHEDULE_ENDS.day(date)
    }
}

function getStartEndDates(data: IApplicationData): {start: Date, end: Date } {
    if (data.monthView) {
        const startN = Math.min(...data.assignments.map((a) => a.start)) // Smallest date
        const endN = Math.max(...data.assignments.map((a) => a.start)) // Largest date

        const year = (new Date()).getFullYear() // For future calculations

        // Calculate what month we will be displaying by finding the month of today
        const month = (new Date()).getMonth() + state.calDateOffset.get()

        // Make sure the start and end dates lie within the month
        const start = new Date(Math.max(fromDateNum(startN).getTime(), (new Date(year, month)).getTime()))
        // If the day argument for Date is 0, then the resulting date will be of the previous month
        const end = new Date(Math.min(fromDateNum(endN).getTime(), (new Date(year, month + 1, 0)).getTime()))
        return { start, end }
      } else {
        const todaySE = new Date()
        const start = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate())
        const end = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate())
        return { start, end }
      }
}

function getAssignmentSplits(assignment: IAssignment, start: Date, end: Date,
                             reference?: ICustomAssignment): ISplitAssignment[] {
    const split: ISplitAssignment[] = []
    if (state.assignmentSpan.get() === 'multiple') {
        const s = Math.max(start.getTime(), fromDateNum(assignment.start).getTime())
        const e = assignment.end === 'Forever' ? s : Math.min(end.getTime(), fromDateNum(assignment.end).getTime())
        const span = ((e - s) / 1000 / 3600 / 24) + 1 // Number of days assignment takes up
        const spanRelative = 6 - (new Date(s)).getDay() // Number of days until the next Saturday

        const ns = new Date(s)
        ns.setDate(ns.getDate() + spanRelative) //  The date of the next Saturday

        // tslint:disable-next-line no-loops
        for (let n = -6; n < span - spanRelative; n += 7) {
            const lastSun = new Date(ns)
            lastSun.setDate(lastSun.getDate() + n)

            const nextSat = new Date(lastSun)
            nextSat.setDate(nextSat.getDate() + 6)
            split.push({
                assignment,
                start: new Date(Math.max(s, lastSun.getTime())),
                end: new Date(Math.min(e, nextSat.getTime())),
                custom: Boolean(reference),
                reference
            })
        }
    } else if (state.assignmentSpan.get() === 'start') {
        const s = fromDateNum(assignment.start)
        if (s.getTime() >= start.getTime()) {
            split.push({
                assignment,
                start: s,
                end: s,
                custom: Boolean(reference),
                reference
            })
        }
    } else if (state.assignmentSpan.get() === 'end') {
        const e = assignment.end === 'Forever' ? assignment.end : fromDateNum(assignment.end)
        const de = e === 'Forever' ? fromDateNum(assignment.start) : e
        if (de.getTime() <= end.getTime()) {
            split.push({
                assignment,
                start: de,
                end: e,
                custom: Boolean(reference),
                reference
            })
        }
    }

    return split
}

// This function will convert the array of assignments generated by *parse* into readable HTML.
export function display(doScroll: boolean = true): void {
    console.time('Displaying data')
    try {
        const data = state.data.get()
        if (!data) {
            throw new Error('Data should have been fetched before display() was called')
        }

        document.body.setAttribute('data-pcrview', data.monthView ? 'month' : 'other')
        const main = _$(document.querySelector('main'))
        const taken: { [date: number]: number[] } = {}

        const timeafter = getTimeAfter(new Date())

        const {start, end} = getStartEndDates(data)

        // Set the start date to be a Sunday and the end date to be a Saturday
        start.setDate(start.getDate() - start.getDay())
        end.setDate(end.getDate() + (6 - end.getDay()))

        // First populate the calendar with boxes for each day
        // Only consider the previous set of assignments for activity purposes if the month is the same
        const lastData = data.monthOffset === 0 ? (localStorageRead('data') as IApplicationData) : null
        let wk: HTMLElement|null = null
        iterDays(start, end, (d) => {
            if (d.getDay() === 0) {
                const id = `wk${d.getMonth()}-${d.getDate()}` // Don't create a new week element if one already exists
                wk = document.getElementById(id)
                if (wk == null) {
                    wk = createWeek(id)
                    main.appendChild(wk)
                }
            }

            if (!wk) throw new Error(`Expected week element on day ${d} to not be null`)
            if (wk.getElementsByClassName('day').length <= d.getDay()) {
                wk.appendChild(createDay(d))
            }

            taken[d.getTime()] = []
        })

        // Split assignments taking more than 1 week
        const split: ISplitAssignment[] = []
        data.assignments.forEach((assignment, num) => {
            split.push(...getAssignmentSplits(assignment, start, end))

            // Activity stuff
            if (lastData != null) {
                const oldAssignment = lastData.assignments.find((a) => a.id === assignment.id)
                if (oldAssignment) {
                    if (oldAssignment.body !== assignment.body) {
                        addActivity('edit', oldAssignment, new Date(), true,
                                    oldAssignment.class != null ? lastData.classes[oldAssignment.class] : undefined)
                        removeFromModified(assignment.id) // If the assignment is modified, reset it
                    }
                    lastData.assignments.splice(lastData.assignments.indexOf(oldAssignment), 1)
                } else {
                    addActivity('add', assignment, new Date(), true)
                }
            }
        })

        if (lastData != null) {
            // Check if any of the last assignments weren't deleted (so they have been deleted in PCR)
            lastData.assignments.forEach((assignment) => {
                addActivity('delete', assignment, new Date(), true,
                            assignment.class != null ? lastData.classes[assignment.class] : undefined)
                removeFromDone(assignment.id)
                removeFromModified(assignment.id)
            })

            // Then save a maximum of 128 activity items
            saveActivity()

            // And completed assignments + modifications
            saveDone()
            saveModified()
        }

        // Add custom assignments to the split array
        state.extra.get().forEach((custom) => {
            split.push(...getAssignmentSplits(extraToTask(custom, data), start, end, custom))
        })

        // Calculate the today's week id
        const tdst = new Date()
        tdst.setDate(tdst.getDate() - tdst.getDay())
        const todayWkId = `wk${tdst.getMonth()}-${tdst.getDate()}`

        // Then add assignments
        const weekHeights: { [weekId: string]: number } = {}
        const previousAssignments: { [id: string]: HTMLElement } = {}
        Array.prototype.forEach.call(document.getElementsByClassName('assignment'), (assignment: HTMLElement) => {
            previousAssignments[assignment.id] = assignment
        })

        split.forEach((s) => {
            const weekId = computeWeekId(s)
            wk = document.getElementById(weekId)
            if (wk == null) return

            const e = createAssignment(s, data)

            // Calculate how many assignments are placed before the current one
            if (!s.custom || !state.sepTasks.get()) {
                let pos = 0
                // tslint:disable-next-line no-loops
                while (true) {
                    let found = true
                    iterDays(s.start, s.end === 'Forever' ? s.start : s.end, (d) => {
                        if (taken[d.getTime()].indexOf(pos) !== -1) {
                            found = false
                        }
                    })
                    if (found) { break }
                    pos++
                }

                // Append the position the assignment is at to the taken array
                iterDays(s.start, s.end === 'Forever' ? s.start : s.end, (d) => {
                    taken[d.getTime()].push(pos)
                })

                // Calculate how far down the assignment must be placed as to not block the ones above it
                e.style.marginTop = (pos * 30) + 'px'

                if ((weekHeights[weekId] == null) || (pos > weekHeights[weekId])) {
                    weekHeights[weekId] = pos
                    wk.style.height = 47 + ((pos + 1) * 30) + 'px'
                }
            }

            // If the assignment is a test and is upcoming, add it to the upcoming tests panel.
            if (s.assignment.end >= today() && (s.assignment.baseType === 'test' ||
                (state.projectsInTestPane.get() && s.assignment.baseType === 'longterm'))) {
                const te = element('div', ['upcomingTest', 'assignmentItem', s.assignment.baseType],
                                `<i class='material-icons'>
                                        ${s.assignment.baseType === 'longterm' ? 'assignment' : 'assessment'}
                                    </i>
                                    <span class='title'>${s.assignment.title}</span>
                                    <small>${separatedClass(s.assignment, data)[2]}</small>
                                    <div class='range'>${dateString(s.assignment.end, true)}</div>`,
                                `test${s.assignment.id}`)
                if (s.assignment.class) te.setAttribute('data-class', data.classes[s.assignment.class])
                te.addEventListener('click', () => {
                    const doScrolling = async () => {
                        await smoothScroll((e.getBoundingClientRect().top + document.body.scrollTop) - 116)
                        e.click()
                    }
                    if (document.body.getAttribute('data-view') === '0') {
                        doScrolling()
                    } else {
                        _$(document.querySelector('#navTabs>li:first-child') as HTMLElement).click()
                        setTimeout(doScrolling, 500)
                    }
                })

                if (assignmentInDone(s.assignment.id)) {
                    te.classList.add('done')
                }
                const testElem = document.getElementById(`test${s.assignment.id}`)
                if (testElem) {
                testElem.innerHTML = te.innerHTML
                } else {
                    elemById('infoTests').appendChild(te)
                }
            }

            const already = document.getElementById(s.assignment.id + weekId)
            if (already != null) { // Assignment already exists
                already.style.marginTop = e.style.marginTop
                already.setAttribute('data-class',
                    s.custom && state.sepTaskClass.get() ? 'Task' : classById(s.assignment.class))
                if (!assignmentInModified(s.assignment.id)) {
                    already.getElementsByClassName('body')[0].innerHTML = e.getElementsByClassName('body')[0].innerHTML
                }
                _$(already.querySelector('.edits')).className = _$(e.querySelector('.edits')).className
                if (already.classList.toggle) {
                    already.classList.toggle('listDisp', e.classList.contains('listDisp'))
                }
                getES(already).forEach((cl) => already.classList.remove(cl))
                getES(e).forEach((cl) => already.classList.add(cl))
                WEEKEND_CLASSNAMES.forEach((cl) => {
                    already.classList.remove(cl)
                    if (e.classList.contains(cl)) already.classList.add(cl)
                })
            } else {
                if (s.custom && state.sepTasks.get()) {
                    const st = Math.floor(s.start.getTime() / 1000 / 3600 / 24)
                    if ((s.assignment.start === st) &&
                        (s.assignment.end === 'Forever' || s.assignment.end >= today())) {
                        e.classList.remove('assignment')
                        e.classList.add('taskPaneItem')
                        e.style.order = String(s.assignment.end === 'Forever' ? Number.MAX_VALUE : s.assignment.end)
                        const link = e.querySelector('.linked')
                        if (link) {
                            e.insertBefore(element('small', [], link.innerHTML), link)
                            link.remove()
                        }
                        elemById('infoTasksInner').appendChild(e)
                    }
                } else { wk.appendChild(e) }
            }
            delete previousAssignments[s.assignment.id + weekId]
        })

        // Delete any assignments that have been deleted since updating
        Object.entries(previousAssignments).forEach(([name, assignment]) => {
            if (assignment.classList.contains('full')) {
                elemById('background').classList.remove('active')
            }
            assignment.remove()
        })

        // Scroll to the correct position in calendar view
        if (weekHeights[todayWkId] != null) {
            let h = 0
            const sw = (wkid: string) => wkid.substring(2).split('-').map((x) => Number(x))
            const todayWk = sw(todayWkId)
            Object.entries(weekHeights).forEach(([wkId, val]) => {
                const wkSplit = sw(wkId)
                if ((wkSplit[0] < todayWk[0]) || ((wkSplit[0] === todayWk[0]) && (wkSplit[1] < todayWk[1]))) {
                    h += val
                }
            })
            scroll = (h * 30) + 112 + 14
            // Also show the day headers if today's date is displayed in the first row of the calendar
            if (scroll < 50) scroll = 0
            if (doScroll && (document.body.getAttribute('data-view') === '0') &&
                !document.body.querySelector('.full')) {
                // in calendar view
                window.scrollTo(0, scroll)
            }
        }

        document.body.classList.toggle('noList',
            document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0)
        if (document.body.getAttribute('data-view') === '1') { // in list view
            resize()
        }
    } catch (err) {
        displayError(err)
    }
    console.timeEnd('Displaying data')
}

// The function below converts an update time to a human-readable date.
export function formatUpdate(date: number): string {
  const now = new Date()
  const update = new Date(+date)
  if (now.getDate() === update.getDate()) {
    let ampm = 'AM'
    let hr = update.getHours()
    if (hr > 12) {
      ampm = 'PM'
      hr -= 12
    }
    const min = update.getMinutes()
    return `Today at ${hr}:${min < 10 ? `0${min}` : min} ${ampm}`
  } else {
    const daysPast = Math.ceil((now.getTime() - update.getTime()) / 1000 / 3600 / 24)
    if (daysPast === 1) { return 'Yesterday' } else { return daysPast + ' days ago' }
  }
}
